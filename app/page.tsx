'use client';

import { useCallback, useEffect, useState } from 'react';
import BloodPressureDisplay from '@/app/components/BloodPressureDisplay';
import {
  generateBloodPressureDataset,
  getReadingAtIndex,
  validateReading,
} from '@/lib/bloodPressureGenerator';
import {
  clearStorage,
  getCurrentIndex,
  getDataset,
  isAppInitialized,
  storeCurrentIndex,
  storeDataset,
  storeTimestamp,
} from '@/lib/storageManager';
import type { AppError, AppState, BloodPressureReading } from '@/lib/types';

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    currentReading: null,
    datasetSize: 0,
    currentIndex: 0,
    isInitialized: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataset, setDataset] = useState<BloodPressureReading[]>([]);

  /**
   * Handles application errors with user-friendly messages
   */
  const handleError = useCallback((appError: AppError) => {
    console.error('App Error:', appError);
    setError(`${appError.message}${appError.details ? ` (${appError.details})` : ''}`);
    setIsLoading(false);
  }, []);

  /**
   * Initializes the application with fresh data
   */
  const initializeApp = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate new dataset
      const result = generateBloodPressureDataset();
      if (!result.success || !result.dataset) {
        handleError(
          result.error || { type: 'GENERATION_ERROR', message: 'Failed to generate dataset' },
        );
        return;
      }

      const newDataset = result.dataset;
      setDataset(newDataset);

      // Store dataset in localStorage
      const storeResult = storeDataset(newDataset);
      if (!storeResult.success && storeResult.error) {
        handleError(storeResult.error);
        return;
      }

      // Initialize index and timestamp
      const initialIndex = 0;
      const timestamp = Date.now();

      const indexResult = storeCurrentIndex(initialIndex);
      if (!indexResult.success && indexResult.error) {
        handleError(indexResult.error);
        return;
      }

      const timestampResult = storeTimestamp(timestamp);
      if (!timestampResult.success && timestampResult.error) {
        handleError(timestampResult.error);
        return;
      }

      // Get first reading
      const firstReading = getReadingAtIndex(newDataset, initialIndex);
      if (!firstReading || !validateReading(firstReading)) {
        handleError({ type: 'VALIDATION_ERROR', message: 'Invalid first reading' });
        return;
      }

      // Update app state
      setAppState({
        currentReading: firstReading,
        datasetSize: newDataset.length,
        currentIndex: initialIndex,
        isInitialized: true,
      });

      setIsLoading(false);
    } catch (error) {
      handleError({
        type: 'GENERATION_ERROR',
        message: 'Failed to initialize app',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [handleError]);

  /**
   * Loads existing data from localStorage
   */
  const loadExistingData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load dataset
      const datasetResult = getDataset();
      if (!datasetResult.success || !datasetResult.data) {
        handleError(
          datasetResult.error || { type: 'STORAGE_ERROR', message: 'Failed to load dataset' },
        );
        return;
      }

      // Load current index
      const indexResult = getCurrentIndex();
      if (!indexResult.success || indexResult.data === undefined) {
        handleError(
          indexResult.error || { type: 'STORAGE_ERROR', message: 'Failed to load index' },
        );
        return;
      }

      const loadedDataset = datasetResult.data;
      const currentIndex = indexResult.data;

      setDataset(loadedDataset);

      // Get current reading
      const currentReading = getReadingAtIndex(loadedDataset, currentIndex);
      if (!currentReading || !validateReading(currentReading)) {
        handleError({ type: 'VALIDATION_ERROR', message: 'Invalid current reading' });
        return;
      }

      // Update app state
      setAppState({
        currentReading,
        datasetSize: loadedDataset.length,
        currentIndex,
        isInitialized: true,
      });

      setIsLoading(false);
    } catch (error) {
      handleError({
        type: 'STORAGE_ERROR',
        message: 'Failed to load existing data',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [handleError]);

  /**
   * Gets the next blood pressure reading
   */
  const getNextReading = useCallback(() => {
    if (!appState.isInitialized || dataset.length === 0) {
      return;
    }

    const nextIndex = appState.currentIndex + 1;
    const nextReading = getReadingAtIndex(dataset, nextIndex);

    if (!nextReading || !validateReading(nextReading)) {
      handleError({ type: 'VALIDATION_ERROR', message: 'Invalid next reading' });
      return;
    }

    // Store new index
    const storeResult = storeCurrentIndex(nextIndex);
    if (!storeResult.success && storeResult.error) {
      console.warn('Failed to store index:', storeResult.error);
      // Continue anyway - app can still function
    }

    // Update app state
    setAppState((prev) => ({
      ...prev,
      currentReading: nextReading,
      currentIndex: nextIndex,
    }));
  }, [appState.isInitialized, appState.currentIndex, dataset, handleError]);

  /**
   * Resets the application to initial state
   */
  const resetApp = useCallback(() => {
    clearStorage();
    setAppState({
      currentReading: null,
      datasetSize: 0,
      currentIndex: 0,
      isInitialized: false,
    });
    setDataset([]);
    setError(null);
    initializeApp();
  }, [initializeApp]);

  /**
   * Initialize app on mount
   */
  useEffect(() => {
    const initialize = async () => {
      if (isAppInitialized()) {
        await loadExistingData();
      } else {
        await initializeApp();
      }
    };

    initialize();
  }, [initializeApp, loadExistingData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Blood Pressure Monitor</h1>
          <p className="text-gray-600 text-sm">
            Realistic blood pressure simulator with {appState.datasetSize.toLocaleString()} unique
            readings
          </p>
          {appState.isInitialized && (
            <p className="text-xs text-gray-500 mt-2">
              Reading {(appState.currentIndex + 1).toLocaleString()} of{' '}
              {appState.datasetSize.toLocaleString()}
            </p>
          )}
        </div>

        {/* Main Display */}
        <div className="mb-8">
          <BloodPressureDisplay
            reading={appState.currentReading}
            onTap={getNextReading}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Statistics */}
        {!isLoading && !error && (
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Session Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Dataset Size</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {appState.datasetSize.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Progress</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {appState.datasetSize > 0
                      ? `${(((appState.currentIndex + 1) / appState.datasetSize) * 100).toFixed(1)}%`
                      : '0%'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Simulated medical device data for demonstration purposes only</p>
          <p className="mt-1">Not for actual medical use</p>
        </div>
      </div>
    </div>
  );
}
