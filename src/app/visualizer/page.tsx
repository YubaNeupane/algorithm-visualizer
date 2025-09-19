"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ArrayBars, ArrayBarsLegend } from "@/components/ArrayBars";
import { TreeCanvas, TreeLegend } from "@/components/TreeCanvas";
import { Controls } from "@/components/Controls";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePlayback } from "@/hooks/usePlayback";
import {
  sortingAlgorithms,
  sortingAlgorithmsList,
  defaultDatasets,
} from "@/algorithms/sorting";
import {
  treeAlgorithms,
  treeAlgorithmsList,
  treeDefaultDatasets,
} from "@/algorithms/trees";
import { SortingStep, TreeStep, TreeNode } from "@/types/algorithm";
import { ChevronDown, Shuffle, ArrowLeft } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

type VisualizationType = "sorting" | "tree";
type TreeOperation = "insert" | "search" | "traversal";

export default function VisualizerPage() {
  // Visualization type
  const [visualizationType, setVisualizationType] =
    useState<VisualizationType>("sorting");

  // Sorting state
  const [selectedSortingAlgorithm, setSelectedSortingAlgorithm] =
    useState("bubble");
  const [sortingData, setSortingData] = useState<number[]>(
    defaultDatasets.small
  );
  const [sortingSteps, setSortingSteps] = useState<SortingStep[]>([]);

  // Tree state
  const [selectedTreeAlgorithm, setSelectedTreeAlgorithm] = useState("bst");
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [treeSteps, setTreeSteps] = useState<TreeStep[]>([]);
  const [treeOperation, setTreeOperation] = useState<TreeOperation>("insert");

  // UI state
  const [showIndices, setShowIndices] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [customInput, setCustomInput] = useState("");

  // Playback hook
  const playback = usePlayback({
    steps: visualizationType === "sorting" ? sortingSteps : treeSteps,
    onStepChange: useCallback((stepIndex: number) => {
      // Handle step changes if needed
    }, []),
  });

  // Get current steps and data based on visualization type
  const currentSteps =
    visualizationType === "sorting" ? sortingSteps : treeSteps;
  const currentStep =
    currentSteps.length > 0 ? currentSteps[playback.currentStep] || null : null;

  // Calculate current array state for sorting algorithms
  const getCurrentArrayState = (): number[] => {
    if (visualizationType !== "sorting" || sortingSteps.length === 0) {
      return sortingData;
    }

    // Apply all steps up to current step to get the current array state
    const currentArray = [...sortingData];
    for (let i = 0; i <= playback.currentStep && i < sortingSteps.length; i++) {
      const step = sortingSteps[i];
      if (step.type === "swap") {
        const [idx1, idx2] = step.indices;
        [currentArray[idx1], currentArray[idx2]] = [
          currentArray[idx2],
          currentArray[idx1],
        ];
      }
    }
    return currentArray;
  };

  const currentArrayState = getCurrentArrayState();

  // Generate sorting steps when algorithm or data changes
  useEffect(() => {
    if (visualizationType === "sorting") {
      const algorithm = sortingAlgorithms[selectedSortingAlgorithm];
      if (algorithm && sortingData.length > 0) {
        const steps = algorithm.getSteps(sortingData);
        setSortingSteps(steps);
        playback.reset();
      }
    }
  }, [selectedSortingAlgorithm, sortingData, visualizationType]);

  // Generate tree steps when algorithm or operation changes
  useEffect(() => {
    if (visualizationType === "tree") {
      const algorithm = treeAlgorithms[selectedTreeAlgorithm];
      if (algorithm && algorithm.operations.insert) {
        const dataset = treeDefaultDatasets.small;
        console.log("Tree algorithm:", selectedTreeAlgorithm);
        console.log("Dataset:", dataset);
        const result = algorithm.operations.insert(dataset);
        console.log("Tree result:", result);
        setTreeSteps(result.steps);
        setTreeData(result.finalTree);
        playback.reset();
      }
    }
  }, [selectedTreeAlgorithm, visualizationType, treeOperation]);

  // Handle custom input
  const handleCustomInput = () => {
    try {
      const values = customInput
        .split(",")
        .map((v) => parseInt(v.trim()))
        .filter((v) => !isNaN(v));

      if (values.length === 0) return;

      if (visualizationType === "sorting") {
        setSortingData(values);
      } else {
        const algorithm = treeAlgorithms[selectedTreeAlgorithm];
        if (algorithm && algorithm.operations.insert) {
          const result = algorithm.operations.insert(values);
          setTreeSteps(result.steps);
          setTreeData(result.finalTree);
          playback.reset();
        }
      }
      setCustomInput("");
    } catch (error) {
      console.error("Invalid input:", error);
    }
  };

  // Handle preset dataset selection
  const handlePresetSelect = (datasetKey: string) => {
    if (visualizationType === "sorting") {
      const dataset =
        defaultDatasets[datasetKey as keyof typeof defaultDatasets];
      if (dataset) {
        setSortingData([...dataset]);
      }
    } else {
      const dataset =
        treeDefaultDatasets[datasetKey as keyof typeof treeDefaultDatasets];
      if (dataset) {
        const algorithm = treeAlgorithms[selectedTreeAlgorithm];
        if (algorithm && algorithm.operations.insert) {
          const result = algorithm.operations.insert(dataset);
          setTreeSteps(result.steps);
          setTreeData(result.finalTree);
          playback.reset();
        }
      }
    }
  };

  // Generate random data
  const generateRandomData = () => {
    const size = visualizationType === "sorting" ? 12 : 8;
    const values = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 100) + 1
    );

    if (visualizationType === "sorting") {
      setSortingData(values);
    } else {
      const algorithm = treeAlgorithms[selectedTreeAlgorithm];
      if (algorithm && algorithm.operations.insert) {
        const result = algorithm.operations.insert(values);
        setTreeSteps(result.steps);
        setTreeData(result.finalTree);
        playback.reset();
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          playback.isPlaying ? playback.pause() : playback.play();
          break;
        case "ArrowLeft":
          e.preventDefault();
          playback.stepBackward();
          break;
        case "ArrowRight":
          e.preventDefault();
          playback.stepForward();
          break;
        case "r":
        case "R":
          e.preventDefault();
          playback.reset();
          break;
        case "1":
          playback.setSpeed(0.5);
          break;
        case "2":
          playback.setSpeed(1);
          break;
        case "3":
          playback.setSpeed(2);
          break;
        case "4":
          playback.setSpeed(3);
          break;
        case "5":
          playback.setSpeed(5);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playback]);

  const currentAlgorithmInfo =
    visualizationType === "sorting"
      ? sortingAlgorithms[selectedSortingAlgorithm]?.info
      : treeAlgorithms[selectedTreeAlgorithm]?.info;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Algorithm Visualizer
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Visualization Type Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setVisualizationType("sorting")}
                  className={clsx(
                    "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                    visualizationType === "sorting"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  Sorting
                </button>
                <button
                  onClick={() => setVisualizationType("tree")}
                  className={clsx(
                    "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                    visualizationType === "tree"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  Trees
                </button>
              </div>

              {/* Tree Builder Link */}
              <Link
                href="/tree-builder"
                className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Tree Builder
              </Link>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-2 lg:py-4">
        <div className="flex flex-col lg:grid lg:grid-cols-6 gap-2 lg:gap-4">
          {/* Mobile Controls - Floating Bottom Panel */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-50">
            <Controls
              isPlaying={playback.isPlaying}
              canStepForward={playback.canStepForward}
              canStepBackward={playback.canStepBackward}
              speed={playback.speed}
              progress={playback.progress}
              currentStep={playback.currentStep}
              totalSteps={currentSteps.length}
              onPlay={playback.play}
              onPause={playback.pause}
              onStepForward={playback.stepForward}
              onStepBackward={playback.stepBackward}
              onReset={playback.reset}
              onSpeedChange={playback.setSpeed}
              onProgressChange={playback.jumpToStep}
            />
          </div>

          {/* Desktop Left Panel - Controls and Settings */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6 mb-20 lg:mb-0">
            {/* Algorithm Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {visualizationType === "sorting"
                  ? "Sorting Algorithm"
                  : "Tree Algorithm"}
              </h3>

              <div className="relative">
                <select
                  value={
                    visualizationType === "sorting"
                      ? selectedSortingAlgorithm
                      : selectedTreeAlgorithm
                  }
                  onChange={(e) => {
                    if (visualizationType === "sorting") {
                      setSelectedSortingAlgorithm(e.target.value);
                    } else {
                      setSelectedTreeAlgorithm(e.target.value);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  {(visualizationType === "sorting"
                    ? sortingAlgorithmsList
                    : treeAlgorithmsList
                  ).map((algorithm) => (
                    <option key={algorithm.id} value={algorithm.id}>
                      {algorithm.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Data Input */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Data Input
              </h3>

              {/* Custom Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Values (comma-separated)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="e.g., 64,34,25,12,22,11,90"
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    onKeyPress={(e) => e.key === "Enter" && handleCustomInput()}
                  />
                  <button
                    onClick={handleCustomInput}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Set
                  </button>
                </div>
              </div>

              {/* Preset Datasets */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preset Datasets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(
                    visualizationType === "sorting"
                      ? defaultDatasets
                      : treeDefaultDatasets
                  ).map((key) => (
                    <button
                      key={key}
                      onClick={() => handlePresetSelect(key)}
                      className="p-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors capitalize"
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Random Data */}
              <button
                onClick={generateRandomData}
                className="w-full flex items-center justify-center gap-2 p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                Generate Random
              </button>
            </div>

            {/* Visualization Options */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Options
              </h3>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showIndices}
                    onChange={(e) => setShowIndices(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Show Indices
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showValues}
                    onChange={(e) => setShowValues(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Show Values
                  </span>
                </label>
              </div>
            </div>

            {/* Algorithm Info */}
            {currentAlgorithmInfo && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {currentAlgorithmInfo.name}
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Time Complexity:
                    </span>
                    <div className="ml-2 text-gray-600 dark:text-gray-400">
                      <div>
                        Best: {currentAlgorithmInfo.timeComplexity.best}
                      </div>
                      <div>
                        Average: {currentAlgorithmInfo.timeComplexity.average}
                      </div>
                      <div>
                        Worst: {currentAlgorithmInfo.timeComplexity.worst}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Space Complexity:
                    </span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {currentAlgorithmInfo.spaceComplexity}
                    </span>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Description:
                    </span>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {currentAlgorithmInfo.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Legend - Moved to Left Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Legend
                </h3>
              </div>
              {visualizationType === "sorting" ? (
                <ArrayBarsLegend />
              ) : (
                <TreeLegend />
              )}
            </div>
          </div>

          {/* Right Panel - Visualization */}
          <div className="lg:col-span-5 space-y-4">
            {/* Visualization Canvas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2">
              {visualizationType === "sorting" ? (
                <ArrayBars
                  data={currentArrayState}
                  currentStep={currentStep as SortingStep}
                  showIndices={showIndices}
                  showValues={showValues}
                  className="h-[32rem] lg:h-[36rem] xl:h-[42rem] w-full"
                />
              ) : (
                <TreeCanvas
                  tree={treeData}
                  currentStep={currentStep as TreeStep}
                  className="h-[32rem] lg:h-[36rem] xl:h-[42rem] w-full"
                />
              )}
            </div>

            {/* Desktop Controls */}
            <div className="hidden xl:block">
              <Controls
                isPlaying={playback.isPlaying}
                canStepForward={playback.canStepForward}
                canStepBackward={playback.canStepBackward}
                speed={playback.speed}
                progress={playback.progress}
                currentStep={playback.currentStep}
                totalSteps={currentSteps.length}
                onPlay={playback.play}
                onPause={playback.pause}
                onStepForward={playback.stepForward}
                onStepBackward={playback.stepBackward}
                onReset={playback.reset}
                onSpeedChange={playback.setSpeed}
                onProgressChange={playback.jumpToStep}
              />
            </div>

            {/* Step Description */}
            {currentStep && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Current Step
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {currentStep.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
