/**
 * Blood Pressure Data Generator
 * Creates realistic blood pressure readings with complete dataset approach
 */

import type { AppError, BloodPressureConfig, BloodPressureReading, DatasetResult } from './types';

// Configuration for blood pressure ranges
const CONFIG: BloodPressureConfig = {
  systolic: {
    min: 90,
    max: 140,
  },
  diastolic: {
    min: 60,
    max: 90,
  },
  pulsePresssure: {
    min: 20,
    max: 60,
  },
};

/**
 * Validates if a blood pressure reading has realistic pulse pressure
 * Pulse pressure is the difference between systolic and diastolic
 */
function isValidPulsePreasure(systolic: number, diastolic: number): boolean {
  const pulsePressure = systolic - diastolic;
  return pulsePressure >= CONFIG.pulsePresssure.min && pulsePressure <= CONFIG.pulsePresssure.max;
}

/**
 * Fisher-Yates shuffle algorithm for unbiased randomization
 * Ensures each permutation is equally likely
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates all valid blood pressure combinations
 * Creates complete dataset with realistic constraints
 */
function generateAllCombinations(): BloodPressureReading[] {
  const combinations: BloodPressureReading[] = [];
  const baseTimestamp = Date.now();

  // Generate all possible combinations within ranges
  for (let systolic = CONFIG.systolic.min; systolic <= CONFIG.systolic.max; systolic++) {
    for (let diastolic = CONFIG.diastolic.min; diastolic <= CONFIG.diastolic.max; diastolic++) {
      // Only include combinations with realistic pulse pressure
      if (isValidPulsePreasure(systolic, diastolic)) {
        combinations.push({
          systolic,
          diastolic,
          timestamp: baseTimestamp + combinations.length * 1000, // Unique timestamps
        });
      }
    }
  }

  return combinations;
}

/**
 * Calculates the expected number of valid blood pressure combinations
 * Takes into account the pulse pressure constraints (20-60 mmHg)
 */
function calculateExpectedCombinations(): number {
  let count = 0;
  for (let systolic = CONFIG.systolic.min; systolic <= CONFIG.systolic.max; systolic++) {
    for (let diastolic = CONFIG.diastolic.min; diastolic <= CONFIG.diastolic.max; diastolic++) {
      if (isValidPulsePreasure(systolic, diastolic)) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Creates a complete, shuffled dataset of blood pressure readings
 * Returns all valid combinations in random order (1,161 combinations with pulse pressure 20-60 mmHg)
 */
export function generateBloodPressureDataset(): DatasetResult {
  try {
    // Generate all valid combinations
    const allCombinations = generateAllCombinations();

    // Calculate the expected number of combinations dynamically
    const expectedCount = calculateExpectedCombinations();
    if (allCombinations.length !== expectedCount) {
      const error: AppError = {
        type: 'GENERATION_ERROR',
        message: `Dataset generation failed: expected ${expectedCount} combinations, got ${allCombinations.length}`,
        details: 'The blood pressure range calculations may be incorrect',
      };
      return { success: false, error };
    }

    // Apply Fisher-Yates shuffle for unbiased randomization
    const shuffledDataset = shuffleArray(allCombinations);

    return {
      success: true,
      dataset: shuffledDataset,
    };
  } catch (error) {
    const appError: AppError = {
      type: 'GENERATION_ERROR',
      message: 'Failed to generate blood pressure dataset',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
    };
    return { success: false, error: appError };
  }
}

/**
 * Gets the next reading from the dataset at the specified index
 * Handles wraparound for continuous simulation
 */
export function getReadingAtIndex(
  dataset: BloodPressureReading[],
  index: number,
): BloodPressureReading | null {
  if (!dataset || dataset.length === 0) {
    return null;
  }

  // Handle wraparound for continuous simulation
  const normalizedIndex = index % dataset.length;
  return dataset[normalizedIndex];
}

/**
 * Validates a blood pressure reading for realistic values
 */
export function validateReading(reading: BloodPressureReading): boolean {
  if (!reading) return false;

  const { systolic, diastolic } = reading;

  // Check if values are within valid ranges
  if (systolic < CONFIG.systolic.min || systolic > CONFIG.systolic.max) return false;
  if (diastolic < CONFIG.diastolic.min || diastolic > CONFIG.diastolic.max) return false;

  // Check pulse pressure constraints
  if (!isValidPulsePreasure(systolic, diastolic)) return false;

  return true;
}

/**
 * Gets the configuration used for blood pressure generation
 */
export function getConfig(): BloodPressureConfig {
  return { ...CONFIG };
}
