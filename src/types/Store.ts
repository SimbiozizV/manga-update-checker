import { Manga } from './Manga';
import { SearchResultManga } from './search/SearchResultManga';

export type Store = {
    mangaTab: {
        manga: Manga[];
        filter: string;
        isAdding: boolean;
        isUpdating: boolean;
        isImported: boolean;
    };
    searchTab: {
        manga: SearchResultManga[];
        isWaiting: boolean;
    };
};
