import { SourceType } from '../enum';

export type Manga = {
    url: string;
    title: string;
    prevChapter: string;
    lastChapter: string;
    source: SourceType;
};
