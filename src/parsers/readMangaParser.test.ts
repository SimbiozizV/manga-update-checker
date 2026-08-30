import { beforeEach, describe, expect, it, vi } from 'vitest';
import httpClient from '../api/httpClient';
import readMangaParser from './readMangaParser';

vi.mock('../api/httpClient', () => ({
    default: vi.fn(),
}));

const mockedHttpClient = vi.mocked(httpClient);

const readMangaFixture = `
<meta itemprop="name" content="Test Manga" />
<div class="picture-fotorama"><img src="https://readmanga.live/cover.jpg" /></div>
<a class="read-last-chapter" href="/test/chapter/42"></a>
`;

describe('readMangaParser', () => {
    beforeEach(() => {
        mockedHttpClient.mockReset();
    });

    it('parses title, image and last chapter from html', async () => {
        mockedHttpClient.mockResolvedValue(readMangaFixture);

        const result = await readMangaParser('https://readmanga.live/test');

        expect(result).toEqual({
            title: 'Test Manga',
            image: 'https://readmanga.live/cover.jpg',
            lastChapter: '42',
        });
    });
});
