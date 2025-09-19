import {
  TreeStep,
  TreeInsertStep,
  TreeDeleteStep,
  TreeSearchStep,
  TreeTraversalStep,
  TreeNode,
  AlgorithmInfo,
} from "@/types/algorithm";

// Helper function to generate unique node IDs
let nodeIdCounter = 0;
const generateNodeId = () => `node-${nodeIdCounter++}`;

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

  const childY = y + 80; // Vertical spacing between levels
  const childSpacing = horizontalSpacing / 2;

  if (node.left) {
    calculateNodePositions(node.left, x - childSpacing, childY, childSpacing);
  }
  if (node.right) {
    calculateNodePositions(node.right, x + childSpacing, childY, childSpacing);
  }
}

export function getInsertSteps(
  values: number[],
  existingRoot?: TreeNode
): { steps: TreeStep[]; finalTree: TreeNode | null } {
  const steps: TreeStep[] = [];
  let root: TreeNode | null = existingRoot || null;
  let stepId = 0;

  function insertNode(value: number): void {
    const newNodeId = generateNodeId();

    if (!root) {
      // Insert as root
      root = {
        id: newNodeId,
        value,
        x: 400, // Center position
        y: 50,
      };

      const insertStep: TreeInsertStep = {
        id: `step-${stepId++}`,
        type: "tree-insert",
        description: `Inserting ${value} as root node`,
        nodeId: newNodeId,
        value,
        position: "root",
      };
      steps.push(insertStep);
      return;
    }

    // Find the correct position to insert
    let current = root;
    let parent: TreeNode | null = null;
    let position: "left" | "right" = "left";

    while (current) {
      parent = current;

      const searchStep: TreeSearchStep = {
        id: `step-${stepId++}`,
        type: "tree-search",
        description: `Comparing ${value} with ${current.value} at node ${current.id}`,
        nodeId: current.id,
        found: false,
        searchValue: value,
      };
      steps.push(searchStep);

      if (value < current.value) {
        position = "left";
        current = current.left || null;
      } else if (value > current.value) {
        position = "right";
        current = current.right || null;
      } else {
        // Value already exists, don't insert
        const duplicateStep: TreeSearchStep = {
          id: `step-${stepId++}`,
          type: "tree-search",
          description: `Value ${value} already exists in the tree`,
          nodeId: current.id,
          found: true,
          searchValue: value,
        };
        steps.push(duplicateStep);
        return;
      }
    }

    // Insert the new node
    const newNode: TreeNode = {
      id: newNodeId,
      value,
      x: 0, // Will be calculated later
      y: 0,
    };

    if (parent) {
      if (position === "left") {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }

      const insertStep: TreeInsertStep = {
        id: `step-${stepId++}`,
        type: "tree-insert",
        description: `Inserting ${value} as ${position} child of ${parent.value}`,
        nodeId: newNodeId,
        value,
        parentId: parent.id,
        position,
      };
      steps.push(insertStep);
    }

    // Recalculate positions
    calculateNodePositions(root, 400, 50, 200);
  }

  // Insert all values
  values.forEach((value) => insertNode(value));

  return { steps, finalTree: root };
}

export function getDeleteSteps(
  value: number,
  root: TreeNode
): { steps: TreeStep[]; finalTree: TreeNode | null } {
  const steps: TreeStep[] = [];
  let stepId = 0;
  let newRoot = root;

  function findNode(node: TreeNode | null, value: number): TreeNode | null {
    if (!node) return null;

    const searchStep: TreeSearchStep = {
      id: `step-${stepId++}`,
      type: "tree-search",
      description: `Searching for ${value}, currently at node with value ${node.value}`,
      nodeId: node.id,
      found: node.value === value,
      searchValue: value,
    };
    steps.push(searchStep);

    if (value === node.value) return node;
    if (value < node.value) return findNode(node.left || null, value);
    return findNode(node.right || null, value);
  }

  function findMin(node: TreeNode): TreeNode {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  function deleteNode(node: TreeNode | null, value: number): TreeNode | null {
    if (!node) return null;

    if (value < node.value) {
      node.left = deleteNode(node.left || null, value) || undefined;
    } else if (value > node.value) {
      node.right = deleteNode(node.right || null, value) || undefined;
    } else {
      // Node to be deleted found
      if (!node.left && !node.right) {
        // Case 1: Leaf node
        const deleteStep: TreeDeleteStep = {
          id: `step-${stepId++}`,
          type: "tree-delete",
          description: `Deleting leaf node ${value}`,
          nodeId: node.id,
        };
        steps.push(deleteStep);
        return null;
      } else if (!node.left) {
        // Case 2: Node with only right child
        const deleteStep: TreeDeleteStep = {
          id: `step-${stepId++}`,
          type: "tree-delete",
          description: `Deleting node ${value} and replacing with right child`,
          nodeId: node.id,
          replacementNodeId: node.right?.id,
        };
        steps.push(deleteStep);
        return node.right || null;
      } else if (!node.right) {
        // Case 2: Node with only left child
        const deleteStep: TreeDeleteStep = {
          id: `step-${stepId++}`,
          type: "tree-delete",
          description: `Deleting node ${value} and replacing with left child`,
          nodeId: node.id,
          replacementNodeId: node.left?.id,
        };
        steps.push(deleteStep);
        return node.left || null;
      } else {
        // Case 3: Node with two children
        const successor = findMin(node.right);

        const deleteStep: TreeDeleteStep = {
          id: `step-${stepId++}`,
          type: "tree-delete",
          description: `Deleting node ${value} and replacing with inorder successor ${successor.value}`,
          nodeId: node.id,
          replacementNodeId: successor.id,
        };
        steps.push(deleteStep);

        // Replace node's value with successor's value
        node.value = successor.value;

        // Delete the successor
        node.right = deleteNode(node.right, successor.value) || undefined;
      }
    }

    return node;
  }

  // First, find the node to delete
  const nodeToDelete = findNode(newRoot, value);

  if (!nodeToDelete) {
    const notFoundStep: TreeSearchStep = {
      id: `step-${stepId++}`,
      type: "tree-search",
      description: `Value ${value} not found in the tree`,
      nodeId: "",
      found: false,
      searchValue: value,
    };
    steps.push(notFoundStep);
    return { steps, finalTree: newRoot };
  }

  // Delete the node
  newRoot = deleteNode(newRoot, value) || newRoot;

  // Recalculate positions
  if (newRoot) {
    calculateNodePositions(newRoot, 400, 50, 200);
  }

  return { steps, finalTree: newRoot };
}

export function getSearchSteps(value: number, root: TreeNode): TreeStep[] {
  const steps: TreeStep[] = [];
  let stepId = 0;

  function search(node: TreeNode | null, value: number): boolean {
    if (!node) {
      const notFoundStep: TreeSearchStep = {
        id: `step-${stepId++}`,
        type: "tree-search",
        description: `Reached null node - ${value} not found in tree`,
        nodeId: "",
        found: false,
        searchValue: value,
      };
      steps.push(notFoundStep);
      return false;
    }

    const searchStep: TreeSearchStep = {
      id: `step-${stepId++}`,
      type: "tree-search",
      description: `Searching for ${value}, currently at node with value ${node.value}`,
      nodeId: node.id,
      found: node.value === value,
      searchValue: value,
    };
    steps.push(searchStep);

    if (value === node.value) {
      const foundStep: TreeSearchStep = {
        id: `step-${stepId++}`,
        type: "tree-search",
        description: `Found ${value} at node ${node.id}!`,
        nodeId: node.id,
        found: true,
        searchValue: value,
      };
      steps.push(foundStep);
      return true;
    }

    if (value < node.value) {
      return search(node.left || null, value);
    } else {
      return search(node.right || null, value);
    }
  }

  search(root, value);
  return steps;
}

export function getTraversalSteps(
  root: TreeNode,
  traversalType: "inorder" | "preorder" | "postorder"
): TreeStep[] {
  const steps: TreeStep[] = [];
  let stepId = 0;
  let visitOrder = 0;

  function inorderTraversal(node: TreeNode | null): void {
    if (!node) return;

    inorderTraversal(node.left || null);

    const visitStep: TreeTraversalStep = {
      id: `step-${stepId++}`,
      type: "tree-traversal",
      description: `Visiting node ${node.value} (inorder: left, root, right)`,
      nodeId: node.id,
      traversalType: "inorder",
      visitOrder: visitOrder++,
    };
    steps.push(visitStep);

    inorderTraversal(node.right || null);
  }

  function preorderTraversal(node: TreeNode | null): void {
    if (!node) return;

    const visitStep: TreeTraversalStep = {
      id: `step-${stepId++}`,
      type: "tree-traversal",
      description: `Visiting node ${node.value} (preorder: root, left, right)`,
      nodeId: node.id,
      traversalType: "preorder",
      visitOrder: visitOrder++,
    };
    steps.push(visitStep);

    preorderTraversal(node.left || null);
    preorderTraversal(node.right || null);
  }

  function postorderTraversal(node: TreeNode | null): void {
    if (!node) return;

    postorderTraversal(node.left || null);
    postorderTraversal(node.right || null);

    const visitStep: TreeTraversalStep = {
      id: `step-${stepId++}`,
      type: "tree-traversal",
      description: `Visiting node ${node.value} (postorder: left, right, root)`,
      nodeId: node.id,
      traversalType: "postorder",
      visitOrder: visitOrder++,
    };
    steps.push(visitStep);
  }

  switch (traversalType) {
    case "inorder":
      inorderTraversal(root);
      break;
    case "preorder":
      preorderTraversal(root);
      break;
    case "postorder":
      postorderTraversal(root);
      break;
  }

  return steps;
}

export const bstInfo: AlgorithmInfo = {
  name: "Binary Search Tree",
  category: "tree",
  timeComplexity: {
    best: "O(log n)",
    average: "O(log n)",
    worst: "O(n)",
  },
  spaceComplexity: "O(n)",
  description:
    "A Binary Search Tree (BST) is a hierarchical data structure where each node has at most two children. For every node, all values in the left subtree are smaller, and all values in the right subtree are larger than the node's value.",
  pseudocode: [
    "Insert(value):",
    "  if root is null:",
    "    root = new Node(value)",
    "  else:",
    "    insertRecursive(root, value)",
    "",
    "Search(value):",
    "  return searchRecursive(root, value)",
    "",
    "Delete(value):",
    "  root = deleteRecursive(root, value)",
  ],
};
