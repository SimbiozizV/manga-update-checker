import { beforeEach, describe, expect, it, vi } from 'vitest';
import getDataByUrl from '../api/getDataByUrl';
import { MangaStatus, SourceType } from '../enum';
import { Manga } from '../types/Manga';
import { updateMangaList, updateSingleManga } from './mangaUpdateService';

vi.mock('../api/getDataByUrl', () => ({
    default: vi.fn(),
}));

const mockedGetDataByUrl = vi.mocked(getDataByUrl);

const createManga = (lastChapter: string): Manga => ({
    id: '1',
    title: 'Test Manga',
    image: 'image.png',
    prevChapter: lastChapter,
    mirrors: {
        [SourceType.ReadManga]: {
            url: 'https://readmanga.live/test',
            status: MangaStatus.Success,
            lastChapter,
        },
    },
});

describe('mangaUpdateService', () => {
    beforeEach(() => {
        mockedGetDataByUrl.mockReset();
    });

    it('updates mirror chapter from parser response', async () => {
        mockedGetDataByUrl.mockResolvedValue({
            url: 'https://readmanga.live/test',
            source: SourceType.ReadManga,
            data: {
                title: 'Test Manga',
                image: 'image.png',
                lastChapter: '12',
            },
        });

        const updated = await updateSingleManga(createManga('11'));

        expect(updated.mirrors[SourceType.ReadManga]?.lastChapter).toBe('12');
        expect(updated.image).toBe('image.png');
    });

    it('refreshes cover image from parser response', async () => {
        mockedGetDataByUrl.mockResolvedValue({
            url: 'https://readmanga.live/test',
            source: SourceType.ReadManga,
            data: {
                title: 'Test Manga',
                image: 'https://cover.cdnlibs.org/new.jpg',
                lastChapter: '12',
            },
        });

        const updated = await updateSingleManga({ ...createManga('11'), image: '' });

        expect(updated.image).toBe('https://cover.cdnlibs.org/new.jpg');
        expect(updated.mirrors[SourceType.ReadManga]?.lastChapter).toBe('12');
    });

    it('returns newUpdates when chapter count increases', async () => {
        mockedGetDataByUrl.mockResolvedValue({
            url: 'https://readmanga.live/test',
            source: SourceType.ReadManga,
            data: {
                title: 'Test Manga',
                image: 'image.png',
                lastChapter: '12',
            },
        });

        const result = await updateMangaList([createManga('11')]);

        expect(result.newUpdates).toHaveLength(1);
        expect(result.updated[0].mirrors[SourceType.ReadManga]?.lastChapter).toBe('12');
    });
});
