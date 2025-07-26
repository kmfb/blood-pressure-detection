/**
 * Blood Pressure Display Component
 * Mobile-first responsive design with professional medical appearance
 */

'use client';

import { useEffect, useState } from 'react';
import type { BloodPressureReading } from '@/lib/types';

interface BloodPressureDisplayProps {
  reading: BloodPressureReading | null;
  onTap: () => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Determines the blood pressure category based on systolic and diastolic values
 * Based on AHA (American Heart Association) guidelines
 */
function getBloodPressureCategory(
  systolic: number,
  diastolic: number,
): {
  category: string;
  color: string;
  description: string;
} {
  if (systolic < 120 && diastolic < 80) {
    return {
      category: 'Normal',
      color: 'text-green-600',
      description: 'Optimal blood pressure',
    };
  } else if (systolic < 130 && diastolic < 80) {
    return {
      category: 'Elevated',
      color: 'text-yellow-600',
      description: 'Above normal range',
    };
  } else if (systolic < 140 || diastolic < 90) {
    return {
      category: 'High Stage 1',
      color: 'text-orange-600',
      description: 'Mild hypertension',
    };
  } else {
    return {
      category: 'High Stage 2',
      color: 'text-red-600',
      description: 'Moderate hypertension',
    };
  }
}

/**
 * Formats timestamp to readable time string
 */
function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export default function BloodPressureDisplay({
  reading,
  onTap,
  isLoading = false,
  error = null,
}: BloodPressureDisplayProps) {
  const [pulseAnimation, setPulseAnimation] = useState(false);

  // Trigger pulse animation when reading changes
  useEffect(() => {
    if (reading) {
      setPulseAnimation(true);
      const timer = setTimeout(() => setPulseAnimation(false), 300);
      return () => clearTimeout(timer);
    }
  }, [reading]);

  const handleClick = () => {
    onTap();
  };

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg border border-red-200">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={handleClick}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="text-center">
          <div className="animate-spin text-blue-500 text-4xl mb-4">⚙️</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Loading</h2>
          <p className="text-sm text-gray-600">Preparing blood pressure data...</p>
        </div>
      </div>
    );
  }

  // No reading state
  if (!reading) {
    return (
      <div
        className="
          w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300
          cursor-pointer select-none transition-all duration-150
          hover:border-blue-400 hover:shadow-xl
          active:scale-95 active:shadow-md
        "
        onClick={handleClick}
      >
        <div className="text-center">
          <div className="text-gray-400 text-5xl mb-4">📊</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Blood Pressure Monitor</h2>
          <p className="text-sm text-gray-600 mb-4">Tap to start measuring</p>
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Simulated medical device data
          </div>
        </div>
      </div>
    );
  }

  const { category, color, description } = getBloodPressureCategory(
    reading.systolic,
    reading.diastolic,
  );
  const pulsePreasure = reading.systolic - reading.diastolic;

  return (
    <div
      className={`
        w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200
        cursor-pointer select-none transition-all duration-150
        hover:shadow-xl hover:border-blue-300
        active:scale-95 active:shadow-md
        ${pulseAnimation ? 'animate-pulse' : ''}
      `}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-lg font-semibold text-gray-800 mb-1">Blood Pressure Reading</h1>
        <p className="text-xs text-gray-500">{formatTime(reading.timestamp)}</p>
      </div>

      {/* Main Reading Display */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-4xl font-bold text-gray-800 tabular-nums">{reading.systolic}</span>
          <span className="text-2xl text-gray-500 font-normal">/</span>
          <span className="text-4xl font-bold text-gray-800 tabular-nums">{reading.diastolic}</span>
        </div>
        <p className="text-sm text-gray-600 font-medium">mmHg</p>
      </div>

      {/* Category Information */}
      <div className="text-center mb-4">
        <div className={`text-sm font-semibold ${color} mb-1`}>{category}</div>
        <p className="text-xs text-gray-600">{description}</p>
      </div>

      {/* Additional Metrics */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Systolic</p>
            <p className="text-lg font-semibold text-gray-800 tabular-nums">{reading.systolic}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Diastolic</p>
            <p className="text-lg font-semibold text-gray-800 tabular-nums">{reading.diastolic}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Pulse Pressure</p>
          <p className="text-sm font-medium text-gray-700 tabular-nums">{pulsePreasure} mmHg</p>
        </div>
      </div>

      {/* Action Prompt */}
      <div className="text-center">
        <p className="text-xs bg-blue-50 text-blue-700 p-2 rounded border border-blue-200">
          Tap anywhere to take next reading
        </p>
      </div>
    </div>
  );
}
