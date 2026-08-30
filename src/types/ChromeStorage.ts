import { Manga } from './Manga';

export type UpdateProgress = {
    lastIndex: number;
    startedAt: number;
    partialManga: Manga[];
};

export type ChromeStorage = {
    schemaVersion: number;
    manga: Manga[];
    updateProgress?: UpdateProgress | null;
    checkIntervalMinutes?: number;
};
