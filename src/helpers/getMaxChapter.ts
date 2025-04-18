import { Manga } from '../types/Manga';

export const getMaxChapter = (mirrors: Manga['mirrors']) =>
    Math.max(...Object.values(mirrors).map(i => parseFloat(i.lastChapter))).toString();
