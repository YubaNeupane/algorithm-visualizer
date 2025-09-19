import { getSteps as bubbleSteps, bubbleSortInfo } from "./bubble";
import { getSteps as selectionSteps, selectionSortInfo } from "./selection";
import { getSteps as insertionSteps, insertionSortInfo } from "./insertion";
import { getSteps as mergeSteps, mergeSortInfo } from "./merge";
import { getSteps as quickSteps, quickSortInfo } from "./quick";
import { getSteps as heapSteps, heapSortInfo } from "./heap";
import { SortingStep, AlgorithmInfo } from "@/types/algorithm";

export interface SortingAlgorithm {
  name: string;
  getSteps: (array: number[]) => SortingStep[];
  info: AlgorithmInfo;
}

export const sortingAlgorithms: Record<string, SortingAlgorithm> = {
  bubble: {
    name: "Bubble Sort",
    getSteps: bubbleSteps,
    info: bubbleSortInfo,
  },
  selection: {
    name: "Selection Sort",
    getSteps: selectionSteps,
    info: selectionSortInfo,
  },
  insertion: {
    name: "Insertion Sort",
    getSteps: insertionSteps,
    info: insertionSortInfo,
  },
  merge: {
    name: "Merge Sort",
    getSteps: mergeSteps,
    info: mergeSortInfo,
  },
  quick: {
    name: "Quick Sort",
    getSteps: quickSteps,
    info: quickSortInfo,
  },
  heap: {
    name: "Heap Sort",
    getSteps: heapSteps,
    info: heapSortInfo,
  },
};

export const sortingAlgorithmsList = Object.keys(sortingAlgorithms).map(
  (key) => ({
    id: key,
    ...sortingAlgorithms[key],
  })
);

// Default datasets for quick testing
export const defaultDatasets = {
  small: [64, 34, 25, 12, 22, 11, 90],
  medium: [64, 34, 25, 12, 22, 11, 90, 5, 77, 30, 45, 88],
  large: Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 1),
  reversed: [
    20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
  ],
  nearlySorted: [1, 2, 3, 4, 5, 7, 6, 8, 9, 10, 11, 12],
  duplicates: [5, 2, 8, 2, 9, 1, 5, 5, 2, 8],
};
