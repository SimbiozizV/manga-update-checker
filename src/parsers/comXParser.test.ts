import { beforeEach, describe, expect, it, vi } from 'vitest';
import httpClient from '../api/httpClient';
import comXParser from './comXParser';

vi.mock('../api/httpClient', () => ({
    default: vi.fn(),
}));

const mockedHttpClient = vi.mocked(httpClient);

const comXFixture = `
<h1>Волшебник ветра</h1>
<meta property="og:image" content="https://com-x.life/uploads/posts/2026-08/1785789669-volshebnik-vetra.jpg" />
<script>window.__DATA__ = {"news_id":32218,"chapters":[{"id":1079598,"posi":25,"number":24,"title":"1 - 24"}],"title":"Волшебник ветра"};</script>
`;

const comXJsonLdFixture = `
<h1>Волшебник ветра</h1>
<meta property="og:image" content="/uploads/posts/2026-08/1785789669-volshebnik-vetra.jpg" />
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"ComicSeries","name":"Волшебник ветра","hasPart":{"itemListElement":[{"item":{"issueNumber":"24.0"}}]}}]}</script>
`;

describe('comXParser', () => {
    beforeEach(() => {
        mockedHttpClient.mockReset();
    });

    it('parses title, image and last chapter from window.__DATA__', async () => {
        mockedHttpClient.mockResolvedValue(comXFixture);

        const result = await comXParser('https://com-x.life/32218-volshebnik-vetra.html#chapters');

        expect(mockedHttpClient).toHaveBeenCalledWith('https://com-x.life/32218-volshebnik-vetra.html', {
            stringType: true,
        });
        expect(result).toEqual({
            title: 'Волшебник ветра',
            image: 'https://com-x.life/uploads/posts/2026-08/1785789669-volshebnik-vetra.jpg',
            lastChapter: '24',
        });
    });

    it('falls back to JSON-LD when window.__DATA__ is missing', async () => {
        mockedHttpClient.mockResolvedValue(comXJsonLdFixture);

        const result = await comXParser('https://com-x.life/32218-volshebnik-vetra.html');

        expect(result).toEqual({
            title: 'Волшебник ветра',
            image: 'https://com-x.life/uploads/posts/2026-08/1785789669-volshebnik-vetra.jpg',
            lastChapter: '24',
        });
    });

    it('returns null when chapter data is missing', async () => {
        mockedHttpClient.mockResolvedValue('<h1>Test</h1>');

        const result = await comXParser('https://com-x.life/32218-volshebnik-vetra.html');

        expect(result).toBeNull();
    });
});
