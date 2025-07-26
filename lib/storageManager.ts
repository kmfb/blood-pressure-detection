/**
 * Storage Manager
 * Handles localStorage operations and state persistence for blood pressure data
 */

import type { AppError, BloodPressureReading, StorageKeys, StorageResult } from './types';

// Storage keys configuration
const STORAGE_KEYS: StorageKeys = {
  dataset: 'bp-dataset',
  index: 'bp-index',
  timestamp: 'bp-timestamp',
};

/**
 * Checks if localStorage is available in the current environment
 */
function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a standardized error for storage operations
 */
function createStorageError(message: string, details?: string): AppError {
  return {
    type: 'STORAGE_ERROR',
    message,
    details,
  };
}

/**
 * Safely parses JSON with error handling
 */
function safeJsonParse<T>(jsonString: string): StorageResult<T> {
  try {
    const data = JSON.parse(jsonString) as T;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: createStorageError(
        'Failed to parse JSON data',
        error instanceof Error ? error.message : 'Invalid JSON format',
      ),
    };
  }
}

/**
 * Stores the blood pressure dataset in localStorage
 */
export function storeDataset(dataset: BloodPressureReading[]): StorageResult<void> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: createStorageError('localStorage is not available'),
    };
  }

  try {
    const jsonData = JSON.stringify(dataset);
    localStorage.setItem(STORAGE_KEYS.dataset, jsonData);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: createStorageError(
        'Failed to store dataset',
        error instanceof Error ? error.message : 'Unknown storage error',
      ),
    };
  }
}

/**
 * Retrieves the blood pressure dataset from localStorage
 */
export function getDataset(): StorageResult<BloodPressureReading[]> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: createStorageError('localStorage is not available'),
    };
  }

  try {
    const jsonData = localStorage.getItem(STORAGE_KEYS.dataset);
    if (!jsonData) {
      return {
        success: false,
        error: createStorageError('No dataset found in storage'),
      };
    }

    return safeJsonParse<BloodPressureReading[]>(jsonData);
  } catch (error) {
    return {
      success: false,
      error: createStorageError(
        'Failed to retrieve dataset',
        error instanceof Error ? error.message : 'Unknown retrieval error',
      ),
    };
  }
}

/**
 * Stores the current index in localStorage
 */
export function storeCurrentIndex(index: number): StorageResult<void> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: createStorageError('localStorage is not available'),
    };
  }

  try {
    localStorage.setItem(STORAGE_KEYS.index, index.toString());
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: createStorageError(
        'Failed to store current index',
        error instanceof Error ? error.message : 'Unknown storage error',
      ),
    };
  }
}

/**
 * Retrieves the current index from localStorage
 */
export function getCurrentIndex(): StorageResult<number> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: createStorageError('localStorage is not available'),
    };
  }

  try {
    const indexString = localStorage.getItem(STORAGE_KEYS.index);
    if (indexString === null) {
      return {
        success: false,
        error: createStorageError('No index found in storage'),
      };
    }

    const index = parseInt(indexString, 10);
    if (isNaN(index)) {
      return {
        success: false,
        error: createStorageError('Invalid index format in storage'),
      };
    }

    return { success: true, data: index };
  } catch (error) {
    return {
      success: false,
      error: createStorageError(
        'Failed to retrieve current index',
        error instanceof Error ? error.message : 'Unknown retrieval error',
      ),
    };
  }
}

/**
 * Stores the initialization timestamp in localStorage
 */
export function storeTimestamp(timestamp: number): StorageResult<void> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: createStorageError('localStorage is not available'),
    };
  }

  try {
    localStorage.setItem(STORAGE_KEYS.timestamp, timestamp.toString());
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: createStorageError(
        'Failed to store timestamp',
        error instanceof Error ? error.message : 'Unknown storage error',
      ),
    };
  }
}

/**
 * Retrieves the initialization timestamp from localStorage
 */
export function getTimestamp(): StorageResult<number> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: createStorageError('localStorage is not available'),
    };
  }

  try {
    const timestampString = localStorage.getItem(STORAGE_KEYS.timestamp);
    if (timestampString === null) {
      return {
        success: false,
        error: createStorageError('No timestamp found in storage'),
      };
    }

    const timestamp = parseInt(timestampString, 10);
    if (isNaN(timestamp)) {
      return {
        success: false,
        error: createStorageError('Invalid timestamp format in storage'),
      };
    }

    return { success: true, data: timestamp };
  } catch (error) {
    return {
      success: false,
      error: createStorageError(
        'Failed to retrieve timestamp',
        error instanceof Error ? error.message : 'Unknown retrieval error',
      ),
    };
  }
}

/**
 * Clears all blood pressure data from localStorage
 */
export function clearStorage(): StorageResult<void> {
  if (!isLocalStorageAvailable()) {
    return {
      success: false,
      error: createStorageError('localStorage is not available'),
    };
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.dataset);
    localStorage.removeItem(STORAGE_KEYS.index);
    localStorage.removeItem(STORAGE_KEYS.timestamp);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: createStorageError(
        'Failed to clear storage',
        error instanceof Error ? error.message : 'Unknown error',
      ),
    };
  }
}

/**
 * Checks if the app has been initialized (has stored data)
 */
export function isAppInitialized(): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  const hasDataset = localStorage.getItem(STORAGE_KEYS.dataset) !== null;
  const hasIndex = localStorage.getItem(STORAGE_KEYS.index) !== null;
  const hasTimestamp = localStorage.getItem(STORAGE_KEYS.timestamp) !== null;

  return hasDataset && hasIndex && hasTimestamp;
}

/**
 * Gets the storage keys configuration
 */
export function getStorageKeys(): StorageKeys {
  return { ...STORAGE_KEYS };
}
