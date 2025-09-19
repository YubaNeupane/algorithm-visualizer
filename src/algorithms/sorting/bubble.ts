import {
  SortingStep,
  CompareStep,
  SwapStep,
  HighlightStep,
} from "@/types/algorithm";

export function getSteps(array: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...array]; // Create a copy to avoid mutating the original
  const n = arr.length;
  let stepId = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare step
      const compareStep: CompareStep = {
        id: `step-${stepId++}`,
        type: "compare",
        description: `Comparing elements at indices ${j} and ${j + 1}: ${
          arr[j]
        } vs ${arr[j + 1]}`,
        indices: [j, j + 1],
        values: [arr[j], arr[j + 1]],
      };
      steps.push(compareStep);

      // If elements are out of order, swap them
      if (arr[j] > arr[j + 1]) {
        const swapStep: SwapStep = {
          id: `step-${stepId++}`,
          type: "swap",
          description: `Swapping ${arr[j]} and ${
            arr[j + 1]
          } at indices ${j} and ${j + 1}`,
          indices: [j, j + 1],
          values: [arr[j], arr[j + 1]],
        };
        steps.push(swapStep);

        // Perform the actual swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }

    // Highlight the sorted element
    const highlightStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: `Element at index ${
        n - i - 1
      } is now in its final sorted position`,
      indices: [n - i - 1],
      highlightType: "sorted",
    };
    steps.push(highlightStep);
  }

  // Highlight the first element as sorted (it's automatically sorted when all others are)
  if (n > 1) {
    const finalHighlightStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: "All elements are now sorted",
      indices: [0],
      highlightType: "sorted",
    };
    steps.push(finalHighlightStep);
  }

  return steps;
}

export const bubbleSortInfo = {
  name: "Bubble Sort",
  category: "sorting" as const,
  timeComplexity: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
  },
  spaceComplexity: "O(1)",
  description:
    "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
  pseudocode: [
    "for i = 0 to n-2:",
    "  for j = 0 to n-2-i:",
    "    if arr[j] > arr[j+1]:",
    "      swap arr[j] and arr[j+1]",
  ],
  stable: true,
};
