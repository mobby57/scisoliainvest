import { Decimal } from 'decimal.js';
import axios from 'axios';

export interface ExternalTaxSystem {
  name: string;
  baseUrl: string;
  authenticate(): Promise<string>;
  calculateTax(data: any): Promise<Decimal>;
  validateData(data: any): Promise<boolean>;
}

export interface TaxCalculationRequest {
  type: 'IS' | 'TVA' | 'SCI' | 'CFE' | 'CVAE';
  data: any;
  year: number;
}

export interface TaxCalculationResponse {
  amount: Decimal;
  details: any;
  source: string;
  timestamp: Date;
}

// Adaptateur pour l'API DGFiP (Direction Générale des Finances Publiques)
export class DGFiPAdapter implements ExternalTaxSystem {
  name = 'DGFiP';
  baseUrl = 'https://api.impots.gouv.fr';
  private token?: string;

  async authenticate(): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/auth`, {
        clientId: process.env.DGFIP_CLIENT_ID,
        clientSecret: process.env.DGFIP_CLIENT_SECRET
      });
      this.token = response.data.access_token;
      return this.token;
    } catch (error) {
      throw new Error(`DGFiP authentication failed: ${error}`);
    }
  }

  async calculateTax(data: TaxCalculationRequest): Promise<Decimal> {
    if (!this.token) await this.authenticate();
    
    try {
      const response = await axios.post(`${this.baseUrl}/calculate`, data, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      return new Decimal(response.data.amount);
    } catch (error) {
      throw new Error(`DGFiP calculation failed: ${error}`);
    }
  }

  async validateData(data: any): Promise<boolean> {
    if (!this.token) await this.authenticate();
    
    try {
      const response = await axios.post(`${this.baseUrl}/validate`, data, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }
}

// Adaptateur pour système comptable externe (ex: Sage, Cegid)
export class ComptabiliteAdapter implements ExternalTaxSystem {
  name = 'Comptabilite';
  baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async authenticate(): Promise<string> {
    return this.apiKey;
  }

  async calculateTax(data: TaxCalculationRequest): Promise<Decimal> {
    try {
      const response = await axios.post(`${this.baseUrl}/tax/calculate`, data, {
        headers: { 'X-API-Key': this.apiKey }
      });
      return new Decimal(response.data.result);
    } catch (error) {
      throw new Error(`Comptabilite calculation failed: ${error}`);
    }
  }

  async validateData(data: any): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/validate`, data, {
        headers: { 'X-API-Key': this.apiKey }
      });
      return response.data.isValid;
    } catch (error) {
      return false;
    }
  }
}

// Gestionnaire d'adaptateurs
export class TaxAdapterManager {
  private adapters: Map<string, ExternalTaxSystem> = new Map();
  private fallbackEnabled = true;

  addAdapter(adapter: ExternalTaxSystem): void {
    this.adapters.set(adapter.name, adapter);
  }

  async calculateWithFallback(request: TaxCalculationRequest): Promise<TaxCalculationResponse> {
    const errors: string[] = [];
    
    for (const [name, adapter] of this.adapters) {
      try {
        const amount = await adapter.calculateTax(request);
        return {
          amount,
          details: request.data,
          source: name,
          timestamp: new Date()
        };
      } catch (error) {
        errors.push(`${name}: ${error}`);
        continue;
      }
    }
    
    if (this.fallbackEnabled) {
      // Calcul local en fallback
      const localAmount = this.calculateLocal(request);
      return {
        amount: localAmount,
        details: request.data,
        source: 'local_fallback',
        timestamp: new Date()
      };
    }
    
    throw new Error(`All adapters failed: ${errors.join(', ')}`);
  }

  private calculateLocal(request: TaxCalculationRequest): Decimal {
    // Implémentation basique locale
    switch (request.type) {
      case 'TVA':
        return new Decimal(request.data.montantHT || 0).times(0.20);
      case 'IS':
        return new Decimal(request.data.benefice || 0).times(0.25);
      default:
        return new Decimal(0);
    }
  }

  async validateWithMultipleSources(data: any): Promise<{
    isValid: boolean;
    sources: Array<{ name: string; valid: boolean; error?: string }>;
  }> {
    const results = await Promise.allSettled(
      Array.from(this.adapters.entries()).map(async ([name, adapter]) => {
        try {
          const valid = await adapter.validateData(data);
          return { name, valid };
        } catch (error) {
          return { name, valid: false, error: String(error) };
        }
      })
    );

    const sources = results.map(result => 
      result.status === 'fulfilled' ? result.value : { name: 'unknown', valid: false, error: 'Promise rejected' }
    );

    const isValid = sources.some(source => source.valid);

    return { isValid, sources };
  }
}

// Cache pour les résultats de calculs
export class TaxCalculationCache {
  private cache: Map<string, { result: TaxCalculationResponse; expiry: Date }> = new Map();
  private defaultTTL = 3600000; // 1 heure

  private generateKey(request: TaxCalculationRequest): string {
    return `${request.type}_${request.year}_${JSON.stringify(request.data)}`;
  }

  get(request: TaxCalculationRequest): TaxCalculationResponse | null {
    const key = this.generateKey(request);
    const cached = this.cache.get(key);
    
    if (!cached || cached.expiry < new Date()) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.result;
  }

  set(request: TaxCalculationRequest, result: TaxCalculationResponse, ttl?: number): void {
    const key = this.generateKey(request);
    const expiry = new Date(Date.now() + (ttl || this.defaultTTL));
    this.cache.set(key, { result, expiry });
  }

  clear(): void {
    this.cache.clear();
  }
}