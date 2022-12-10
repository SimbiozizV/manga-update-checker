import { Manga } from './Manga';

export type Store = {
    manga: Manga[];
    filter: string;
    isAdding: boolean;
    isUpdating: boolean;
    isImported: boolean;
};
