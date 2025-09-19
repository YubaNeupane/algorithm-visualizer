"use client";

import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Settings,
} from "lucide-react";
import clsx from "clsx";

interface ControlsProps {
  isPlaying: boolean;
  canStepForward: boolean;
  canStepBackward: boolean;
  speed: number;
  progress: number;
  currentStep: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onProgressChange: (step: number) => void;
  className?: string;
}

export function Controls({
  isPlaying,
  canStepForward,
  canStepBackward,
  speed,
  progress,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  onProgressChange,
  className,
}: ControlsProps) {
  const speedOptions = [0.1, 0.25, 0.5, 1, 1.5, 2, 3, 5];

  return (
    <div
      className={clsx(
        "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4",
        className
      )}
    >
      {/* Main Controls */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {/* Reset */}
        <button
          onClick={onReset}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Reset to beginning"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Step Backward */}
        <button
          onClick={onStepBackward}
          disabled={!canStepBackward}
          className={clsx(
            "p-2 rounded-lg transition-colors",
            canStepBackward
              ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              : "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
          )}
          title="Step backward"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        {/* Play/Pause */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={!canStepForward && !isPlaying}
          className={clsx(
            "p-3 rounded-lg transition-colors",
            canStepForward || isPlaying
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
          )}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>

        {/* Step Forward */}
        <button
          onClick={onStepForward}
          disabled={!canStepForward}
          className={clsx(
            "p-2 rounded-lg transition-colors",
            canStepForward
              ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              : "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
          )}
          title="Step forward"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="relative">
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max={totalSteps - 1}
            value={currentStep}
            onChange={(e) => onProgressChange(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
            title="Scrub through steps"
          />
        </div>
      </div>

      {/* Speed Control */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Speed:
          </span>
        </div>
        <div className="flex items-center gap-1">
          {speedOptions.map((speedOption) => (
            <button
              key={speedOption}
              onClick={() => onSpeedChange(speedOption)}
              className={clsx(
                "px-2 py-1 text-xs rounded transition-colors",
                speed === speedOption
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              {speedOption}x
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div className="font-medium mb-1">Keyboard Shortcuts:</div>
          <div className="grid grid-cols-2 gap-1">
            <span>Space: Play/Pause</span>
            <span>← →: Step</span>
            <span>R: Reset</span>
            <span>1-5: Speed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact version for mobile
export function CompactControls({
  isPlaying,
  canStepForward,
  canStepBackward,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  className,
}: Pick<
  ControlsProps,
  | "isPlaying"
  | "canStepForward"
  | "canStepBackward"
  | "onPlay"
  | "onPause"
  | "onStepForward"
  | "onStepBackward"
  | "onReset"
  | "className"
>) {
  return (
    <div className={clsx("flex items-center justify-center gap-2", className)}>
      <button
        onClick={onReset}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        title="Reset"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        onClick={onStepBackward}
        disabled={!canStepBackward}
        className={clsx(
          "p-2 rounded-lg transition-colors",
          canStepBackward
            ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            : "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
        )}
        title="Step back"
      >
        <SkipBack className="w-4 h-4" />
      </button>

      <button
        onClick={isPlaying ? onPause : onPlay}
        disabled={!canStepForward && !isPlaying}
        className={clsx(
          "p-2 rounded-lg transition-colors",
          canStepForward || isPlaying
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
        )}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>

      <button
        onClick={onStepForward}
        disabled={!canStepForward}
        className={clsx(
          "p-2 rounded-lg transition-colors",
          canStepForward
            ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            : "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
        )}
        title="Step forward"
      >
        <SkipForward className="w-4 h-4" />
      </button>
    </div>
  );
}
