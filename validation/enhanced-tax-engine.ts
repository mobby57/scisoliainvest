import { Decimal } from 'decimal.js';
import { z } from 'zod';

export interface TaxRule {
  id: string;
  name: string;
  type: 'IS' | 'TVA' | 'SCI' | 'CFE' | 'CVAE' | 'IFI' | 'PLUS_VALUE' | 'TAXE_FONCIERE';
  calculate: (input: any) => Decimal;
  validate: (input: any) => boolean;
  metadata?: {
    description?: string;
    applicableFrom?: Date;
    applicableTo?: Date;
    region?: string;
  };
}

export class EnhancedTaxEngine {
  private rules: Map<string, TaxRule> = new Map();
  private ruleHistory: Map<string, TaxRule[]> = new Map();

  addRule(rule: TaxRule): void {
    const existingRule = this.rules.get(rule.id);
    if (existingRule) {
      if (!this.ruleHistory.has(rule.id)) {
        this.ruleHistory.set(rule.id, []);
      }
      this.ruleHistory.get(rule.id)!.push(existingRule);
    }
    this.rules.set(rule.id, rule);
  }

  calculate(ruleId: string, input: any, date?: Date): Decimal {
    const rule = this.getApplicableRule(ruleId, date);
    if (!rule) throw new Error(`Rule ${ruleId} not found or not applicable`);
    if (!rule.validate(input)) throw new Error(`Invalid input for rule ${ruleId}`);
    return rule.calculate(input);
  }

  private getApplicableRule(ruleId: string, date?: Date): TaxRule | null {
    const rule = this.rules.get(ruleId);
    if (!rule) return null;
    
    if (!date) return rule;
    
    const { applicableFrom, applicableTo } = rule.metadata || {};
    if (applicableFrom && date < applicableFrom) return null;
    if (applicableTo && date > applicableTo) return null;
    
    return rule;
  }

  getAllRules(): TaxRule[] {
    return Array.from(this.rules.values());
  }

  getRulesByType(type: TaxRule['type']): TaxRule[] {
    return this.getAllRules().filter(rule => rule.type === type);
  }
}

// IFI (Impôt sur la Fortune Immobilière)
export const IFI_RULE: TaxRule = {
  id: 'ifi',
  name: 'Impôt sur la Fortune Immobilière',
  type: 'IFI',
  validate: (input) => input.patrimoineNet && typeof input.patrimoineNet === 'object',
  calculate: (input) => {
    const patrimoine = new Decimal(input.patrimoineNet);
    
    if (patrimoine.lt(1300000)) return new Decimal(0);
    
    let impot = new Decimal(0);
    
    // Tranche 1: 800 000 à 1 300 000 € - 0,50%
    if (patrimoine.gt(800000)) {
      const tranche1 = Decimal.min(patrimoine, new Decimal(1300000)).minus(800000);
      impot = impot.plus(tranche1.times(0.005));
    }
    
    // Tranche 2: 1 300 000 à 2 570 000 € - 0,70%
    if (patrimoine.gt(1300000)) {
      const tranche2 = Decimal.min(patrimoine, new Decimal(2570000)).minus(1300000);
      impot = impot.plus(tranche2.times(0.007));
    }
    
    // Tranche 3: 2 570 000 à 5 000 000 € - 1,00%
    if (patrimoine.gt(2570000)) {
      const tranche3 = Decimal.min(patrimoine, new Decimal(5000000)).minus(2570000);
      impot = impot.plus(tranche3.times(0.01));
    }
    
    // Tranche 4: 5 000 000 à 10 000 000 € - 1,25%
    if (patrimoine.gt(5000000)) {
      const tranche4 = Decimal.min(patrimoine, new Decimal(10000000)).minus(5000000);
      impot = impot.plus(tranche4.times(0.0125));
    }
    
    // Tranche 5: > 10 000 000 € - 1,50%
    if (patrimoine.gt(10000000)) {
      const tranche5 = patrimoine.minus(10000000);
      impot = impot.plus(tranche5.times(0.015));
    }
    
    return impot;
  },
  metadata: {
    description: 'Calcul de l\'IFI selon le barème 2024',
    applicableFrom: new Date('2024-01-01')
  }
};

// Plus-value immobilière
export const PLUS_VALUE_RULE: TaxRule = {
  id: 'plus_value_immobiliere',
  name: 'Plus-value immobilière',
  type: 'PLUS_VALUE',
  validate: (input) => input.prixVente && input.prixAchat && input.dureeDetention,
  calculate: (input) => {
    const { prixVente, prixAchat, fraisAchat = 0, fraisVente = 0, travaux = 0, dureeDetention } = input;
    
    const plusValueBrute = new Decimal(prixVente)
      .minus(prixAchat)
      .minus(fraisAchat)
      .minus(fraisVente)
      .minus(travaux);
    
    if (plusValueBrute.lte(0)) return new Decimal(0);
    
    // Abattement pour durée de détention
    let tauxAbattement = new Decimal(0);
    if (dureeDetention >= 6) {
      tauxAbattement = new Decimal(6).times(dureeDetention - 5);
    }
    if (dureeDetention >= 22) {
      tauxAbattement = new Decimal(100); // Exonération totale
    }
    
    const abattement = plusValueBrute.times(tauxAbattement).div(100);
    const plusValueNette = plusValueBrute.minus(abattement);
    
    // Impôt à 19%
    return plusValueNette.times(0.19);
  }
};

// Taxe foncière
export const TAXE_FONCIERE_RULE: TaxRule = {
  id: 'taxe_fonciere',
  name: 'Taxe foncière',
  type: 'TAXE_FONCIERE',
  validate: (input) => input.valeurLocativeCadastrale && input.commune,
  calculate: (input) => {
    const { valeurLocativeCadastrale, commune } = input;
    const vlc = new Decimal(valeurLocativeCadastrale);
    
    // Taux communal (exemple)
    const tauxCommune = new Decimal(commune.tauxTaxeFonciere || 23.48);
    const tauxDepartement = new Decimal(commune.tauxDepartement || 15.09);
    const tauxRegion = new Decimal(commune.tauxRegion || 2.76);
    
    const tauxTotal = tauxCommune.plus(tauxDepartement).plus(tauxRegion);
    
    return vlc.times(tauxTotal).div(100);
  }
};