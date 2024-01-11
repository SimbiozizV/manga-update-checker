import { MangaStatus, SourceType } from '../enum';

export type Manga = {
    url: string;
    title: string;
    image: string;
    prevChapter: string;
    lastChapter: string;
    status: MangaStatus;
    source: SourceType;
};
