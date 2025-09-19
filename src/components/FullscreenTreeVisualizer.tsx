"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TreeCanvas } from "./TreeCanvas";
import { Controls } from "./Controls";
import { TreeNode, TreeStep } from "@/types/algorithm";
import {
  Maximize,
  Minimize,
  Code,
  BarChart3,
  Settings,
  Play,
  Pause,
  X,
  Move,
  Download,
  Upload,
} from "lucide-react";
import clsx from "clsx";

interface FloatingPanel {
  id: string;
  title: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isVisible: boolean;
  zIndex: number;
}

interface FullscreenTreeVisualizerProps {
  tree: TreeNode | null;
  currentStep: TreeStep | null;
  treeSteps: TreeStep[];
  playback: any;
  onExit: () => void;
  algorithmInfo?: any;
  onTreeChange?: (tree: TreeNode | null) => void;
}

export function FullscreenTreeVisualizer({
  tree,
  currentStep,
  treeSteps,
  playback,
  onExit,
  algorithmInfo,
  onTreeChange,
}: FullscreenTreeVisualizerProps) {
  const [panels, setPanels] = useState<FloatingPanel[]>([
    {
      id: "controls",
      title: "Playback Controls",
      icon: <Play className="w-4 h-4" />,
      position: { x: 20, y: window.innerHeight - 200 },
      size: { width: 400, height: 120 },
      isMinimized: false,
      isVisible: true,
      zIndex: 100,
    },
    {
      id: "code",
      title: "Algorithm Code",
      icon: <Code className="w-4 h-4" />,
      position: { x: window.innerWidth - 420, y: 20 },
      size: { width: 400, height: 300 },
      isMinimized: false,
      isVisible: true,
      zIndex: 99,
    },
    {
      id: "metrics",
      title: "Performance Metrics",
      icon: <BarChart3 className="w-4 h-4" />,
      position: { x: window.innerWidth - 420, y: 340 },
      size: { width: 400, height: 250 },
      isMinimized: false,
      isVisible: true,
      zIndex: 98,
    },
    {
      id: "settings",
      title: "Settings & Tools",
      icon: <Settings className="w-4 h-4" />,
      position: { x: 20, y: 20 },
      size: { width: 320, height: 200 },
      isMinimized: false,
      isVisible: true,
      zIndex: 97,
    },
  ]);

  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    panelId: string | null;
    offset: { x: number; y: number };
  }>({
    isDragging: false,
    panelId: null,
    offset: { x: 0, y: 0 },
  });

  const [showCode, setShowCode] = useState(true);
  const [metrics, setMetrics] = useState({
    nodesVisited: 0,
    comparisons: 0,
    operations: 0,
    treeDepth: 0,
    treeBalance: 0,
    executionTime: 0,
  });

  // Calculate metrics from current state
  useEffect(() => {
    if (tree && treeSteps.length > 0) {
      const visited = treeSteps
        .slice(0, playback.currentStep + 1)
        .filter((step) => step.type === "tree-search").length;

      const depth = calculateTreeDepth(tree);
      const balance = calculateTreeBalance(tree);

      setMetrics({
        nodesVisited: visited,
        comparisons: visited,
        operations: playback.currentStep + 1,
        treeDepth: depth,
        treeBalance: balance,
        executionTime: (playback.currentStep + 1) * 50, // Simulated ms
      });
    }
  }, [tree, treeSteps, playback.currentStep]);

  const calculateTreeDepth = (node: TreeNode | null): number => {
    if (!node) return 0;
    const leftDepth = node.left ? calculateTreeDepth(node.left) : 0;
    const rightDepth = node.right ? calculateTreeDepth(node.right) : 0;
    return 1 + Math.max(leftDepth, rightDepth);
  };

  const calculateTreeBalance = (node: TreeNode | null): number => {
    if (!node) return 0;
    const leftDepth = node.left ? calculateTreeDepth(node.left) : 0;
    const rightDepth = node.right ? calculateTreeDepth(node.right) : 0;
    return Math.abs(leftDepth - rightDepth);
  };

  const handlePanelMouseDown = (e: React.MouseEvent, panelId: string) => {
    if ((e.target as HTMLElement).closest(".panel-content")) return;

    const panel = panels.find((p) => p.id === panelId);
    if (!panel) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragState({
      isDragging: true,
      panelId,
      offset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    });

    // Bring panel to front
    setPanels((prev) =>
      prev.map((p) =>
        p.id === panelId
          ? { ...p, zIndex: Math.max(...prev.map((panel) => panel.zIndex)) + 1 }
          : p
      )
    );
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.panelId) return;

      setPanels((prev) =>
        prev.map((panel) =>
          panel.id === dragState.panelId
            ? {
                ...panel,
                position: {
                  x: Math.max(
                    0,
                    Math.min(
                      window.innerWidth - panel.size.width,
                      e.clientX - dragState.offset.x
                    )
                  ),
                  y: Math.max(
                    0,
                    Math.min(
                      window.innerHeight - panel.size.height,
                      e.clientY - dragState.offset.y
                    )
                  ),
                },
              }
            : panel
        )
      );
    };

    const handleMouseUp = () => {
      setDragState({
        isDragging: false,
        panelId: null,
        offset: { x: 0, y: 0 },
      });
    };

    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState]);

  const togglePanel = (panelId: string) => {
    setPanels((prev) =>
      prev.map((panel) =>
        panel.id === panelId
          ? { ...panel, isMinimized: !panel.isMinimized }
          : panel
      )
    );
  };

  const hidePanel = (panelId: string) => {
    setPanels((prev) =>
      prev.map((panel) =>
        panel.id === panelId ? { ...panel, isVisible: false } : panel
      )
    );
  };

  const bstCodeExample = `// BST Insertion Algorithm
function insert(root, value) {
  // Base case: empty tree
  if (root === null) {
    return new TreeNode(value);
  }
  
  // Compare with current node
  if (value < root.value) {
    // Insert in left subtree
    root.left = insert(root.left, value);
  } else if (value > root.value) {
    // Insert in right subtree
    root.right = insert(root.right, value);
  }
  
  return root;
}`;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onExit();
          break;
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
        case "c":
        case "C":
          setShowCode(!showCode);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playback, showCode, onExit]);

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 overflow-hidden">
      {/* Main visualization area */}
      <div className="w-full h-full relative">
        <TreeCanvas
          tree={tree}
          currentStep={currentStep}
          className="w-full h-full"
        />

        {/* Exit button */}
        <button
          onClick={onExit}
          className="absolute top-4 left-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg z-50 flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Exit Fullscreen
        </button>

        {/* Keyboard shortcuts hint */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
          ESC: Exit • Space: Play/Pause • ←/→: Step • C: Toggle Code
        </div>
      </div>

      {/* Floating Panels */}
      <AnimatePresence>
        {panels
          .filter((panel) => panel.isVisible)
          .map((panel) => (
            <motion.div
              key={panel.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: panel.position.x,
                y: panel.position.y,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                zIndex: panel.zIndex,
                width: panel.size.width,
                height: panel.isMinimized ? 40 : panel.size.height,
              }}
              className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onMouseDown={(e) => handlePanelMouseDown(e, panel.id)}
            >
              {/* Panel Header */}
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 flex items-center justify-between cursor-move select-none">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {panel.icon}
                  {panel.title}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => togglePanel(panel.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    {panel.isMinimized ? (
                      <Maximize className="w-3 h-3" />
                    ) : (
                      <Minimize className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={() => hidePanel(panel.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Panel Content */}
              {!panel.isMinimized && (
                <div className="panel-content p-4 h-full overflow-auto">
                  {panel.id === "controls" && (
                    <div className="space-y-4">
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
                    </div>
                  )}

                  {panel.id === "code" && (
                    <div className="space-y-3">
                      <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg text-xs overflow-auto font-mono">
                        <code>{bstCodeExample}</code>
                      </pre>
                      {currentStep && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 border-t pt-2">
                          <strong>Current:</strong> {currentStep.description}
                        </div>
                      )}
                    </div>
                  )}

                  {panel.id === "metrics" && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="font-semibold text-blue-700 dark:text-blue-300">
                          Nodes Visited
                        </div>
                        <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                          {metrics.nodesVisited}
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="font-semibold text-green-700 dark:text-green-300">
                          Comparisons
                        </div>
                        <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                          {metrics.comparisons}
                        </div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                        <div className="font-semibold text-purple-700 dark:text-purple-300">
                          Tree Depth
                        </div>
                        <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                          {metrics.treeDepth}
                        </div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                        <div className="font-semibold text-orange-700 dark:text-orange-300">
                          Balance Factor
                        </div>
                        <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                          {metrics.treeBalance}
                        </div>
                      </div>
                      <div className="col-span-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <div className="font-semibold text-gray-700 dark:text-gray-300">
                          Execution Time
                        </div>
                        <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                          {metrics.executionTime}ms
                        </div>
                      </div>
                    </div>
                  )}

                  {panel.id === "settings" && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">
                          <Download className="w-4 h-4" />
                          Export Tree
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 p-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm">
                          <Upload className="w-4 h-4" />
                          Import Tree
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          Show node IDs
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          Show tree height
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded"
                          />
                          Auto-zoom to fit
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
