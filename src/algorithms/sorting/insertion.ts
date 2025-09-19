import {
  SortingStep,
  CompareStep,
  OverwriteStep,
  HighlightStep,
} from "@/types/algorithm";

export function getSteps(array: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...array];
  const n = arr.length;
  let stepId = 0;

  // First element is considered sorted
  if (n > 0) {
    const firstSortedStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: "First element is considered sorted",
      indices: [0],
      highlightType: "sorted",
    };
    steps.push(firstSortedStep);
  }

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // Highlight the element we're trying to insert
    const insertStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: `Inserting element ${key} from index ${i} into sorted portion`,
      indices: [i],
      highlightType: "active",
    };
    steps.push(insertStep);

    // Move elements that are greater than key one position ahead
    while (j >= 0) {
      const compareStep: CompareStep = {
        id: `step-${stepId++}`,
        type: "compare",
        description: `Comparing ${key} with ${arr[j]} at index ${j}`,
        indices: [j, i],
        values: [arr[j], key],
      };
      steps.push(compareStep);

      if (arr[j] <= key) {
        break;
      }

      // Move element one position to the right
      const moveStep: OverwriteStep = {
        id: `step-${stepId++}`,
        type: "overwrite",
        description: `Moving ${arr[j]} from index ${j} to index ${j + 1}`,
        index: j + 1,
        oldValue: arr[j + 1],
        newValue: arr[j],
      };
      steps.push(moveStep);

      arr[j + 1] = arr[j];
      j--;
    }

    // Insert the key at its correct position
    if (j + 1 !== i) {
      const insertFinalStep: OverwriteStep = {
        id: `step-${stepId++}`,
        type: "overwrite",
        description: `Inserting ${key} at its correct position (index ${
          j + 1
        })`,
        index: j + 1,
        oldValue: arr[j + 1],
        newValue: key,
      };
      steps.push(insertFinalStep);
    }

    arr[j + 1] = key;

    // Highlight the newly sorted portion
    const sortedPortionStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: `Elements from index 0 to ${i} are now sorted`,
      indices: Array.from({ length: i + 1 }, (_, idx) => idx),
      highlightType: "sorted",
    };
    steps.push(sortedPortionStep);
  }

  return steps;
}

export const insertionSortInfo = {
  name: "Insertion Sort",
  category: "sorting" as const,
  timeComplexity: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
  },
  spaceComplexity: "O(1)",
  description:
    "Insertion Sort builds the final sorted array one item at a time. It works by taking elements from the unsorted portion and inserting them into their correct position in the sorted portion.",
  pseudocode: [
    "for i = 1 to n-1:",
    "  key = arr[i]",
    "  j = i - 1",
    "  while j >= 0 and arr[j] > key:",
    "    arr[j+1] = arr[j]",
    "    j = j - 1",
    "  arr[j+1] = key",
  ],
  stable: true,
};
