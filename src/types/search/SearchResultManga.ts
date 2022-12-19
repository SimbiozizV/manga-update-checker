import { SourceType } from '../../enum';

export type SearchResultManga = {
    name: string;
    nameEng: string;
    thumbnail: string;
    href: string;
    source: SourceType;
};
