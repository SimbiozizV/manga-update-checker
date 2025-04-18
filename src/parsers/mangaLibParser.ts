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
    id: number;
    name: string;
    rus_name: string;
    eng_name: string;
    otherNames: string[];
    cover: {
        filename: string;
        thumbnail: string;
        default: string;
        md: string;
    };
    status: {
        id: number;
        label: string;
    };
    items_count: {
        uploaded: number;
        total: number;
    };
};

export const mangaLibParser: AsyncParser = async (url: string) => {
    const urlObj = new URL(url);
    const name = urlObj.pathname.split('/').at(-1);

    let params = new URLSearchParams();
    requestKeys.forEach(key => {
        params.append('fields[]', key);
    });

    const requestUrl = `https://api2.mangalib.me/api/manga/${name}?${params}`;

    try {
        const response = await fetch(requestUrl);
        const { data }: { data: MLResponse } = await response.json();

        return {
            title: data.rus_name,
            lastChapter: data.items_count.uploaded.toString(),
            image: data.cover.thumbnail,
        };
    } catch (e) {
        console.error(e);
    }

    return null;
};
