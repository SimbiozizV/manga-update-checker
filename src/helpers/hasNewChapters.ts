import { Manga } from '../types/Manga';
import { getMaxChapter } from './getMaxChapter';

export const hasNewChapters = (oldMirrors: Manga['mirrors'], newMirrors: Manga['mirrors']) => {
    return getMaxChapter(oldMirrors) < getMaxChapter(newMirrors);
};
