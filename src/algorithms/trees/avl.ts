import {
  TreeStep,
  TreeInsertStep,
  TreeRotationStep,
  TreeNode,
  AlgorithmInfo,
} from "@/types/algorithm";

// Helper function to generate unique node IDs
let nodeIdCounter = 1000; // Start higher to avoid conflicts with BST
const generateNodeId = () => `avl-node-${nodeIdCounter++}`;

// Helper function to calculate node positions for visualization
function calculateNodePositions(
  node: TreeNode | null,
  x: number,
  y: number,
  horizontalSpacing: number
): void {
  if (!node) return;

  node.x = x;
  node.y = y;

  const childY = y + 80;
  const childSpacing = horizontalSpacing / 2;

  if (node.left) {
    calculateNodePositions(node.left, x - childSpacing, childY, childSpacing);
  }
  if (node.right) {
    calculateNodePositions(node.right, x + childSpacing, childY, childSpacing);
  }
}

// Get height of a node
function getHeight(node: TreeNode | null): number {
  if (!node) return 0;
  return node.height || 0;
}

// Update height of a node
function updateHeight(node: TreeNode): void {
  const leftHeight = getHeight(node.left || null);
  const rightHeight = getHeight(node.right || null);
  node.height = Math.max(leftHeight, rightHeight) + 1;
}

// Get balance factor of a node
function getBalance(node: TreeNode): number {
  if (!node) return 0;
  return getHeight(node.left || null) - getHeight(node.right || null);
}

// Right rotate
function rightRotate(
  y: TreeNode,
  steps: TreeStep[],
  stepId: { value: number }
): TreeNode {
  const x = y.left!;
  const T2 = x.right;

  // Add rotation step
  const rotationStep: TreeRotationStep = {
    id: `step-${stepId.value++}`,
    type: "tree-rotation",
    description: `Performing right rotation: ${y.value} becomes right child of ${x.value}`,
    rotationType: "right",
    rootNodeId: y.id,
    affectedNodeIds: [x.id, y.id, ...(T2 ? [T2.id] : [])],
  };
  steps.push(rotationStep);

  // Perform rotation
  x.right = y;
  y.left = T2 || undefined;

  // Update heights
  updateHeight(y);
  updateHeight(x);

  return x;
}

// Left rotate
function leftRotate(
  x: TreeNode,
  steps: TreeStep[],
  stepId: { value: number }
): TreeNode {
  const y = x.right!;
  const T2 = y.left;

  // Add rotation step
  const rotationStep: TreeRotationStep = {
    id: `step-${stepId.value++}`,
    type: "tree-rotation",
    description: `Performing left rotation: ${x.value} becomes left child of ${y.value}`,
    rotationType: "left",
    rootNodeId: x.id,
    affectedNodeIds: [x.id, y.id, ...(T2 ? [T2.id] : [])],
  };
  steps.push(rotationStep);

  // Perform rotation
  y.left = x;
  x.right = T2 || undefined;

  // Update heights
  updateHeight(x);
  updateHeight(y);

  return y;
}

export function getInsertSteps(
  values: number[],
  existingRoot?: TreeNode
): { steps: TreeStep[]; finalTree: TreeNode | null } {
  const steps: TreeStep[] = [];
  let root: TreeNode | null = existingRoot || null;
  const stepId = { value: 0 };

  function insertNode(node: TreeNode | null, value: number): TreeNode {
    // Step 1: Perform normal BST insertion
    if (!node) {
      const newNodeId = generateNodeId();
      const newNode: TreeNode = {
        id: newNodeId,
        value,
        x: 0,
        y: 0,
        height: 1,
      };

      const insertStep: TreeInsertStep = {
        id: `step-${stepId.value++}`,
        type: "tree-insert",
        description: `Inserting ${value} as new node`,
        nodeId: newNodeId,
        value,
        position: "root",
      };
      steps.push(insertStep);

      return newNode;
    }

    if (value < node.value) {
      node.left = insertNode(node.left || null, value);
    } else if (value > node.value) {
      node.right = insertNode(node.right || null, value);
    } else {
      // Equal values not allowed in AVL tree
      return node;
    }

    // Step 2: Update height of current node
    updateHeight(node);

    // Step 3: Get the balance factor
    const balance = getBalance(node);

    // Step 4: If unbalanced, there are 4 cases

    // Left Left Case
    if (balance > 1 && value < (node.left?.value || 0)) {
      return rightRotate(node, steps, stepId);
    }

    // Right Right Case
    if (balance < -1 && value > (node.right?.value || 0)) {
      return leftRotate(node, steps, stepId);
    }

    // Left Right Case
    if (balance > 1 && value > (node.left?.value || 0)) {
      const leftRightStep: TreeRotationStep = {
        id: `step-${stepId.value++}`,
        type: "tree-rotation",
        description: `Left-Right case detected: First performing left rotation on left subtree`,
        rotationType: "left-right",
        rootNodeId: node.id,
        affectedNodeIds: [node.left!.id, node.left!.right!.id],
      };
      steps.push(leftRightStep);

      node.left = leftRotate(node.left!, steps, stepId);
      return rightRotate(node, steps, stepId);
    }

    // Right Left Case
    if (balance < -1 && value < (node.right?.value || 0)) {
      const rightLeftStep: TreeRotationStep = {
        id: `step-${stepId.value++}`,
        type: "tree-rotation",
        description: `Right-Left case detected: First performing right rotation on right subtree`,
        rotationType: "right-left",
        rootNodeId: node.id,
        affectedNodeIds: [node.right!.id, node.right!.left!.id],
      };
      steps.push(rightLeftStep);

      node.right = rightRotate(node.right!, steps, stepId);
      return leftRotate(node, steps, stepId);
    }

    // Return unchanged node
    return node;
  }

  // Insert all values
  values.forEach((value) => {
    root = insertNode(root, value);
  });

  // Recalculate positions for final tree
  if (root) {
    calculateNodePositions(root, 400, 50, 200);
  }

  return { steps, finalTree: root };
}

// Create a balanced AVL tree from a sorted array
export function createBalancedTree(values: number[]): TreeNode | null {
  if (values.length === 0) return null;

  const sortedValues = [...values].sort((a, b) => a - b);

  function buildBalanced(
    arr: number[],
    start: number,
    end: number
  ): TreeNode | null {
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);
    const node: TreeNode = {
      id: generateNodeId(),
      value: arr[mid],
      x: 0,
      y: 0,
      height: 1,
    };

    node.left = buildBalanced(arr, start, mid - 1) || undefined;
    node.right = buildBalanced(arr, mid + 1, end) || undefined;

    updateHeight(node);
    return node;
  }

  const root = buildBalanced(sortedValues, 0, sortedValues.length - 1);
  if (root) {
    calculateNodePositions(root, 400, 50, 200);
  }

  return root;
}

export const avlInfo: AlgorithmInfo = {
  name: "AVL Tree",
  category: "tree",
  timeComplexity: {
    best: "O(log n)",
    average: "O(log n)",
    worst: "O(log n)",
  },
  spaceComplexity: "O(n)",
  description:
    "An AVL tree is a self-balancing binary search tree where the heights of the two child subtrees of any node differ by at most one. If they differ by more than one, rebalancing is done through rotations to restore this property.",
  pseudocode: [
    "Insert(value):",
    "  1. Perform normal BST insertion",
    "  2. Update height of current node",
    "  3. Get balance factor",
    "  4. If unbalanced, perform rotations:",
    "     - Left Left Case: Right Rotate",
    "     - Right Right Case: Left Rotate",
    "     - Left Right Case: Left Rotate + Right Rotate",
    "     - Right Left Case: Right Rotate + Left Rotate",
  ],
};

// Default datasets for AVL tree testing
export const avlDefaultDatasets = {
  simple: [10, 20, 30, 40, 50, 25],
  leftHeavy: [50, 40, 30, 20, 10],
  rightHeavy: [10, 20, 30, 40, 50],
  balanced: [25, 15, 35, 10, 20, 30, 40],
  complex: [10, 5, 15, 2, 7, 12, 20, 1, 3, 6, 8, 11, 13, 17, 25],
};
