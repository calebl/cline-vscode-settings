import { describe, it, expect } from 'vitest';
import { calculateApiCost } from './cost';
import { ModelInfo } from "../shared/api";

describe('Cost Calculation', () => {
    const mockModelInfo: ModelInfo = {
        inputPrice: 1,
        outputPrice: 2,
        cacheWritesPrice: 0.5,
        cacheReadsPrice: 0.25,
        supportsPromptCache: true,
    };

    it('calculates cost without cache', () => {
        const cost = calculateApiCost(mockModelInfo, 1000, 500);
        expect(cost).toBe(0.002); // (1000 * 1 + 500 * 2) / 1_000_000
    });

    it('calculates cost with cache writes', () => {
        const cost = calculateApiCost(mockModelInfo, 1000, 500, 2000);
        expect(cost).toBe(0.003); // (1000 * 1 + 500 * 2 + 2000 * 0.5) / 1_000_000
    });

    it('calculates cost with cache reads', () => {
        const cost = calculateApiCost(mockModelInfo, 1000, 500, undefined, 2000);
        expect(cost).toBe(0.0025); // (1000 * 1 + 500 * 2 + 2000 * 0.25) / 1_000_000
    });

    it('calculates cost with both cache writes and reads', () => {
        const cost = calculateApiCost(mockModelInfo, 1000, 500, 2000, 2000);
        expect(cost).toBe(0.0035); // (1000 * 1 + 500 * 2 + 2000 * 0.5 + 2000 * 0.25) / 1_000_000
    });

    it('handles zero prices', () => {
        const zeroModelInfo: ModelInfo = {
            inputPrice: 0,
            outputPrice: 0,
            cacheWritesPrice: 0,
            cacheReadsPrice: 0,
            supportsPromptCache: false,
        };
        const cost = calculateApiCost(zeroModelInfo, 1000, 500, 2000, 2000);
        expect(cost).toBe(0);
    });

    it('handles undefined cache prices', () => {
        const partialModelInfo: ModelInfo = {
            inputPrice: 1,
            outputPrice: 2,
            supportsPromptCache: false,
        };
        const cost = calculateApiCost(partialModelInfo, 1000, 500, 2000, 2000);
        expect(cost).toBe(0.002); // (1000 * 1 + 500 * 2) / 1_000_000
    });
});
