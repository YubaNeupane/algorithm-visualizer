import {
  getInsertSteps as bstInsertSteps,
  getDeleteSteps as bstDeleteSteps,
  getSearchSteps as bstSearchSteps,
  getTraversalSteps as bstTraversalSteps,
  bstInfo,
} from "./bst";
import {
  getInsertSteps as avlInsertSteps,
  createBalancedTree,
  avlInfo,
  avlDefaultDatasets,
} from "./avl";
import { TreeStep, TreeNode, AlgorithmInfo } from "@/types/algorithm";

export interface TreeAlgorithm {
  name: string;
  info: AlgorithmInfo;
  operations: {
    insert?: (
      values: number[],
      existingRoot?: TreeNode
    ) => {
      steps: TreeStep[];
      finalTree: TreeNode | null;
    };
    delete?: (
      value: number,
      root: TreeNode
    ) => {
      steps: TreeStep[];
      finalTree: TreeNode | null;
    };
    search?: (value: number, root: TreeNode) => TreeStep[];
    traversal?: (
      root: TreeNode,
      traversalType: "inorder" | "preorder" | "postorder"
    ) => TreeStep[];
    createBalanced?: (values: number[]) => TreeNode | null;
  };
}

export const treeAlgorithms: Record<string, TreeAlgorithm> = {
  bst: {
    name: "Binary Search Tree",
    info: bstInfo,
    operations: {
      insert: bstInsertSteps,
      delete: bstDeleteSteps,
      search: bstSearchSteps,
      traversal: bstTraversalSteps,
    },
  },
  avl: {
    name: "AVL Tree",
    info: avlInfo,
    operations: {
      insert: avlInsertSteps,
      createBalanced: createBalancedTree,
    },
  },
};

export const treeAlgorithmsList = Object.keys(treeAlgorithms).map((key) => ({
  id: key,
  ...treeAlgorithms[key],
}));

// Default datasets for tree testing
export const treeDefaultDatasets = {
  small: [50, 30, 70, 20, 40, 60, 80],
  medium: [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45],
  large: [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65, 75, 85],
  unbalanced: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  bstBalanced: [50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 43],
  duplicateTest: [5, 3, 7, 3, 8, 1, 9], // For testing duplicate handling
  ...avlDefaultDatasets,
};

export type TreeOperation = "insert" | "delete" | "search" | "traversal";
