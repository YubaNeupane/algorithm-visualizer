"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TreeNode, TreeStep } from "@/types/algorithm";
import clsx from "clsx";

interface TreeCanvasProps {
  tree: TreeNode | null;
  currentStep: TreeStep | null;
  className?: string;
  isInteractive?: boolean;
  onTreeUpdate?: (newTree: TreeNode | null) => void;
}

interface DragState {
  isDragging: boolean;
  draggedNode: TreeNode | null;
  originalPosition: { x: number; y: number } | null;
  offset: { x: number; y: number };
}

interface TreeNodeComponentProps {
  node: TreeNode;
  currentStep: TreeStep | null;
  parentX?: number;
  parentY?: number;
  scale: number;
  isMobile: boolean;
}

function TreeNodeComponent({
  node,
  currentStep,
  parentX,
  parentY,
  scale,
  isMobile,
}: TreeNodeComponentProps) {
  // Responsive node sizing
  const nodeRadius = isMobile ? 16 : 20;
  const fontSize = isMobile ? "12px" : "14px";
  const strokeWidth = isMobile ? 1.5 : 2;

  // Get node color based on current step
  const getNodeColor = (): string => {
    if (!currentStep)
      return "bg-blue-500 dark:bg-blue-400 border-blue-600 dark:border-blue-500";

    switch (currentStep.type) {
      case "tree-search":
        if (currentStep.nodeId === node.id) {
          return currentStep.found
            ? "bg-green-500 dark:bg-green-400 border-green-600 dark:border-green-500" // Found
            : "bg-yellow-500 dark:bg-yellow-400 border-yellow-600 dark:border-yellow-500"; // Searching
        }
        break;
      case "tree-insert":
        if (currentStep.nodeId === node.id) {
          return "bg-green-500 dark:bg-green-400 border-green-600 dark:border-green-500"; // Newly inserted
        }
        break;
      case "tree-delete":
        if (currentStep.nodeId === node.id) {
          return "bg-red-500 dark:bg-red-400 border-red-600 dark:border-red-500"; // Being deleted
        }
        if (currentStep.replacementNodeId === node.id) {
          return "bg-orange-500 dark:bg-orange-400 border-orange-600 dark:border-orange-500"; // Replacement node
        }
        break;
      case "tree-rotation":
        if (currentStep.affectedNodeIds.includes(node.id)) {
          return "bg-purple-500 dark:bg-purple-400 border-purple-600 dark:border-purple-500"; // Affected by rotation
        }
        break;
      case "tree-traversal":
        if (currentStep.nodeId === node.id) {
          return "bg-cyan-500 dark:bg-cyan-400 border-cyan-600 dark:border-cyan-500"; // Currently being visited
        }
        break;
    }

    return "bg-blue-500 dark:bg-blue-400 border-blue-600 dark:border-blue-500"; // Default
  };

  // Get node scale based on current step
  const getNodeScale = (): number => {
    if (!currentStep) return 1;

    if (
      (currentStep.type === "tree-insert" && currentStep.nodeId === node.id) ||
      (currentStep.type === "tree-search" && currentStep.nodeId === node.id) ||
      (currentStep.type === "tree-traversal" && currentStep.nodeId === node.id)
    ) {
      return isMobile ? 1.1 : 1.2; // Slightly smaller emphasis on mobile
    }

    return 1;
  };

  // Get SVG fill color
  const getNodeFill = (): string => {
    if (!currentStep) return "#3B82F6"; // blue-500

    switch (currentStep.type) {
      case "tree-search":
        if (currentStep.nodeId === node.id) {
          return currentStep.found ? "#10B981" : "#F59E0B"; // green-500 or yellow-500
        }
        break;
      case "tree-insert":
        if (currentStep.nodeId === node.id) {
          return "#10B981"; // green-500
        }
        break;
      case "tree-delete":
        if (currentStep.nodeId === node.id) {
          return "#EF4444"; // red-500
        }
        if (currentStep.replacementNodeId === node.id) {
          return "#F97316"; // orange-500
        }
        break;
      case "tree-rotation":
        if (currentStep.affectedNodeIds.includes(node.id)) {
          return "#8B5CF6"; // purple-500
        }
        break;
      case "tree-traversal":
        if (currentStep.nodeId === node.id) {
          return "#06B6D4"; // cyan-500
        }
        break;
    }

    return "#3B82F6"; // blue-500 default
  };

  // Get SVG stroke color
  const getNodeStroke = (): string => {
    if (!currentStep) return "#2563EB"; // blue-600

    switch (currentStep.type) {
      case "tree-search":
        if (currentStep.nodeId === node.id) {
          return currentStep.found ? "#059669" : "#D97706"; // green-600 or yellow-600
        }
        break;
      case "tree-insert":
        if (currentStep.nodeId === node.id) {
          return "#059669"; // green-600
        }
        break;
      case "tree-delete":
        if (currentStep.nodeId === node.id) {
          return "#DC2626"; // red-600
        }
        if (currentStep.replacementNodeId === node.id) {
          return "#EA580C"; // orange-600
        }
        break;
      case "tree-rotation":
        if (currentStep.affectedNodeIds.includes(node.id)) {
          return "#7C3AED"; // purple-600
        }
        break;
      case "tree-traversal":
        if (currentStep.nodeId === node.id) {
          return "#0891B2"; // cyan-600
        }
        break;
    }

    return "#2563EB"; // blue-600 default
  };

  return (
    <g>
      {/* Edge to parent */}
      {parentX !== undefined && parentY !== undefined && (
        <motion.line
          x1={parentX}
          y1={parentY}
          x2={node.x}
          y2={node.y}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-400 dark:text-gray-600"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}

      {/* Node circle */}
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={nodeRadius}
        fill={getNodeFill()}
        stroke={getNodeStroke()}
        strokeWidth={2}
        style={{ cursor: "pointer" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: getNodeScale(), opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        whileHover={{ scale: getNodeScale() * 1.05 }}
        whileTap={{ scale: getNodeScale() * 0.95 }}
        layout
      />

      {/* Node value text */}
      <motion.text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white text-sm font-semibold pointer-events-none select-none"
        style={{ fontSize }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {node.value}
      </motion.text>

      {/* Height label for AVL trees - hide on small screens */}
      {node.height !== undefined && !isMobile && (
        <motion.text
          x={node.x + 25}
          y={node.y - 25}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-gray-400 text-xs pointer-events-none select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          h:{node.height}
        </motion.text>
      )}

      {/* Recursively render children */}
      {node.left && (
        <TreeNodeComponent
          node={node.left}
          currentStep={currentStep}
          parentX={node.x}
          parentY={node.y}
          scale={scale}
          isMobile={isMobile}
        />
      )}
      {node.right && (
        <TreeNodeComponent
          node={node.right}
          currentStep={currentStep}
          parentX={node.x}
          parentY={node.y}
          scale={scale}
          isMobile={isMobile}
        />
      )}
    </g>
  );
}

export function TreeCanvas({ tree, currentStep, className }: TreeCanvasProps) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive breakpoints
  const isMobile = containerSize.width < 768;
  const isTablet = containerSize.width >= 768 && containerSize.width < 1024;

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: Math.max(rect.width, 800),
          height: Math.max(rect.height, isMobile ? 500 : 650),
        });
      }
    };

    // Use timeout to ensure DOM is ready
    const timeoutId = setTimeout(updateSize, 100);
    window.addEventListener("resize", updateSize);

    // Add passive event listener to prevent page scroll during tree zoom
    const handleWheelCapture = (e: WheelEvent) => {
      if (
        containerRef.current &&
        containerRef.current.contains(e.target as Node)
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };

    document.addEventListener("wheel", handleWheelCapture, {
      passive: false,
      capture: true,
    });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateSize);
      document.removeEventListener("wheel", handleWheelCapture, {
        capture: true,
      });
    };
  }, [isMobile]);

  // Reset scale and pan when tree changes or screen size changes significantly
  useEffect(() => {
    setScale(isMobile ? 0.7 : isTablet ? 0.85 : 1);
    setPanOffset({ x: 0, y: 0 });
  }, [tree, isMobile, isTablet]);

  // Handle zoom with smooth transitions
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY * -0.001;
      const newScale = Math.min(Math.max(0.3, scale + delta), 3);

      // Smooth zoom transition
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

          // Easing function for smooth transition
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

  // Handle pan start
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsPanning(true);
      setLastPanPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  // Handle pan move
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

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning || e.touches.length !== 1) return;

    const deltaX = e.touches[0].clientX - lastPanPoint.x;
    const deltaY = e.touches[0].clientY - lastPanPoint.y;

    setPanOffset((prev) => ({
      x: prev.x + deltaX / scale,
      y: prev.y + deltaY / scale,
    }));

    setLastPanPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  // Handle pan end
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  // Reset view
  const resetView = () => {
    setScale(isMobile ? 0.7 : isTablet ? 0.85 : 1);
    setPanOffset({ x: 0, y: 0 });
  };

  if (!tree) {
    return (
      <div
        className={clsx(
          "flex items-center justify-center min-h-80 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600",
          className
        )}
      >
        <motion.div
          className="text-center p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-lg font-medium mb-2">No tree to display</div>
          <div className="text-sm">Insert some values to get started</div>
        </motion.div>
      </div>
    );
  }

  const viewBoxWidth = 800;
  const viewBoxHeight = 600;
  const transformString = `translate(${panOffset.x}, ${panOffset.y}) scale(${scale})`;

  return (
    <div
      className={clsx("w-full h-full relative", className)}
      ref={containerRef}
    >
      {/* Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={() => setScale((prev) => Math.min(prev * 1.2, 3))}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          title="Zoom In"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Mobile instructions */}
      {isMobile && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-3 py-1 rounded-full text-xs">
          Pinch to zoom • Drag to pan
        </div>
      )}

      <motion.div
        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: containerSize.height }}
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
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: "none" }}
        >
          <g transform={transformString}>
            <TreeNodeComponent
              node={tree}
              currentStep={currentStep}
              scale={scale}
              isMobile={isMobile}
            />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}

// Enhanced Legend component with responsive design
export function TreeLegend() {
  const legendItems = [
    { color: "bg-blue-500 dark:bg-blue-400", label: "Default" },
    { color: "bg-yellow-500 dark:bg-yellow-400", label: "Searching" },
    { color: "bg-green-500 dark:bg-green-400", label: "Found/Inserted" },
    { color: "bg-red-500 dark:bg-red-400", label: "Deleted" },
    { color: "bg-orange-500 dark:bg-orange-400", label: "Replacement" },
    { color: "bg-purple-500 dark:bg-purple-400", label: "Rotation" },
    { color: "bg-cyan-500 dark:bg-cyan-400", label: "Traversal" },
  ];

  return (
    <motion.div
      className="space-y-2 p-4 text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      {legendItems.map((item, index) => (
        <motion.div
          key={item.label}
          className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div
            className={clsx(
              "h-3 w-3 rounded-full shadow-sm flex-shrink-0",
              item.color
            )}
          />
          <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">
            {item.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
