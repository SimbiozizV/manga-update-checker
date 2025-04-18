import { Manga } from '../types/Manga';
import { getMaxChapter } from './getMaxChapter';

export default (mangaList: Manga[]): number => {
    return mangaList.reduce((acc, manga) => {
        // eslint-disable-next-line no-param-reassign
        if (getMaxChapter(manga.mirrors) !== manga.prevChapter) acc++;
        return acc;
    }, 0);
};
