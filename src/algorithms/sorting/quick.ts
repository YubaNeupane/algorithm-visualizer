import {
  SortingStep,
  CompareStep,
  SwapStep,
  HighlightStep,
} from "@/types/algorithm";

export function getSteps(array: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...array];
  let stepId = 0;

  function quickSort(arr: number[], low: number, high: number): void {
    if (low < high) {
      // Highlight the current subarray being sorted
      const subarrayStep: HighlightStep = {
        id: `step-${stepId++}`,
        type: "highlight",
        description: `Sorting subarray from index ${low} to ${high}`,
        indices: Array.from({ length: high - low + 1 }, (_, i) => low + i),
        highlightType: "partition",
      };
      steps.push(subarrayStep);

      // Partition the array and get the pivot index
      const pivotIndex = partition(arr, low, high);

      // Recursively sort elements before and after partition
      quickSort(arr, low, pivotIndex - 1);
      quickSort(arr, pivotIndex + 1, high);
    }
  }

  function partition(arr: number[], low: number, high: number): number {
    // Choose the rightmost element as pivot
    const pivot = arr[high];

    // Highlight the pivot
    const pivotStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: `Selected pivot: ${pivot} at index ${high}`,
      indices: [high],
      highlightType: "pivot",
    };
    steps.push(pivotStep);

    let i = low - 1; // Index of smaller element

    for (let j = low; j < high; j++) {
      // Compare current element with pivot
      const compareStep: CompareStep = {
        id: `step-${stepId++}`,
        type: "compare",
        description: `Comparing ${arr[j]} at index ${j} with pivot ${pivot}`,
        indices: [j, high],
        values: [arr[j], pivot],
      };
      steps.push(compareStep);

      // If current element is smaller than or equal to pivot
      if (arr[j] <= pivot) {
        i++; // Increment index of smaller element

        if (i !== j) {
          // Swap elements
          const swapStep: SwapStep = {
            id: `step-${stepId++}`,
            type: "swap",
            description: `Swapping ${arr[i]} at index ${i} with ${arr[j]} at index ${j} (both ≤ pivot)`,
            indices: [i, j],
            values: [arr[i], arr[j]],
          };
          steps.push(swapStep);

          [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        // Highlight the element that's now in the correct partition
        const partitionStep: HighlightStep = {
          id: `step-${stepId++}`,
          type: "highlight",
          description: `Element ${arr[i]} is now in the left partition (≤ pivot)`,
          indices: [i],
          highlightType: "active",
        };
        steps.push(partitionStep);
      }
    }

    // Place pivot in its correct position
    if (i + 1 !== high) {
      const pivotSwapStep: SwapStep = {
        id: `step-${stepId++}`,
        type: "swap",
        description: `Placing pivot ${pivot} in its correct position by swapping with element at index ${
          i + 1
        }`,
        indices: [i + 1, high],
        values: [arr[i + 1], arr[high]],
      };
      steps.push(pivotSwapStep);

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    }

    // Highlight the pivot in its final position
    const pivotFinalStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: `Pivot ${pivot} is now in its final sorted position at index ${
        i + 1
      }`,
      indices: [i + 1],
      highlightType: "sorted",
    };
    steps.push(pivotFinalStep);

    return i + 1;
  }

  if (arr.length > 1) {
    quickSort(arr, 0, arr.length - 1);

    // Final step: highlight all elements as sorted
    const finalStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: "All elements are now sorted",
      indices: Array.from({ length: arr.length }, (_, i) => i),
      highlightType: "sorted",
    };
    steps.push(finalStep);
  }

  return steps;
}

export const quickSortInfo = {
  name: "Quick Sort",
  category: "sorting" as const,
  timeComplexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
  },
  spaceComplexity: "O(log n)",
  description:
    "Quick Sort is a divide-and-conquer algorithm that picks a 'pivot' element and partitions the array around it, placing smaller elements before the pivot and larger elements after it. It then recursively sorts the sub-arrays.",
  pseudocode: [
    "function quickSort(arr, low, high):",
    "  if low < high:",
    "    pivotIndex = partition(arr, low, high)",
    "    quickSort(arr, low, pivotIndex - 1)",
    "    quickSort(arr, pivotIndex + 1, high)",
    "",
    "function partition(arr, low, high):",
    "  pivot = arr[high]",
    "  i = low - 1",
    "  for j = low to high - 1:",
    "    if arr[j] <= pivot:",
    "      i++",
    "      swap arr[i] and arr[j]",
    "  swap arr[i + 1] and arr[high]",
    "  return i + 1",
  ],
  stable: false,
};
