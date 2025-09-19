// Core types for algorithm visualization

export interface BaseStep {
  id: string;
  type: string;
  description: string;
  metadata?: Record<string, any>;
}

// Sorting algorithm steps
export interface CompareStep extends BaseStep {
  type: "compare";
  indices: [number, number];
  values: [number, number];
}

export interface SwapStep extends BaseStep {
  type: "swap";
  indices: [number, number];
  values: [number, number];
}

export interface OverwriteStep extends BaseStep {
  type: "overwrite";
  index: number;
  oldValue: number;
  newValue: number;
}

export interface HighlightStep extends BaseStep {
  type: "highlight";
  indices: number[];
  highlightType: "active" | "sorted" | "pivot" | "merge" | "partition";
}

export interface MergeStep extends BaseStep {
  type: "merge";
  sourceIndices: number[];
  targetIndex: number;
  values: number[];
}

export type SortingStep =
  | CompareStep
  | SwapStep
  | OverwriteStep
  | HighlightStep
  | MergeStep;

// Tree algorithm steps
export interface TreeNode {
  id: string;
  value: number;
  x: number;
  y: number;
  left?: TreeNode;
  right?: TreeNode;
  height?: number; // For AVL trees
  color?: "red" | "black"; // For Red-Black trees
}

export interface TreeInsertStep extends BaseStep {
  type: "tree-insert";
  nodeId: string;
  value: number;
  parentId?: string;
  position: "left" | "right" | "root";
}

export interface TreeDeleteStep extends BaseStep {
  type: "tree-delete";
  nodeId: string;
  replacementNodeId?: string;
}

export interface TreeRotationStep extends BaseStep {
  type: "tree-rotation";
  rotationType: "left" | "right" | "left-right" | "right-left";
  rootNodeId: string;
  affectedNodeIds: string[];
}

export interface TreeTraversalStep extends BaseStep {
  type: "tree-traversal";
  nodeId: string;
  traversalType: "inorder" | "preorder" | "postorder";
  visitOrder: number;
}

export interface TreeSearchStep extends BaseStep {
  type: "tree-search";
  nodeId: string;
  found: boolean;
  searchValue: number;
}

export type TreeStep =
  | TreeInsertStep
  | TreeDeleteStep
  | TreeRotationStep
  | TreeTraversalStep
  | TreeSearchStep;

// Algorithm metadata
export interface AlgorithmInfo {
  name: string;
  category: "sorting" | "tree";
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
  pseudocode: string[];
  stable?: boolean; // For sorting algorithms
}

// Visualization state
export interface VisualizationState {
  algorithm: string;
  data: number[] | TreeNode;
  steps: (SortingStep | TreeStep)[];
  currentStep: number;
  isPlaying: boolean;
  speed: number; // 0.1x to 5x
  showIndices: boolean;
  showValues: boolean;
  showComparisons: boolean;
}

// Playback controls
export interface PlaybackControls {
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  jumpToStep: (step: number) => void;
}
