import { useState, useCallback, useRef, useEffect } from "react";
import { SortingStep, TreeStep } from "@/types/algorithm";

export interface UsePlaybackProps {
  steps: (SortingStep | TreeStep)[];
  onStepChange?: (stepIndex: number) => void;
}

export interface UsePlaybackReturn {
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  jumpToStep: (step: number) => void;
  progress: number;
  canStepForward: boolean;
  canStepBackward: boolean;
}

export function usePlayback({
  steps,
  onStepChange,
}: UsePlaybackProps): UsePlaybackReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x speed by default
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate delay based on speed (0.1x to 5x)
  const getDelay = useCallback(() => {
    const baseDelay = 1000; // 1 second base delay
    return baseDelay / speed;
  }, [speed]);

  // Clear any existing interval
  const clearPlayback = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Play function
  const play = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      return; // Already at the end
    }

    setIsPlaying(true);
    clearPlayback();

    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep >= steps.length) {
          setIsPlaying(false);
          clearPlayback();
          return prev; // Stay at the last step
        }
        onStepChange?.(nextStep);
        return nextStep;
      });
    }, getDelay());
  }, [currentStep, steps.length, getDelay, clearPlayback, onStepChange]);

  // Pause function
  const pause = useCallback(() => {
    setIsPlaying(false);
    clearPlayback();
  }, [clearPlayback]);

  // Step forward
  const stepForward = useCallback(() => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }
  }, [currentStep, steps.length, onStepChange]);

  // Step backward
  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    }
  }, [currentStep, onStepChange]);

  // Reset to beginning
  const reset = useCallback(() => {
    setIsPlaying(false);
    clearPlayback();
    setCurrentStep(0);
    onStepChange?.(0);
  }, [clearPlayback, onStepChange]);

  // Jump to specific step
  const jumpToStep = useCallback(
    (step: number) => {
      const clampedStep = Math.max(0, Math.min(step, steps.length - 1));
      setCurrentStep(clampedStep);
      onStepChange?.(clampedStep);
    },
    [steps.length, onStepChange]
  );

  // Update speed
  const updateSpeed = useCallback(
    (newSpeed: number) => {
      const clampedSpeed = Math.max(0.1, Math.min(5, newSpeed));
      setSpeed(clampedSpeed);

      // If currently playing, restart with new speed
      if (isPlaying) {
        clearPlayback();
        // Restart playback with new speed
        setTimeout(() => {
          if (isPlaying && currentStep < steps.length - 1) {
            play();
          }
        }, 0);
      }
    },
    [isPlaying, currentStep, steps.length, clearPlayback, play]
  );

  // Calculate progress percentage
  const progress =
    steps.length > 0 ? (currentStep / (steps.length - 1)) * 100 : 0;

  // Check if we can step forward/backward
  const canStepForward = currentStep < steps.length - 1;
  const canStepBackward = currentStep > 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearPlayback();
    };
  }, [clearPlayback]);

  // Auto-pause when reaching the end
  useEffect(() => {
    if (isPlaying && currentStep >= steps.length - 1) {
      setIsPlaying(false);
      clearPlayback();
    }
  }, [currentStep, steps.length, isPlaying, clearPlayback]);

  return {
    currentStep,
    isPlaying,
    speed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    setSpeed: updateSpeed,
    jumpToStep,
    progress,
    canStepForward,
    canStepBackward,
  };
}
