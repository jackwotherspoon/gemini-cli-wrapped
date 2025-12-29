import { expect, test, describe } from "bun:test";
import { calculateCost } from "./pricing";

describe("calculateCost", () => {
  test("matches most specific model (flash-lite vs flash)", () => {
    // gemini-2.5-flash: input 0.30, output 2.50
    // gemini-2.5-flash-lite: input 0.10, output 0.40
    
    // 1M input tokens, 1M output tokens
    const liteCost = calculateCost("gemini-2.5-flash-lite", 1_000_000, 1_000_000);
    const flashCost = calculateCost("gemini-2.5-flash", 1_000_000, 1_000_000);
    
    expect(liteCost).toBe(0.10 + 0.40); // 0.5
    expect(flashCost).toBe(0.30 + 2.50); // 2.8
  });

  test("applies tiered pricing for Pro models over 200k tokens", () => {
    // gemini-2.5-pro: 
    // <= 200k: input 1.25, output 10.00
    // > 200k:  input 2.50, output 15.00
    
    const standardCost = calculateCost("gemini-2.5-pro", 100_000, 100_000);
    // (100k/1M * 1.25) + (100k/1M * 10.00) = 0.125 + 1.0 = 1.125
    expect(standardCost).toBeCloseTo(1.125);

    const tieredCost = calculateCost("gemini-2.5-pro", 300_000, 100_000);
    // (300k/1M * 2.50) + (100k/1M * 15.00) = 0.75 + 1.5 = 2.25
    expect(tieredCost).toBeCloseTo(2.25);
  });

  test("handles cached tokens correctly", () => {
    // gemini-3-pro:
    // input: 2.00, output: 12.00, cache: 0.20
    
    // 100k input (including 50k cached), 0 output
    const cost = calculateCost("gemini-3-pro", 100_000, 0, 50_000);
    
    // fresh input: 50k * 2.00/1M = 0.10
    // cached input: 50k * 0.20/1M = 0.01
    // total: 0.11
    expect(cost).toBeCloseTo(0.11);
  });

  test("returns 0 for unknown models", () => {
    expect(calculateCost("unknown-model", 1000, 1000)).toBe(0);
  });
});
