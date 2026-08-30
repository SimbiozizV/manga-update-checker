import { beforeEach, describe, expect, it, vi } from 'vitest';
import httpClient from '../api/httpClient';
import mangaBuffParser from './mangaBuffParser';

vi.mock('../api/httpClient', () => ({
    default: vi.fn(),
}));

const mockedHttpClient = vi.mocked(httpClient);

const mangaBuffFixture = `
<h1 class="manga__name">Месть гоблина</h1>
<meta property="og:image" content="https://mangabuff.ru/img/manga/posters/mest-goblina.jpg" />
<button class="tabs__item" data-page="chapters">Главы (12)</button>
<div class="hot-chapters">
    <a href="https://mangabuff.ru/manga/mest-goblina/1/12" class="hot-chapters__item">
        <span class="hot-chapters__number">12</span>
    </a>
    <a href="https://mangabuff.ru/manga/mest-goblina/1/11" class="hot-chapters__item">
        <span class="hot-chapters__number">11</span>
    </a>
</div>
`;

const mangaBuffTabFallbackFixture = `
<h1 class="manga__name">Месть гоблина</h1>
<meta property="og:image" content="/img/manga/posters/mest-goblina.jpg" />
<button class="tabs__item" data-page="chapters">Главы (12)</button>
`;

describe('mangaBuffParser', () => {
    beforeEach(() => {
        mockedHttpClient.mockReset();
    });

    it('parses title, image and last chapter from hot chapters', async () => {
        mockedHttpClient.mockResolvedValue(mangaBuffFixture);

        const result = await mangaBuffParser('https://mangabuff.ru/manga/mest-goblina');

        expect(mockedHttpClient).toHaveBeenCalledWith('https://mangabuff.ru/manga/mest-goblina', {
            stringType: true,
        });
        expect(result).toEqual({
            title: 'Месть гоблина',
            image: 'https://mangabuff.ru/img/manga/posters/mest-goblina.jpg',
            lastChapter: '12',
        });
    });

    it('falls back to chapters tab count and resolves relative image', async () => {
        mockedHttpClient.mockResolvedValue(mangaBuffTabFallbackFixture);

        const result = await mangaBuffParser('https://mangabuff.ru/manga/mest-goblina');

        expect(result).toEqual({
            title: 'Месть гоблина',
            image: 'https://mangabuff.ru/img/manga/posters/mest-goblina.jpg',
            lastChapter: '12',
        });
    });

    it('returns null when chapter data is missing', async () => {
        mockedHttpClient.mockResolvedValue('<h1 class="manga__name">Test</h1>');

        const result = await mangaBuffParser('https://mangabuff.ru/manga/mest-goblina');

        expect(result).toBeNull();
    });
});
