import { beforeEach, describe, expect, it, vi } from 'vitest';
import httpClient from '../api/httpClient';
import { getRemangaChaptersRequest } from '../api/remanga';
import remangaParser from './remangaParser';

vi.mock('../api/httpClient', () => ({
    default: vi.fn(),
}));

vi.mock('../api/remanga', () => ({
    getRemangaChaptersRequest: vi.fn(),
}));

const mockedHttpClient = vi.mocked(httpClient);
const mockedGetRemangaChaptersRequest = vi.mocked(getRemangaChaptersRequest);

const remangaHtml = `
<meta property="og:image" content="https://remanga.org/cover.jpg" />
<script id="__NEXT_DATA__" type="application/json">
{
  "props": {
    "pageProps": {
      "fallbackData": {
        "content": {
          "rus_name": "Remanga Test",
          "branches": [{ "id": 123 }]
        }
      }
    }
  }
}
</script>
`;

describe('remangaParser', () => {
    beforeEach(() => {
        mockedHttpClient.mockReset();
        mockedGetRemangaChaptersRequest.mockReset();
    });

    it('parses title, image and last chapter', async () => {
        mockedHttpClient.mockResolvedValue(remangaHtml);
        mockedGetRemangaChaptersRequest.mockResolvedValue('7');

        const result = await remangaParser('https://remanga.org/manga/test');

        expect(result).toEqual({
            title: 'Remanga Test',
            image: 'https://remanga.org/cover.jpg',
            lastChapter: '7',
        });
    });
});
