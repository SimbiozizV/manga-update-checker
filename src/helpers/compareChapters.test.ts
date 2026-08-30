import { describe, expect, it } from 'vitest';
import { compareChapters, parseChapter } from './compareChapters';

describe('compareChapters', () => {
    it('compares numeric chapter strings correctly', () => {
        expect(compareChapters('9', '10')).toBeLessThan(0);
        expect(compareChapters('10', '9')).toBeGreaterThan(0);
        expect(compareChapters('10', '10')).toBe(0);
    });

    it('supports decimal chapters', () => {
        expect(compareChapters('10.5', '10')).toBeGreaterThan(0);
        expect(compareChapters('10.1', '10.5')).toBeLessThan(0);
    });

    it('falls back to zero for invalid values', () => {
        expect(parseChapter('extra')).toBe(0);
        expect(compareChapters('extra', '1')).toBeLessThan(0);
    });
});
