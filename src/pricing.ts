export interface ModelPricing {
  inputPerMillion: number;
  outputPerMillion: number;
  cachePerMillion: number;
  // Tier 2: > 200k tokens
  inputPerMillionOverThreshold?: number;
  outputPerMillionOverThreshold?: number;
  cachePerMillionOverThreshold?: number;
}

/**
 * Gemini Pricing as of Dec 2025
 * Includes tiered pricing for prompts > 200k tokens
 */
export const GEMINI_PRICING: Record<string, ModelPricing> = {
  // Gemini 3
  "gemini-3-pro": { 
    inputPerMillion: 2.00, 
    outputPerMillion: 12.00, 
    cachePerMillion: 0.20,
    inputPerMillionOverThreshold: 4.00,
    outputPerMillionOverThreshold: 18.00,
    cachePerMillionOverThreshold: 0.40
  },
  "gemini-3-pro-preview": { 
    inputPerMillion: 2.00, 
    outputPerMillion: 12.00, 
    cachePerMillion: 0.20,
    inputPerMillionOverThreshold: 4.00,
    outputPerMillionOverThreshold: 18.00,
    cachePerMillionOverThreshold: 0.40
  },
  "gemini-3-flash": { inputPerMillion: 0.50, outputPerMillion: 3.00, cachePerMillion: 0.05 },
  "gemini-3-flash-preview": { inputPerMillion: 0.50, outputPerMillion: 3.00, cachePerMillion: 0.05 },
  
  // Gemini 2.5
  "gemini-2.5-pro": { 
    inputPerMillion: 1.25, 
    outputPerMillion: 10.00, 
    cachePerMillion: 0.125,
    inputPerMillionOverThreshold: 2.50,
    outputPerMillionOverThreshold: 15.00,
    cachePerMillionOverThreshold: 0.25
  },
  "gemini-2.5-flash": { inputPerMillion: 0.30, outputPerMillion: 2.50, cachePerMillion: 0.03 },
  "gemini-2.5-flash-lite": { inputPerMillion: 0.10, outputPerMillion: 0.40, cachePerMillion: 0.01 },
};

/**
 * Calculates the estimated cost for a given model and token counts.
 * Returns 0 if model is not recognized.
 */
export function calculateCost(model: string, inputTokens: number, outputTokens: number, cachedTokens: number = 0): number {
  // Sort keys by length descending to ensure the longest (most specific) prefix matches first
  const sortedModelKeys = Object.keys(GEMINI_PRICING).sort((a, b) => b.length - a.length);
  const baseModel = sortedModelKeys.find(key => model.startsWith(key));
  
  if (!baseModel) return 0;

  const pricing = GEMINI_PRICING[baseModel];
  
  // Tiered pricing applies to the entire request if prompt (total input) > 200k
  const threshold = 200_000;
  const isOverThreshold = inputTokens > threshold;

  const inputRate = (isOverThreshold && pricing.inputPerMillionOverThreshold) 
    ? pricing.inputPerMillionOverThreshold 
    : pricing.inputPerMillion;
    
  const outputRate = (isOverThreshold && pricing.outputPerMillionOverThreshold) 
    ? pricing.outputPerMillionOverThreshold 
    : pricing.outputPerMillion;
    
  const cacheRate = (isOverThreshold && pricing.cachePerMillionOverThreshold) 
    ? pricing.cachePerMillionOverThreshold 
    : pricing.cachePerMillion;

  // inputTokens from logs includes cachedTokens. 
  // We subtract them to charge the inputRate only for fresh tokens.
  const freshInputTokens = Math.max(0, inputTokens - cachedTokens);
  
  const inputCost = (freshInputTokens / 1_000_000) * inputRate;
  const outputCost = (outputTokens / 1_000_000) * outputRate;
  const cacheCost = (cachedTokens / 1_000_000) * cacheRate;

  return inputCost + outputCost + cacheCost;
}