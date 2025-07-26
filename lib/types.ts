/**
 * Blood Pressure Data Types
 * TypeScript interfaces for the blood pressure tracking application
 */

// Core blood pressure reading interface
export interface BloodPressureReading {
  systolic: number;
  diastolic: number;
  timestamp: number;
}

// Application state for managing the blood pressure simulator
export interface AppState {
  currentReading: BloodPressureReading | null;
  datasetSize: number;
  currentIndex: number;
  isInitialized: boolean;
}

// Configuration for blood pressure ranges
export interface BloodPressureConfig {
  systolic: {
    min: number;
    max: number;
  };
  diastolic: {
    min: number;
    max: number;
  };
  pulsePresssure: {
    min: number;
    max: number;
  };
}

// Storage keys for localStorage persistence
export interface StorageKeys {
  dataset: string;
  index: string;
  timestamp: string;
}

// Error types for better error handling
export interface AppError {
  type: 'STORAGE_ERROR' | 'GENERATION_ERROR' | 'VALIDATION_ERROR';
  message: string;
  details?: string;
}

// Dataset generation result
export interface DatasetResult {
  success: boolean;
  dataset?: BloodPressureReading[];
  error?: AppError;
}

// Storage operation result
export interface StorageResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: AppError;
}
