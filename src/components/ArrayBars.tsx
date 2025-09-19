"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SortingStep } from "@/types/algorithm";
import clsx from "clsx";

interface ArrayBarsProps {
  data: number[];
  currentStep: SortingStep | null;
  showIndices?: boolean;
  showValues?: boolean;
  className?: string;
}

export function ArrayBars({
  data,
  currentStep,
  showIndices = true,
  showValues = true,
  className,
}: ArrayBarsProps) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const displayData = data;

  if (displayData.length === 0) {
    return (
      <div
        className={clsx("flex items-center justify-center min-h-64", className)}
      >
        <p className="text-gray-500 dark:text-gray-400">No data to visualize</p>
      </div>
    );
  }

  // Calculate responsive dimensions
  const isMobile = containerSize.width < 768;
  const isTablet = containerSize.width >= 768 && containerSize.width < 1024;
  const maxValue = Math.max(...displayData);
  const minValue = Math.min(...displayData);
  const range = maxValue - minValue;

  // Responsive bar configuration - USE FULL AVAILABLE WIDTH
  const getBarConfig = () => {
    // Use actual container width instead of fixed values
    const actualWidth = containerSize.width * 0.8; // Use 80% of available width to account for sidebar
    const minBarWidth = isMobile ? 8 : 12;
    const gap = isMobile ? 1 : 2;
    const maxHeight = isMobile ? 200 : isTablet ? 250 : 300;

    // Calculate total gap space needed
    const totalGapSpace = (displayData.length - 1) * gap;
    const availableWidthForBars = actualWidth - totalGapSpace - 32; // 32px for padding

    // Calculate dynamic bar width to use ALL available space
    let barWidth = Math.max(
      minBarWidth,
      availableWidthForBars / displayData.length
    );

    // Only enable scrolling for very large datasets
    const needsScroll =
      displayData.length > (isMobile ? 25 : 40) && barWidth < minBarWidth;
    if (needsScroll) {
      barWidth = minBarWidth + 4;
    }

    return {
      barWidth,
      maxHeight,
      gap,
      needsScroll,
      fontSize: isMobile ? "text-xs" : "text-sm",
    };
  };

  const config = getBarConfig();

  // Get the color for a bar based on the current step
  const getBarColor = (index: number): string => {
    if (!currentStep) return "bg-blue-500 dark:bg-blue-400";

    switch (currentStep.type) {
      case "compare":
        if (currentStep.indices.includes(index)) {
          return "bg-yellow-500 dark:bg-yellow-400"; // Comparing elements
        }
        break;
      case "swap":
        if (currentStep.indices.includes(index)) {
          return "bg-red-500 dark:bg-red-400"; // Swapping elements
        }
        break;
      case "highlight":
        if (currentStep.indices.includes(index)) {
          switch (currentStep.highlightType) {
            case "sorted":
              return "bg-green-500 dark:bg-green-400"; // Sorted elements
            case "active":
              return "bg-orange-500 dark:bg-orange-400"; // Currently active
            case "pivot":
              return "bg-purple-500 dark:bg-purple-400"; // Pivot element
            case "merge":
              return "bg-cyan-500 dark:bg-cyan-400"; // Merge area
            case "partition":
              return "bg-pink-500 dark:bg-pink-400"; // Partition area
            default:
              return "bg-yellow-500 dark:bg-yellow-400";
          }
        }
        break;
      case "overwrite":
        if (currentStep.index === index) {
          return "bg-orange-500 dark:bg-orange-400"; // Element being overwritten
        }
        break;
      case "merge":
        if (currentStep.targetIndex === index) {
          return "bg-cyan-500 dark:bg-cyan-400"; // Target of merge
        }
        if (currentStep.sourceIndices.includes(index)) {
          return "bg-blue-300 dark:bg-blue-600"; // Source of merge
        }
        break;
    }

    return "bg-blue-500 dark:bg-blue-400"; // Default color
  };

  // Calculate bar height (minimum based on screen size)
  const getBarHeight = (value: number): number => {
    if (range === 0) return config.maxHeight / 2;
    const normalizedValue = (value - minValue) / range;
    const minHeight = isMobile ? 16 : 20;
    return Math.max(minHeight, normalizedValue * config.maxHeight + minHeight);
  };

  const containerClass = config.needsScroll
    ? "overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
    : "overflow-hidden";

  return (
    <div className={clsx("w-full h-full", className)}>
      <div className={containerClass}>
        <div
          className="flex items-end justify-center px-2 py-2 h-full w-full"
          style={{
            minWidth: config.needsScroll
              ? displayData.length * (config.barWidth + config.gap) + 32
              : "100%",
            gap: `${config.gap}px`,
            minHeight: isMobile ? "400px" : "500px",
          }}
        >
          {displayData.map((value, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center flex-shrink-0"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.02,
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              {/* Value label */}
              {showValues && !isMobile && (
                <motion.div
                  className={clsx(
                    "mb-1 font-medium text-gray-700 dark:text-gray-300",
                    config.fontSize
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 + 0.2 }}
                >
                  {value}
                </motion.div>
              )}

              {/* Bar */}
              <motion.div
                className={clsx(
                  "rounded-t-sm shadow-sm transition-all duration-300 hover:scale-105",
                  getBarColor(index)
                )}
                style={{
                  height: getBarHeight(value),
                  width: config.barWidth,
                }}
                initial={{ height: 0, scaleY: 0 }}
                animate={{
                  height: getBarHeight(value),
                  scaleY: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: index * 0.02,
                }}
                layout
                whileHover={{ scale: 1.05 }}
              />

              {/* Index label */}
              {showIndices && (
                <motion.div
                  className={clsx(
                    "mt-1 text-gray-500 dark:text-gray-400",
                    config.fontSize
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 + 0.4 }}
                >
                  {index}
                </motion.div>
              )}

              {/* Mobile value overlay */}
              {showValues && isMobile && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 + 0.3 }}
                  style={{
                    top: `-${getBarHeight(value) / 2}px`,
                    height: `${getBarHeight(value)}px`,
                    width: config.barWidth,
                  }}
                >
                  {value}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile scroll indicator */}
      {config.needsScroll && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ← Scroll horizontally to see all bars →
          </p>
        </div>
      )}
    </div>
  );
}

// Enhanced Legend component with responsive design
export function ArrayBarsLegend() {
  const legendItems = [
    { color: "bg-blue-500 dark:bg-blue-400", label: "Default" },
    { color: "bg-yellow-500 dark:bg-yellow-400", label: "Comparing" },
    { color: "bg-red-500 dark:bg-red-400", label: "Swapping" },
    { color: "bg-green-500 dark:bg-green-400", label: "Sorted" },
    { color: "bg-orange-500 dark:bg-orange-400", label: "Active" },
    { color: "bg-purple-500 dark:bg-purple-400", label: "Pivot" },
    { color: "bg-cyan-500 dark:bg-cyan-400", label: "Merge" },
    { color: "bg-pink-500 dark:bg-pink-400", label: "Partition" },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 text-sm"
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
          <div className={clsx("h-3 w-3 rounded-sm shadow-sm", item.color)} />
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {item.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
