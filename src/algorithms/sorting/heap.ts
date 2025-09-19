import {
  SortingStep,
  CompareStep,
  SwapStep,
  HighlightStep,
} from "@/types/algorithm";

export function getSteps(array: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...array];
  const n = arr.length;
  let stepId = 0;

  function heapify(arr: number[], n: number, i: number): void {
    let largest = i; // Initialize largest as root
    const left = 2 * i + 1; // Left child
    const right = 2 * i + 2; // Right child

    // Highlight the current node being heapified
    const heapifyStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: `Heapifying subtree rooted at index ${i} (value: ${arr[i]})`,
      indices: [i],
      highlightType: "active",
    };
    steps.push(heapifyStep);

    // If left child exists and is greater than root
    if (left < n) {
      const compareLeftStep: CompareStep = {
        id: `step-${stepId++}`,
        type: "compare",
        description: `Comparing left child ${arr[left]} at index ${left} with current largest ${arr[largest]} at index ${largest}`,
        indices: [left, largest],
        values: [arr[left], arr[largest]],
      };
      steps.push(compareLeftStep);

      if (arr[left] > arr[largest]) {
        largest = left;

        const newLargestStep: HighlightStep = {
          id: `step-${stepId++}`,
          type: "highlight",
          description: `Left child ${arr[largest]} is now the largest`,
          indices: [largest],
          highlightType: "pivot",
        };
        steps.push(newLargestStep);
      }
    }

    // If right child exists and is greater than largest so far
    if (right < n) {
      const compareRightStep: CompareStep = {
        id: `step-${stepId++}`,
        type: "compare",
        description: `Comparing right child ${arr[right]} at index ${right} with current largest ${arr[largest]} at index ${largest}`,
        indices: [right, largest],
        values: [arr[right], arr[largest]],
      };
      steps.push(compareRightStep);

      if (arr[right] > arr[largest]) {
        largest = right;

        const newLargestStep: HighlightStep = {
          id: `step-${stepId++}`,
          type: "highlight",
          description: `Right child ${arr[largest]} is now the largest`,
          indices: [largest],
          highlightType: "pivot",
        };
        steps.push(newLargestStep);
      }
    }

    // If largest is not root, swap and continue heapifying
    if (largest !== i) {
      const swapStep: SwapStep = {
        id: `step-${stepId++}`,
        type: "swap",
        description: `Swapping ${arr[i]} at index ${i} with ${arr[largest]} at index ${largest} to maintain heap property`,
        indices: [i, largest],
        values: [arr[i], arr[largest]],
      };
      steps.push(swapStep);

      [arr[i], arr[largest]] = [arr[largest], arr[i]];

      // Recursively heapify the affected sub-tree
      heapify(arr, n, largest);
    }
  }

  // Build heap (rearrange array)
  const buildHeapStep: HighlightStep = {
    id: `step-${stepId++}`,
    type: "highlight",
    description: "Building max heap from the array",
    indices: Array.from({ length: n }, (_, i) => i),
    highlightType: "partition",
  };
  steps.push(buildHeapStep);

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Heap is built, highlight it
  const heapBuiltStep: HighlightStep = {
    id: `step-${stepId++}`,
    type: "highlight",
    description: "Max heap has been built. Root contains the maximum element.",
    indices: Array.from({ length: n }, (_, i) => i),
    highlightType: "merge",
  };
  steps.push(heapBuiltStep);

  // One by one extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end (it's the maximum)
    const extractStep: SwapStep = {
      id: `step-${stepId++}`,
      type: "swap",
      description: `Extracting maximum element ${arr[0]} from heap root and placing it at index ${i}`,
      indices: [0, i],
      values: [arr[0], arr[i]],
    };
    steps.push(extractStep);

    [arr[0], arr[i]] = [arr[i], arr[0]];

    // Highlight the extracted element as sorted
    const sortedStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: `Element ${arr[i]} is now in its final sorted position`,
      indices: [i],
      highlightType: "sorted",
    };
    steps.push(sortedStep);

    // Call heapify on the reduced heap
    const reduceHeapStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: `Heapifying reduced heap of size ${i}`,
      indices: Array.from({ length: i }, (_, idx) => idx),
      highlightType: "active",
    };
    steps.push(reduceHeapStep);

    heapify(arr, i, 0);
  }

  // Mark the first element as sorted (it's the smallest)
  if (n > 0) {
    const finalStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: "All elements are now sorted",
      indices: [0],
      highlightType: "sorted",
    };
    steps.push(finalStep);
  }

  return steps;
}

export const heapSortInfo = {
  name: "Heap Sort",
  category: "sorting" as const,
  timeComplexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
  },
  spaceComplexity: "O(1)",
  description:
    "Heap Sort works by building a max heap from the input data, then repeatedly extracting the maximum element from the heap and placing it at the end of the sorted portion. It uses the heap data structure to efficiently find and remove the maximum element.",
  pseudocode: [
    "function heapSort(arr):",
    "  buildMaxHeap(arr)",
    "  for i = n-1 down to 1:",
    "    swap arr[0] and arr[i]",
    "    heapify(arr, i, 0)",
    "",
    "function heapify(arr, n, i):",
    "  largest = i",
    "  left = 2*i + 1",
    "  right = 2*i + 2",
    "  if left < n and arr[left] > arr[largest]:",
    "    largest = left",
    "  if right < n and arr[right] > arr[largest]:",
    "    largest = right",
    "  if largest != i:",
    "    swap arr[i] and arr[largest]",
    "    heapify(arr, n, largest)",
  ],
  stable: false,
};
