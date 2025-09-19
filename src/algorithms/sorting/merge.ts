import {
  SortingStep,
  CompareStep,
  OverwriteStep,
  HighlightStep,
  MergeStep,
} from "@/types/algorithm";

export function getSteps(array: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...array];
  let stepId = 0;

  function mergeSort(arr: number[], left: number, right: number): void {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    // Highlight the current subarray being divided
    const divideStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: `Dividing array from index ${left} to ${right} at midpoint ${mid}`,
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      highlightType: "partition",
    };
    steps.push(divideStep);

    // Recursively sort left and right halves
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);

    // Merge the sorted halves
    merge(arr, left, mid, right);
  }

  function merge(
    arr: number[],
    left: number,
    mid: number,
    right: number
  ): void {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    // Highlight the subarrays being merged
    const mergeStartStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: `Merging left subarray [${leftArr.join(
        ", "
      )}] with right subarray [${rightArr.join(", ")}]`,
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      highlightType: "merge",
    };
    steps.push(mergeStartStep);

    let i = 0,
      j = 0,
      k = left;

    // Merge the two arrays
    while (i < leftArr.length && j < rightArr.length) {
      const compareStep: CompareStep = {
        id: `step-${stepId++}`,
        type: "compare",
        description: `Comparing ${leftArr[i]} from left array with ${rightArr[j]} from right array`,
        indices: [left + i, mid + 1 + j],
        values: [leftArr[i], rightArr[j]],
      };
      steps.push(compareStep);

      if (leftArr[i] <= rightArr[j]) {
        const mergeStep: MergeStep = {
          id: `step-${stepId++}`,
          type: "merge",
          description: `Placing ${leftArr[i]} at position ${k}`,
          sourceIndices: [left + i],
          targetIndex: k,
          values: [leftArr[i]],
        };
        steps.push(mergeStep);

        arr[k] = leftArr[i];
        i++;
      } else {
        const mergeStep: MergeStep = {
          id: `step-${stepId++}`,
          type: "merge",
          description: `Placing ${rightArr[j]} at position ${k}`,
          sourceIndices: [mid + 1 + j],
          targetIndex: k,
          values: [rightArr[j]],
        };
        steps.push(mergeStep);

        arr[k] = rightArr[j];
        j++;
      }
      k++;
    }

    // Copy remaining elements from left array
    while (i < leftArr.length) {
      const mergeStep: MergeStep = {
        id: `step-${stepId++}`,
        type: "merge",
        description: `Placing remaining element ${leftArr[i]} at position ${k}`,
        sourceIndices: [left + i],
        targetIndex: k,
        values: [leftArr[i]],
      };
      steps.push(mergeStep);

      arr[k] = leftArr[i];
      i++;
      k++;
    }

    // Copy remaining elements from right array
    while (j < rightArr.length) {
      const mergeStep: MergeStep = {
        id: `step-${stepId++}`,
        type: "merge",
        description: `Placing remaining element ${rightArr[j]} at position ${k}`,
        sourceIndices: [mid + 1 + j],
        targetIndex: k,
        values: [rightArr[j]],
      };
      steps.push(mergeStep);

      arr[k] = rightArr[j];
      j++;
      k++;
    }

    // Highlight the merged subarray
    const mergeCompleteStep: HighlightStep = {
      id: `step-${stepId++}`,
      type: "highlight",
      description: `Subarray from ${left} to ${right} is now merged and sorted`,
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      highlightType: "sorted",
    };
    steps.push(mergeCompleteStep);
  }

  if (arr.length > 1) {
    mergeSort(arr, 0, arr.length - 1);
  }

  return steps;
}

export const mergeSortInfo = {
  name: "Merge Sort",
  category: "sorting" as const,
  timeComplexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
  },
  spaceComplexity: "O(n)",
  description:
    "Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the two sorted halves. It guarantees O(n log n) time complexity in all cases.",
  pseudocode: [
    "function mergeSort(arr, left, right):",
    "  if left < right:",
    "    mid = (left + right) / 2",
    "    mergeSort(arr, left, mid)",
    "    mergeSort(arr, mid+1, right)",
    "    merge(arr, left, mid, right)",
  ],
  stable: true,
};
