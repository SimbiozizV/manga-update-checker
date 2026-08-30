import { beforeEach, describe, expect, it, vi } from 'vitest';
import httpClient from '../api/httpClient';
import { mangaLibParser } from './mangaLibParser';

vi.mock('../api/httpClient', () => ({
    default: vi.fn(),
}));

const mockedHttpClient = vi.mocked(httpClient);

const mangaResponse = {
    data: {
        rus_name: 'Маг-параноик',
        cover: { thumbnail: 'https://cover.cdnlibs.org/uploads/cover/test/cover/thumb.jpg' },
        items_count: { uploaded: 5, total: 20 },
    },
};

const chaptersResponse = {
    data: [{ number: '1' }, { number: '2' }, { number: '10' }],
};

const mockMangaLibApi = () => {
    mockedHttpClient.mockImplementation(async url => {
        const href = String(url);
        if (href.includes('/chapters')) {
            return chaptersResponse;
        }
        return mangaResponse;
    });
};

describe('mangaLibParser', () => {
    beforeEach(() => {
        mockedHttpClient.mockReset();
        mockMangaLibApi();
    });

    it('parses title, cover and last chapter number from api responses', async () => {
        const result = await mangaLibParser(
            'https://mangalib.org/ru/manga/193953--paranoid-mage-webtoon?section=chapters'
        );

        expect(mockedHttpClient).toHaveBeenCalledWith(
            expect.stringContaining('https://api2.mangalib.me/api/manga/193953--paranoid-mage-webtoon?')
        );
        expect(mockedHttpClient).toHaveBeenCalledWith(
            'https://api2.mangalib.me/api/manga/193953--paranoid-mage-webtoon/chapters'
        );
        expect(result).toEqual({
            title: 'Маг-параноик',
            lastChapter: '10',
            image: 'https://cover.cdnlibs.org/uploads/cover/test/cover/thumb.jpg',
        });
    });

    it('uses last chapter number instead of uploaded chapters count', async () => {
        const result = await mangaLibParser('https://mangalib.me/manga/test-slug');

        expect(result?.lastChapter).toBe('10');
        expect(result?.lastChapter).not.toBe('5');
    });

    it('returns null when chapter list is empty', async () => {
        mockedHttpClient.mockImplementation(async url => {
            if (String(url).includes('/chapters')) {
                return { data: [] };
            }
            return mangaResponse;
        });

        const result = await mangaLibParser('https://mangalib.org/ru/manga/test-slug');

        expect(result).toBeNull();
    });
});
