import { Manga } from './Manga';
import { SearchResultManga } from './search/SearchResultManga';

export type Store = {
    mangaPage: {
        manga: Manga[];
        filter: string;
        isAdding: boolean;
        isUpdating: boolean;
        isImported: boolean;
    };
    searchPage: {
        manga: SearchResultManga[];
        isWaiting: boolean;
    };
};
