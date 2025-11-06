/**
 * IoT Sensor Model - For real-time property monitoring
 * Tracks temperature, humidity, energy, occupancy, and other metrics
 */

export interface IoTSensor {
  id: string;
  deviceId: string;
  tenantId: string;
  propertyId: string;
  
  // Sensor details
  name: string;
  type: SensorType;
  manufacturer?: string;
  model?: string;
  firmwareVersion?: string;
  
  // Location
  location: string; // e.g., "Building A - Floor 2 - Room 205"
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  
  // Status
  status: SensorStatus;
  lastOnline: Date;
  batteryLevel?: number; // 0-100
  signalStrength?: number; // 0-100
  
  // Configuration
  measurementUnit: string;
  samplingInterval: number; // in seconds
  alertThresholds?: {
    min?: number;
    max?: number;
    critical?: number;
  };
  
  // Calibration
  calibratedAt?: Date;
  calibrationDueDate?: Date;
  
  // Audit
  installedAt: Date;
  installedBy: string;
  lastMaintenanceDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SensorReading {
  id: string;
  sensorId: string;
  deviceId: string;
  propertyId: string;
  tenantId: string;
  
  // Reading data
  sensorType: SensorType;
  value: number;
  unit: string;
  quality: ReadingQuality; // Data quality indicator
  
  // Context
  timestamp: Date;
  location?: string;
  
  // Metadata
  anomalyDetected?: boolean;
  anomalyScore?: number;
  aggregationPeriod?: string; // e.g., '5min', '1hour', '1day'
}

export enum SensorType {
  // Environmental
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  AIR_QUALITY = 'air_quality',
  CO2 = 'co2',
  VOC = 'voc', // Volatile Organic Compounds
  
  // Energy
  ENERGY_CONSUMPTION = 'energy_consumption',
  POWER = 'power',
  VOLTAGE = 'voltage',
  CURRENT = 'current',
  
  // Occupancy & Security
  OCCUPANCY = 'occupancy',
  MOTION = 'motion',
  DOOR_SENSOR = 'door_sensor',
  WINDOW_SENSOR = 'window_sensor',
  SMOKE_DETECTOR = 'smoke_detector',
  
  // Water & Utilities
  WATER_CONSUMPTION = 'water_consumption',
  WATER_LEAK = 'water_leak',
  GAS_CONSUMPTION = 'gas_consumption',
  
  // Comfort
  LIGHT_LEVEL = 'light_level',
  NOISE_LEVEL = 'noise_level',
  PRESSURE = 'pressure',
}

export enum SensorStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
  CALIBRATION_NEEDED = 'calibration_needed',
  BATTERY_LOW = 'battery_low',
}

export enum ReadingQuality {
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  INVALID = 'invalid',
}

export interface SensorAlert {
  id: string;
  sensorId: string;
  propertyId: string;
  tenantId: string;
  
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  
  // Reading that triggered alert
  triggerValue: number;
  thresholdValue: number;
  
  // Status
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
  
  // Actions taken
  actions?: string[];
  notes?: string;
  
  createdAt: Date;
}

export enum AlertType {
  THRESHOLD_EXCEEDED = 'threshold_exceeded',
  THRESHOLD_BELOW = 'threshold_below',
  ANOMALY_DETECTED = 'anomaly_detected',
  SENSOR_OFFLINE = 'sensor_offline',
  BATTERY_LOW = 'battery_low',
  CALIBRATION_DUE = 'calibration_due',
  DATA_QUALITY_POOR = 'data_quality_poor',
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export interface CreateSensorInput {
  deviceId: string;
  tenantId: string;
  propertyId: string;
  name: string;
  type: SensorType;
  location: string;
  manufacturer?: string;
  model?: string;
  measurementUnit: string;
  samplingInterval: number;
  alertThresholds?: {
    min?: number;
    max?: number;
    critical?: number;
  };
  installedBy: string;
}

export interface SensorAnalytics {
  sensorId: string;
  propertyId: string;
  period: {
    start: Date;
    end: Date;
  };
  
  // Statistics
  average: number;
  min: number;
  max: number;
  median: number;
  stdDeviation: number;
  
  // Trends
  trend: 'increasing' | 'decreasing' | 'stable';
  trendPercentage: number;
  
  // Anomalies
  anomalyCount: number;
  anomalyPercentage: number;
  
  // Alerts
  alertCount: number;
  criticalAlertCount: number;
  
  // Data quality
  dataPoints: number;
  missingDataPoints: number;
  dataQualityScore: number; // 0-100
}

// Helper functions
export function getSensorIcon(type: SensorType): string {
  const icons: Record<SensorType, string> = {
    [SensorType.TEMPERATURE]: '🌡️',
    [SensorType.HUMIDITY]: '💧',
    [SensorType.AIR_QUALITY]: '🌬️',
    [SensorType.CO2]: '☁️',
    [SensorType.VOC]: '🧪',
    [SensorType.ENERGY_CONSUMPTION]: '⚡',
    [SensorType.POWER]: '🔌',
    [SensorType.VOLTAGE]: '⚡',
    [SensorType.CURRENT]: '⚡',
    [SensorType.OCCUPANCY]: '👥',
    [SensorType.MOTION]: '🚶',
    [SensorType.DOOR_SENSOR]: '🚪',
    [SensorType.WINDOW_SENSOR]: '🪟',
    [SensorType.SMOKE_DETECTOR]: '🔥',
    [SensorType.WATER_CONSUMPTION]: '💦',
    [SensorType.WATER_LEAK]: '💧',
    [SensorType.GAS_CONSUMPTION]: '🔥',
    [SensorType.LIGHT_LEVEL]: '💡',
    [SensorType.NOISE_LEVEL]: '🔊',
    [SensorType.PRESSURE]: '🌐',
  };
  return icons[type] || '📊';
}

export function getSensorUnit(type: SensorType): string {
  const units: Partial<Record<SensorType, string>> = {
    [SensorType.TEMPERATURE]: '°C',
    [SensorType.HUMIDITY]: '%',
    [SensorType.CO2]: 'ppm',
    [SensorType.ENERGY_CONSUMPTION]: 'kWh',
    [SensorType.POWER]: 'W',
    [SensorType.VOLTAGE]: 'V',
    [SensorType.CURRENT]: 'A',
    [SensorType.WATER_CONSUMPTION]: 'L',
    [SensorType.GAS_CONSUMPTION]: 'm³',
    [SensorType.LIGHT_LEVEL]: 'lux',
    [SensorType.NOISE_LEVEL]: 'dB',
    [SensorType.PRESSURE]: 'Pa',
  };
  return units[type] || 'unit';
}
