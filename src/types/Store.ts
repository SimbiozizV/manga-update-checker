import { Manga } from './Manga';

export type Store = {
    manga: Manga[];
    isAdding: boolean;
    isUpdating: boolean;
    isImported: boolean;
};
