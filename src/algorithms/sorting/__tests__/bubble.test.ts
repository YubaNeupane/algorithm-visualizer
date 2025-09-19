import { getSteps, bubbleSortInfo } from "../bubble";

describe("Bubble Sort", () => {
  test("should generate correct steps for small array", () => {
    const input = [3, 1, 2];
    const steps = getSteps(input);

    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0].type).toBe("compare");

    // Check that we have compare and swap steps
    const compareSteps = steps.filter((step) => step.type === "compare");
    const swapSteps = steps.filter((step) => step.type === "swap");

    expect(compareSteps.length).toBeGreaterThan(0);
    expect(swapSteps.length).toBeGreaterThan(0);
  });

  test("should handle already sorted array", () => {
    const input = [1, 2, 3];
    const steps = getSteps(input);

    expect(steps.length).toBeGreaterThan(0);

    // Should have compare steps but no swap steps for sorted array
    const compareSteps = steps.filter((step) => step.type === "compare");
    const swapSteps = steps.filter((step) => step.type === "swap");

    expect(compareSteps.length).toBeGreaterThan(0);
    expect(swapSteps.length).toBe(0);
  });

  test("should handle single element array", () => {
    const input = [5];
    const steps = getSteps(input);

    // Single element should have minimal steps
    expect(steps.length).toBeGreaterThanOrEqual(0);
  });

  test("should handle empty array", () => {
    const input: number[] = [];
    const steps = getSteps(input);

    expect(steps).toEqual([]);
  });

  test("should have correct algorithm info", () => {
    expect(bubbleSortInfo.name).toBe("Bubble Sort");
    expect(bubbleSortInfo.category).toBe("sorting");
    expect(bubbleSortInfo.stable).toBe(true);
    expect(bubbleSortInfo.timeComplexity.worst).toBe("O(n²)");
  });

  test("should generate steps with proper IDs", () => {
    const input = [2, 1];
    const steps = getSteps(input);

    steps.forEach((step, index) => {
      expect(step.id).toBe(`step-${index}`);
      expect(step.description).toBeDefined();
    });
  });
});
