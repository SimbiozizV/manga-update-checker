import { Manga } from '../types/Manga';
import { compareChapters } from './compareChapters';
import { getMaxChapter } from './getMaxChapter';

export const hasNewChapters = (oldMirrors: Manga['mirrors'], newMirrors: Manga['mirrors']) =>
    compareChapters(getMaxChapter(oldMirrors), getMaxChapter(newMirrors)) < 0;
