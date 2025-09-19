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
import {
  ChevronDown,
  Shuffle,
  ArrowLeft,
  RotateCcw,
  SkipBack,
  Pause,
  Play,
  SkipForward,
} from "lucide-react";
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
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                <span className="hidden sm:inline">Algorithm Visualizer</span>
                <span className="sm:hidden">AlgoViz</span>
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Visualization Type Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setVisualizationType("sorting")}
                  className={clsx(
                    "px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors",
                    visualizationType === "sorting"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  Sort
                </button>
                <button
                  onClick={() => setVisualizationType("tree")}
                  className={clsx(
                    "px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors",
                    visualizationType === "tree"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  Tree
                </button>
              </div>

              {/* Tree Builder Link */}
              <Link
                href="/tree-builder"
                className="px-2 sm:px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-2"
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
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
                <span className="hidden sm:inline">Tree Builder</span>
                <span className="sm:hidden">Build</span>
              </Link>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-2 lg:py-4">
        <div className="flex flex-col lg:grid lg:grid-cols-6 gap-2 lg:gap-4">
          {/* Mobile-First Layout: Visualization comes first */}
          <div className="lg:hidden order-1 mb-4">
            {/* Mobile Visualization Canvas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2">
              {visualizationType === "sorting" ? (
                <ArrayBars
                  data={currentArrayState}
                  currentStep={currentStep as SortingStep}
                  showIndices={showIndices}
                  showValues={showValues}
                  className="h-80 w-full"
                />
              ) : (
                <TreeCanvas
                  tree={treeData}
                  currentStep={currentStep as TreeStep}
                  className="h-80 w-full"
                />
              )}
            </div>

            {/* Mobile Controls - Compact */}
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
              <div className="flex items-center justify-center gap-2 mb-3">
                {/* Reset */}
                <button
                  onClick={playback.reset}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Step Backward */}
                <button
                  onClick={playback.stepBackward}
                  disabled={!playback.canStepBackward}
                  className={clsx(
                    "p-2 rounded-lg transition-colors",
                    playback.canStepBackward
                      ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  )}
                  title="Step back"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Play/Pause */}
                <button
                  onClick={playback.isPlaying ? playback.pause : playback.play}
                  disabled={!playback.canStepForward && !playback.isPlaying}
                  className={clsx(
                    "p-3 rounded-lg transition-colors",
                    playback.canStepForward || playback.isPlaying
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  )}
                  title={playback.isPlaying ? "Pause" : "Play"}
                >
                  {playback.isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                {/* Step Forward */}
                <button
                  onClick={playback.stepForward}
                  disabled={!playback.canStepForward}
                  className={clsx(
                    "p-2 rounded-lg transition-colors",
                    playback.canStepForward
                      ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  )}
                  title="Step forward"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>
                    Step {playback.currentStep + 1} of {currentSteps.length}
                  </span>
                  <span>{Math.round(playback.progress)}%</span>
                </div>
                <div className="relative">
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all duration-200"
                      style={{ width: `${playback.progress}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={currentSteps.length - 1}
                    value={playback.currentStep}
                    onChange={(e) =>
                      playback.jumpToStep(parseInt(e.target.value))
                    }
                    className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                    title="Scrub through steps"
                  />
                </div>
              </div>

              {/* Speed Control */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Speed:
                </span>
                <div className="flex items-center gap-1">
                  {[0.5, 1, 2, 3].map((speedOption) => (
                    <button
                      key={speedOption}
                      onClick={() => playback.setSpeed(speedOption)}
                      className={clsx(
                        "px-2 py-1 text-xs rounded transition-colors",
                        playback.speed === speedOption
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      )}
                    >
                      {speedOption}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step Description - Mobile */}
            {currentStep && (
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Current Step
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {currentStep.description}
                </p>
              </div>
            )}
          </div>

          {/* Controls and Settings Panel - Desktop and Mobile Settings */}
          <div className="lg:col-span-1 space-y-3 sm:space-y-4 lg:space-y-6 order-2 lg:order-1">
            {/* Algorithm Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
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
                  className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer"
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
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Data Input */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Data Input
              </h3>

              {/* Custom Input */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Values (comma-separated)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="e.g., 64,34,25,12,22,11,90"
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm"
                    onKeyPress={(e) => e.key === "Enter" && handleCustomInput()}
                  />
                  <button
                    onClick={handleCustomInput}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Set Data
                  </button>
                </div>
              </div>

              {/* Preset Datasets */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preset Datasets
                </label>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {Object.keys(
                    visualizationType === "sorting"
                      ? defaultDatasets
                      : treeDefaultDatasets
                  ).map((key) => (
                    <button
                      key={key}
                      onClick={() => handlePresetSelect(key)}
                      className="p-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors capitalize"
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Random Data */}
              <button
                onClick={generateRandomData}
                className="w-full flex items-center justify-center gap-2 p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
              >
                <Shuffle className="w-3 h-3 sm:w-4 sm:h-4" />
                Generate Random
              </button>
            </div>

            {/* Visualization Options */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Options
              </h3>

              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showIndices}
                    onChange={(e) => setShowIndices(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    Show Indices
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showValues}
                    onChange={(e) => setShowValues(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    Show Values
                  </span>
                </label>
              </div>
            </div>

            {/* Algorithm Info - Collapsible on Mobile */}
            {currentAlgorithmInfo && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {currentAlgorithmInfo.name}
                </h3>

                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Time Complexity:
                    </span>
                    <div className="ml-2 text-gray-600 dark:text-gray-400 text-xs">
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

                  <div className="hidden sm:block">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Description:
                    </span>
                    <p className="mt-1 text-gray-600 dark:text-gray-400 text-xs">
                      {currentAlgorithmInfo.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Legend - Desktop Only */}
            <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
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
