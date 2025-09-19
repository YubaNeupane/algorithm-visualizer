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

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // Highlight the current position we're trying to fill
    const startStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: `Finding minimum element for position ${i}`,
      indices: [i],
      highlightType: "active",
    };
    steps.push(startStep);

    // Find the minimum element in the remaining unsorted array
    for (let j = i + 1; j < n; j++) {
      const compareStep: CompareStep = {
        id: `step-${stepId++}`,
        type: "compare",
        description: `Comparing ${arr[j]} at index ${j} with current minimum ${arr[minIndex]} at index ${minIndex}`,
        indices: [j, minIndex],
        values: [arr[j], arr[minIndex]],
      };
      steps.push(compareStep);

      if (arr[j] < arr[minIndex]) {
        minIndex = j;

        // Highlight the new minimum
        const newMinStep: HighlightStep = {
          id: `step-${stepId++}`,
          type: "highlight",
          description: `New minimum found: ${arr[minIndex]} at index ${minIndex}`,
          indices: [minIndex],
          highlightType: "pivot",
        };
        steps.push(newMinStep);
      }
    }

    // Swap the found minimum element with the first element
    if (minIndex !== i) {
      const swapStep: SwapStep = {
        id: `step-${stepId++}`,
        type: "swap",
        description: `Swapping minimum element ${arr[minIndex]} at index ${minIndex} with element ${arr[i]} at index ${i}`,
        indices: [i, minIndex],
        values: [arr[i], arr[minIndex]],
      };
      steps.push(swapStep);

      // Perform the actual swap
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }

    // Highlight the sorted element
    const sortedStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: `Element at index ${i} is now in its final sorted position`,
      indices: [i],
      highlightType: "sorted",
    };
    steps.push(sortedStep);
  }

  // Highlight the last element as sorted
  if (n > 1) {
    const finalStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: "All elements are now sorted",
      indices: [n - 1],
      highlightType: "sorted",
    };
    steps.push(finalStep);
  }

  return steps;
}

export const selectionSortInfo = {
  name: "Selection Sort",
  category: "sorting" as const,
  timeComplexity: {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
  },
  spaceComplexity: "O(1)",
  description:
    "Selection Sort divides the input list into two parts: a sorted portion at the left end and an unsorted portion at the right end. It repeatedly selects the smallest element from the unsorted portion and moves it to the end of the sorted portion.",
  pseudocode: [
    "for i = 0 to n-2:",
    "  minIndex = i",
    "  for j = i+1 to n-1:",
    "    if arr[j] < arr[minIndex]:",
    "      minIndex = j",
    "  swap arr[i] and arr[minIndex]",
  ],
  stable: false,
};
