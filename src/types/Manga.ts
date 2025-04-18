import { MangaStatus, SourceType } from '../enum';

export type Mirror = {
    url: string;
    status: MangaStatus;
    lastChapter: string;
};

export type OldManga = {
    url: string;
    title: string;
    image: string;
    prevChapter: string;
    lastChapter: string;
    status: MangaStatus;
    source: SourceType;
};

export type Manga = {
    id: string;
    title: string;
    image: string;
    prevChapter: string;
    mirrors: { [key in SourceType]?: Mirror };
};
