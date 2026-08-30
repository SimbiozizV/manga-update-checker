import httpClient from '../api/httpClient';
import { AsyncParser } from '../types/Parser';

const requestKeys = [
    'background',
    'eng_name',
    'otherNames',
    'summary',
    'releaseDate',
    'type_id',
    'caution',
    'views',
    'close_view',
    'rate_avg',
    'rate',
    'genres',
    'tags',
    'teams',
    'user',
    'franchise',
    'authors',
    'publisher',
    'userRating',
    'moderated',
    'metadata',
    'metadata.count',
    'metadata.close_comments',
    'manga_status_id',
    'chap_count',
    'status_id',
    'artists',
    'format',
];

type MLResponse = {
    rus_name: string;
    cover: {
        thumbnail: string;
    };
};

type MLChapter = {
    number: string;
};

const getSlug = (url: string): string | undefined => new URL(url).pathname.split('/').filter(Boolean).at(-1);

export const mangaLibParser: AsyncParser = async (url: string) => {
    const name = getSlug(url);
    if (!name) return null;

    const params = new URLSearchParams();
    requestKeys.forEach(key => {
        params.append('fields[]', key);
    });

    const mangaUrl = `https://api2.mangalib.me/api/manga/${name}?${params}`;
    const chaptersUrl = `https://api2.mangalib.me/api/manga/${name}/chapters`;

    try {
        const [{ data }, { data: chapters }] = await Promise.all([
            httpClient<{ data: MLResponse }>(mangaUrl),
            httpClient<{ data: MLChapter[] }>(chaptersUrl),
        ]);

        const lastChapter = chapters.at(-1)?.number;
        if (!lastChapter) return null;

        return {
            title: data.rus_name,
            lastChapter: String(lastChapter),
            image: data.cover.thumbnail,
        };
    } catch (e) {
        console.error(e);
    }

    return null;
};
