"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TreeNode } from "@/types/algorithm";
import clsx from "clsx";
import { Trash2, Plus, RotateCcw, Download, Upload } from "lucide-react";

interface InteractiveTreeBuilderProps {
  className?: string;
  onTreeChange?: (tree: TreeNode | null) => void;
  initialTree?: TreeNode | null;
}

interface DragState {
  isDragging: boolean;
  draggedNode: TreeNode | null;
  dragOffset: { x: number; y: number };
  ghostPosition: { x: number; y: number } | null;
}

interface TreeNodeDraggableProps {
  node: TreeNode;
  onNodeDrag: (nodeId: string, newPosition: { x: number; y: number }) => void;
  onNodeDelete: (nodeId: string) => void;
  parentX?: number;
  parentY?: number;
  scale: number;
  dragState: DragState;
  setDragState: React.Dispatch<React.SetStateAction<DragState>>;
  isDraggingAny: boolean;
}

function TreeNodeDraggable({
  node,
  onNodeDrag,
  onNodeDelete,
  parentX,
  parentY,
  scale,
  dragState,
  setDragState,
  isDraggingAny,
}: TreeNodeDraggableProps) {
  const nodeRadius = 20;
  const fontSize = "14px";
  const strokeWidth = 2;

  const isDragging = dragState.draggedNode?.id === node.id;
  const isGhost = isDraggingAny && !isDragging;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
    const svgRect = (
      e.currentTarget.closest("svg") as SVGSVGElement
    )?.getBoundingClientRect();
    if (!svgRect) return;

    const clickX = e.clientX - svgRect.left;
    const clickY = e.clientY - svgRect.top;

    setDragState({
      isDragging: true,
      draggedNode: node,
      dragOffset: {
        x: clickX - node.x * scale,
        y: clickY - node.y * scale,
      },
      ghostPosition: { x: node.x, y: node.y },
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete node ${node.value}?`)) {
      onNodeDelete(node.id);
    }
  };

  return (
    <g opacity={isGhost ? 0.3 : 1}>
      {/* Edge to parent */}
      {parentX !== undefined && parentY !== undefined && (
        <motion.line
          x1={parentX}
          y1={parentY}
          x2={
            isDragging && dragState.ghostPosition
              ? dragState.ghostPosition.x
              : node.x
          }
          y2={
            isDragging && dragState.ghostPosition
              ? dragState.ghostPosition.y
              : node.y
          }
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-400 dark:text-gray-600"
          strokeDasharray={isDragging ? "5,5" : "none"}
          animate={{
            x2:
              isDragging && dragState.ghostPosition
                ? dragState.ghostPosition.x
                : node.x,
            y2:
              isDragging && dragState.ghostPosition
                ? dragState.ghostPosition.y
                : node.y,
          }}
        />
      )}

      {/* Node circle */}
      <motion.circle
        cx={
          isDragging && dragState.ghostPosition
            ? dragState.ghostPosition.x
            : node.x
        }
        cy={
          isDragging && dragState.ghostPosition
            ? dragState.ghostPosition.y
            : node.y
        }
        r={nodeRadius}
        fill={isDragging ? "#F59E0B" : "#3B82F6"}
        stroke={isDragging ? "#D97706" : "#2563EB"}
        strokeWidth={strokeWidth}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          filter: isDragging
            ? "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
            : "none",
        }}
        animate={{
          cx:
            isDragging && dragState.ghostPosition
              ? dragState.ghostPosition.x
              : node.x,
          cy:
            isDragging && dragState.ghostPosition
              ? dragState.ghostPosition.y
              : node.y,
          scale: isDragging ? 1.1 : 1,
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* Node value text */}
      <motion.text
        x={
          isDragging && dragState.ghostPosition
            ? dragState.ghostPosition.x
            : node.x
        }
        y={
          isDragging && dragState.ghostPosition
            ? dragState.ghostPosition.y
            : node.y
        }
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white text-sm font-semibold pointer-events-none select-none"
        style={{ fontSize }}
        animate={{
          x:
            isDragging && dragState.ghostPosition
              ? dragState.ghostPosition.x
              : node.x,
          y:
            isDragging && dragState.ghostPosition
              ? dragState.ghostPosition.y
              : node.y,
        }}
      >
        {node.value}
      </motion.text>

      {/* Delete button when hovered (only when not dragging) */}
      {!isDraggingAny && (
        <motion.circle
          cx={
            (isDragging && dragState.ghostPosition
              ? dragState.ghostPosition.x
              : node.x) + 15
          }
          cy={
            (isDragging && dragState.ghostPosition
              ? dragState.ghostPosition.y
              : node.y) - 15
          }
          r={8}
          fill="#EF4444"
          stroke="#DC2626"
          strokeWidth={1}
          style={{ cursor: "pointer" }}
          className="opacity-0 hover:opacity-100 transition-opacity"
          onClick={handleDoubleClick}
          whileHover={{ scale: 1.1 }}
        />
      )}

      {/* Recursively render children */}
      {node.left && (
        <TreeNodeDraggable
          node={node.left}
          onNodeDrag={onNodeDrag}
          onNodeDelete={onNodeDelete}
          parentX={
            isDragging && dragState.ghostPosition
              ? dragState.ghostPosition.x
              : node.x
          }
          parentY={
            isDragging && dragState.ghostPosition
              ? dragState.ghostPosition.y
              : node.y
          }
          scale={scale}
          dragState={dragState}
          setDragState={setDragState}
          isDraggingAny={isDraggingAny}
        />
      )}
      {node.right && (
        <TreeNodeDraggable
          node={node.right}
          onNodeDrag={onNodeDrag}
          onNodeDelete={onNodeDelete}
          parentX={
            isDragging && dragState.ghostPosition
              ? dragState.ghostPosition.x
              : node.x
          }
          parentY={
            isDragging && dragState.ghostPosition
              ? dragState.ghostPosition.y
              : node.y
          }
          scale={scale}
          dragState={dragState}
          setDragState={setDragState}
          isDraggingAny={isDraggingAny}
        />
      )}
    </g>
  );
}

export function InteractiveTreeBuilder({
  className,
  onTreeChange,
  initialTree = null,
}: InteractiveTreeBuilderProps) {
  const [tree, setTree] = useState<TreeNode | null>(initialTree);
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedNode: null,
    dragOffset: { x: 0, y: 0 },
    ghostPosition: null,
  });
  const [newNodeValue, setNewNodeValue] = useState("");

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate unique ID for nodes
  const generateNodeId = () =>
    `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Handle global mouse move for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging || !svgRef.current) return;

      const svgRect = svgRef.current.getBoundingClientRect();

      // Calculate position relative to SVG viewBox
      const svgX = ((e.clientX - svgRect.left) / svgRect.width) * viewBoxWidth;
      const svgY = ((e.clientY - svgRect.top) / svgRect.height) * viewBoxHeight;

      // Apply pan and scale transformations
      const newX = (svgX - panOffset.x) / scale;
      const newY = (svgY - panOffset.y) / scale;

      setDragState((prev) => ({
        ...prev,
        ghostPosition: { x: newX, y: newY },
      }));
    };

    const handleGlobalMouseUp = () => {
      if (
        dragState.isDragging &&
        dragState.draggedNode &&
        dragState.ghostPosition
      ) {
        onNodeDrag(dragState.draggedNode.id, dragState.ghostPosition);
      }
      setDragState({
        isDragging: false,
        draggedNode: null,
        dragOffset: { x: 0, y: 0 },
        ghostPosition: null,
      });
    };

    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [dragState, panOffset, scale]);

  // Update tree when changed
  useEffect(() => {
    onTreeChange?.(tree);
  }, [tree, onTreeChange]);

  // Handle node dragging
  const onNodeDrag = useCallback(
    (nodeId: string, newPosition: { x: number; y: number }) => {
      const updateNodePosition = (node: TreeNode | null): TreeNode | null => {
        if (!node) return null;

        if (node.id === nodeId) {
          return { ...node, x: newPosition.x, y: newPosition.y };
        }

        return {
          ...node,
          left: updateNodePosition(node.left || null),
          right: updateNodePosition(node.right || null),
        };
      };

      setTree((prev) => updateNodePosition(prev));
    },
    []
  );

  // Handle node deletion
  const onNodeDelete = useCallback((nodeId: string) => {
    const deleteNode = (
      node: TreeNode | null,
      parentNode: TreeNode | null = null,
      isLeftChild = false
    ): TreeNode | null => {
      if (!node) return null;

      if (node.id === nodeId) {
        // Handle deletion based on number of children
        if (!node.left && !node.right) {
          // No children - just remove
          return null;
        } else if (node.left && !node.right) {
          // Only left child
          return node.left;
        } else if (!node.left && node.right) {
          // Only right child
          return node.right;
        } else {
          // Two children - replace with inorder successor
          let successor = node.right;
          while (successor?.left) {
            successor = successor.left;
          }
          if (successor) {
            return {
              ...successor,
              left: node.left,
              right: deleteNode(node.right, node, false),
              x: node.x,
              y: node.y,
            };
          }
        }
      }

      return {
        ...node,
        left: deleteNode(node.left || null, node, true),
        right: deleteNode(node.right || null, node, false),
      };
    };

    setTree((prev) => {
      if (prev?.id === nodeId && !prev.left && !prev.right) {
        return null;
      }
      return deleteNode(prev);
    });
  }, []);

  // Add new node
  const addNode = useCallback(() => {
    const value = parseInt(newNodeValue);
    if (isNaN(value)) return;

    const newNode: TreeNode = {
      id: generateNodeId(),
      value,
      x: 400 + (Math.random() - 0.5) * 200,
      y: 300 + (Math.random() - 0.5) * 200,
    };

    if (!tree) {
      setTree(newNode);
    } else {
      // Add as a floating node for now - user can drag it to position
      setTree((prev) => ({ ...prev!, right: prev!.right || newNode }));
    }

    setNewNodeValue("");
  }, [newNodeValue, tree]);

  // Clear tree
  const clearTree = useCallback(() => {
    setTree(null);
  }, []);

  // Pan and zoom handlers (same as TreeCanvas)
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY * -0.001;
      const newScale = Math.min(Math.max(0.3, scale + delta), 3);

      const smoothZoom = (
        currentScale: number,
        targetScale: number,
        duration: number = 150
      ) => {
        const startTime = performance.now();
        const scaleChange = targetScale - currentScale;

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentValue = currentScale + scaleChange * easeOutQuart;

          setScale(currentValue);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      };

      smoothZoom(scale, newScale);
    },
    [scale]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragState.isDragging) return;
    setIsPanning(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;

    const deltaX = e.clientX - lastPanPoint.x;
    const deltaY = e.clientY - lastPanPoint.y;

    setPanOffset((prev) => ({
      x: prev.x + deltaX / scale,
      y: prev.y + deltaY / scale,
    }));

    setLastPanPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const resetView = () => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const viewBoxWidth = 800;
  const viewBoxHeight = 600;
  const transformString = `translate(${panOffset.x}, ${panOffset.y}) scale(${scale})`;

  return (
    <div
      className={clsx("w-full h-full relative", className)}
      ref={containerRef}
    >
      {/* Toolbar */}
      <div className="absolute top-2 left-2 z-10 flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
        <input
          type="number"
          value={newNodeValue}
          onChange={(e) => setNewNodeValue(e.target.value)}
          placeholder="Enter value"
          className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          onKeyPress={(e) => e.key === "Enter" && addNode()}
        />
        <button
          onClick={addNode}
          disabled={!newNodeValue}
          className="p-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded text-sm transition-colors"
          title="Add Node"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={clearTree}
          className="p-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
          title="Clear Tree"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={() => setScale((prev) => Math.min(prev * 1.2, 3))}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setScale((prev) => Math.max(prev * 0.8, 0.3))}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          title="Zoom Out"
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
              d="M18 12H6"
            />
          </svg>
        </button>
        <button
          onClick={resetView}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-3 py-1 rounded-full text-xs">
        Drag nodes to move • Double-click to delete • Scroll to zoom
      </div>

      {/* Canvas */}
      <motion.div
        className={clsx(
          "w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 overflow-hidden",
          isPanning ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{ height: "600px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="select-none"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ touchAction: "none" }}
        >
          <g transform={transformString}>
            {/* Grid */}
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gray-200 dark:text-gray-700 opacity-50"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Tree */}
            {tree && (
              <TreeNodeDraggable
                node={tree}
                onNodeDrag={onNodeDrag}
                onNodeDelete={onNodeDelete}
                scale={scale}
                dragState={dragState}
                setDragState={setDragState}
                isDraggingAny={dragState.isDragging}
              />
            )}

            {/* Drop zone hint when no tree */}
            {!tree && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <circle
                  cx={400}
                  cy={300}
                  r={30}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeDasharray="5,5"
                  className="text-gray-400 dark:text-gray-600"
                />
                <text
                  x={400}
                  y={300}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gray-400 dark:fill-gray-600 text-sm"
                >
                  Add Node
                </text>
              </motion.g>
            )}
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
