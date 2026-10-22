import { describe, it, expect } from 'vitest';
import { clamp, roundTo } from './mathHelpers.js';

describe('mathHelpers', () => {
  describe('clamp', () => {
    it('clamps value above max to max', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('clamps value below min to min', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('returns value unchanged when within bounds', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('handles min equal to max', () => {
      expect(clamp(5, 10, 10)).toBe(10);
    });
  });

  describe('roundTo', () => {
    it('rounds to specified decimal places', () => {
      expect(roundTo(3.14159, 2)).toBe(3.14);
    });

    it('rounds up when next digit >= 5', () => {
      expect(roundTo(3.146, 2)).toBe(3.15);
    });

    it('handles zero decimal places', () => {
      expect(roundTo(3.7, 0)).toBe(4);
    });

    it('handles negative numbers', () => {
      expect(roundTo(-3.14159, 2)).toBe(-3.14);
    });

    it('returns integer for negative decimal places', () => {
      expect(roundTo(1234, -2)).toBe(1200);
    });
  });
});