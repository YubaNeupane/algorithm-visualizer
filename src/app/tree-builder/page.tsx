"use client";

import React, { useState } from "react";
import { InteractiveTreeBuilder } from "@/components/InteractiveTreeBuilder";
import { TreeCanvas } from "@/components/TreeCanvas";
import { FullscreenTreeVisualizer } from "@/components/FullscreenTreeVisualizer";
import { Controls } from "@/components/Controls";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePlayback } from "@/hooks/usePlayback";
import { treeAlgorithms, treeAlgorithmsList } from "@/algorithms/trees";
import { TreeNode, TreeStep } from "@/types/algorithm";
import {
  ChevronDown,
  ArrowLeft,
  Play,
  Pause,
  Maximize,
  Zap,
  Brain,
  Target,
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

export default function TreeBuilderPage() {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bst");
  const [mode, setMode] = useState<"build" | "visualize">("build");
  const [treeSteps, setTreeSteps] = useState<TreeStep[]>([]);
  const [operation, setOperation] = useState<"insert" | "search" | "delete">(
    "insert"
  );
  const [operationValue, setOperationValue] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoPlayMode, setAutoPlayMode] = useState(false);

  // Playback hook for algorithm visualization
  const playback = usePlayback({
    steps: treeSteps,
    onStepChange: (stepIndex: number) => {
      // Handle step changes if needed
    },
  });

  const handleTreeChange = (newTree: TreeNode | null) => {
    setTree(newTree);
  };

  const runAlgorithm = () => {
    if (!tree) return;

    const algorithm = treeAlgorithms[selectedAlgorithm];
    if (algorithm && algorithm.operations.insert) {
      // For demonstration, we'll convert the tree to an array and run insert operation
      const treeValues = extractTreeValues(tree);
      const result = algorithm.operations.insert(treeValues);
      setTreeSteps(result.steps);
      setMode("visualize");
      playback.reset();
    }
  };

  // Insert a single value using proper tree algorithm
  const insertValue = (value: number) => {
    const algorithm = treeAlgorithms[selectedAlgorithm];
    if (algorithm && algorithm.operations.insert) {
      if (!tree) {
        // First node - use algorithm to create proper tree
        const result = algorithm.operations.insert([value]);
        setTree(result.finalTree);
        setTreeSteps(result.steps);
      } else {
        // Insert into existing tree using algorithm
        const currentValues = extractTreeValues(tree);
        const result = algorithm.operations.insert([...currentValues, value]);
        setTree(result.finalTree);
        setTreeSteps(result.steps);
      }
    }
  };

  // Add search functionality
  const searchValue = (value: number) => {
    if (!tree) return;

    const algorithm = treeAlgorithms[selectedAlgorithm];
    if (algorithm && algorithm.operations.search) {
      const steps = algorithm.operations.search(value, tree);
      setTreeSteps(steps);
      setMode("visualize");
      playback.reset();
    }
  };

  // Helper function to extract values from tree (in-order traversal)
  const extractTreeValues = (node: TreeNode | null): number[] => {
    if (!node) return [];
    const values: number[] = [];
    const traverse = (n: TreeNode) => {
      values.push(n.value);
      if (n.left) traverse(n.left);
      if (n.right) traverse(n.right);
    };
    traverse(node);
    return values;
  };

  // Handle tree operations
  const handleOperation = () => {
    const value = parseInt(operationValue);
    if (isNaN(value)) return;

    switch (operation) {
      case "insert":
        insertValue(value);
        setMode("visualize");
        break;
      case "search":
        searchValue(value);
        break;
      case "delete":
        // Add delete functionality if algorithm supports it
        const algorithm = treeAlgorithms[selectedAlgorithm];
        if (algorithm && algorithm.operations.delete && tree) {
          const result = algorithm.operations.delete(value, tree);
          setTree(result.finalTree);
          setTreeSteps(result.steps);
          setMode("visualize");
          playback.reset();
        }
        break;
    }
    setOperationValue("");
  };

  const currentStep =
    treeSteps.length > 0 ? treeSteps[playback.currentStep] || null : null;
  const currentAlgorithmInfo = treeAlgorithms[selectedAlgorithm]?.info;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/visualizer"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Visualizer</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Interactive Tree Builder
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setMode("build")}
                  className={clsx(
                    "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                    mode === "build"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  Build
                </button>
                <button
                  onClick={() => setMode("visualize")}
                  disabled={!tree || treeSteps.length === 0}
                  className={clsx(
                    "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                    mode === "visualize" && treeSteps.length > 0
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
                  )}
                >
                  Visualize
                </button>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-2 lg:py-4">
        <div className="flex flex-col lg:grid lg:grid-cols-6 gap-2 lg:gap-4">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            {/* Algorithm Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tree Algorithm
              </h3>

              <div className="relative mb-4">
                <select
                  value={selectedAlgorithm}
                  onChange={(e) => setSelectedAlgorithm(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  {treeAlgorithmsList.map((algorithm) => (
                    <option key={algorithm.id} value={algorithm.id}>
                      {algorithm.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={runAlgorithm}
                disabled={!tree}
                className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                Run Algorithm
              </button>
            </div>

            {/* Tree Operations */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tree Operations
              </h3>

              {/* Operation Selection */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4">
                <button
                  onClick={() => setOperation("insert")}
                  className={clsx(
                    "flex-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                    operation === "insert"
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  Insert
                </button>
                <button
                  onClick={() => setOperation("search")}
                  disabled={!tree}
                  className={clsx(
                    "flex-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                    operation === "search" && tree
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
                  )}
                >
                  Search
                </button>
                <button
                  onClick={() => setOperation("delete")}
                  disabled={!tree}
                  className={clsx(
                    "flex-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                    operation === "delete" && tree
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
                  )}
                >
                  Delete
                </button>
              </div>

              {/* Operation Input */}
              <div className="flex gap-2">
                <input
                  type="number"
                  value={operationValue}
                  onChange={(e) => setOperationValue(e.target.value)}
                  placeholder={`Enter value to ${operation}`}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  onKeyPress={(e) => e.key === "Enter" && handleOperation()}
                />
                <button
                  onClick={handleOperation}
                  disabled={!operationValue}
                  className={clsx(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    operation === "insert" &&
                      "bg-green-500 hover:bg-green-600 text-white",
                    operation === "search" &&
                      "bg-blue-500 hover:bg-blue-600 text-white",
                    operation === "delete" &&
                      "bg-red-500 hover:bg-red-600 text-white",
                    !operationValue &&
                      "bg-gray-400 text-white cursor-not-allowed"
                  )}
                >
                  {operation === "insert"
                    ? "Add"
                    : operation === "search"
                    ? "Find"
                    : "Remove"}
                </button>
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

            {/* Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Instructions
              </h3>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {mode === "build" ? (
                  <>
                    <p>• Enter a value and click + to add nodes</p>
                    <p>• Drag nodes to reposition them</p>
                    <p>• Double-click nodes to delete them</p>
                    <p>• Use mouse wheel to zoom in/out</p>
                    <p>• Click and drag background to pan</p>
                  </>
                ) : (
                  <>
                    <p>• Use play controls to step through algorithm</p>
                    <p>• Watch how the algorithm processes the tree</p>
                    <p>• Different colors show algorithm states</p>
                    <p>• Use the progress bar to jump to any step</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Tree Canvas */}
          <div className="lg:col-span-5 space-y-4">
            {/* Canvas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 relative">
              {mode === "build" ? (
                <InteractiveTreeBuilder
                  initialTree={tree}
                  onTreeChange={handleTreeChange}
                  className="h-[32rem] lg:h-[36rem] xl:h-[42rem] w-full"
                />
              ) : (
                <TreeCanvas
                  tree={tree}
                  currentStep={currentStep}
                  className="h-[32rem] lg:h-[36rem] xl:h-[42rem] w-full"
                />
              )}

              {/* Enhanced Action Bar */}
              <div className="absolute top-2 right-2 flex gap-2">
                {/* Fullscreen Button */}
                {mode === "visualize" && treeSteps.length > 0 && (
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-lg transition-colors flex items-center gap-2"
                    title="Enter Fullscreen Mode"
                  >
                    <Maximize className="w-4 h-4" />
                    <span className="hidden sm:inline">Fullscreen</span>
                  </button>
                )}

                {/* Quick Actions */}
                {tree && mode === "visualize" && (
                  <>
                    <button
                      onClick={() => {
                        setAutoPlayMode(!autoPlayMode);
                        if (!autoPlayMode) playback.play();
                      }}
                      className={clsx(
                        "p-2 rounded-lg shadow-lg transition-colors flex items-center gap-2",
                        autoPlayMode
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      )}
                      title="Auto Play Mode"
                    >
                      <Zap className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {autoPlayMode ? "Auto: ON" : "Auto Play"}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        // Add smart guidance - automatically run optimal demonstration
                        playback.reset();
                        playback.setSpeed(1);
                        setTimeout(() => playback.play(), 500);
                      }}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors flex items-center gap-2"
                      title="Smart Demo"
                    >
                      <Brain className="w-4 h-4" />
                      <span className="hidden sm:inline">Smart Demo</span>
                    </button>

                    <button
                      onClick={() => {
                        // Jump to interesting points in the algorithm
                        const interestingSteps = treeSteps
                          .map((step, index) => ({ step, index }))
                          .filter(
                            ({ step }) =>
                              step.type === "tree-insert" ||
                              (step.type === "tree-search" && step.found)
                          );

                        if (interestingSteps.length > 0) {
                          const randomStep =
                            interestingSteps[
                              Math.floor(
                                Math.random() * interestingSteps.length
                              )
                            ];
                          playback.jumpToStep(randomStep.index);
                        }
                      }}
                      className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-lg transition-colors flex items-center gap-2"
                      title="Jump to Key Moment"
                    >
                      <Target className="w-4 h-4" />
                      <span className="hidden sm:inline">Key Moment</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Controls - Always Visible */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              {mode === "visualize" && treeSteps.length > 0 ? (
                <Controls
                  isPlaying={playback.isPlaying}
                  canStepForward={playback.canStepForward}
                  canStepBackward={playback.canStepBackward}
                  speed={playback.speed}
                  progress={playback.progress}
                  currentStep={playback.currentStep}
                  totalSteps={treeSteps.length}
                  onPlay={playback.play}
                  onPause={playback.pause}
                  onStepForward={playback.stepForward}
                  onStepBackward={playback.stepBackward}
                  onReset={playback.reset}
                  onSpeedChange={playback.setSpeed}
                  onProgressChange={playback.jumpToStep}
                />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  {!tree
                    ? "Add nodes to get started"
                    : mode === "build"
                    ? "Build your tree, then switch to Visualize mode"
                    : "Run an algorithm to see visualization controls"}
                </div>
              )}
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

      {/* Fullscreen Mode */}
      {isFullscreen && (
        <FullscreenTreeVisualizer
          tree={tree}
          currentStep={currentStep}
          treeSteps={treeSteps}
          playback={playback}
          algorithmInfo={currentAlgorithmInfo}
          onExit={() => setIsFullscreen(false)}
          onTreeChange={handleTreeChange}
        />
      )}
    </div>
  );
}
