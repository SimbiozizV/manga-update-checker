import { Manga } from '../types/Manga';
import { parseChapter } from './compareChapters';

export const getMaxChapter = (mirrors: Manga['mirrors']): string => {
    const chapters = Object.values(mirrors).map(mirror => parseChapter(mirror.lastChapter));

    if (!chapters.length) {
        return '0';
    }

    return Math.max(...chapters).toString();
};
