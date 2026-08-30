import { describe, expect, it } from 'vitest';
import { MangaStatus, SourceType } from '../enum';
import { Manga } from '../types/Manga';
import { hasNewChapters } from './hasNewChapters';

const createMirrors = (lastChapter: string): Manga['mirrors'] => ({
    [SourceType.ReadManga]: {
        url: 'https://readmanga.live/test',
        status: MangaStatus.Success,
        lastChapter,
    },
});

describe('hasNewChapters', () => {
    it('detects when a new chapter appears', () => {
        expect(hasNewChapters(createMirrors('10'), createMirrors('11'))).toBe(true);
    });

    it('returns false when chapter count is unchanged', () => {
        expect(hasNewChapters(createMirrors('10'), createMirrors('10'))).toBe(false);
    });

    it('compares chapters numerically', () => {
        expect(hasNewChapters(createMirrors('9'), createMirrors('10'))).toBe(true);
        expect(hasNewChapters(createMirrors('10'), createMirrors('9'))).toBe(false);
    });
});
