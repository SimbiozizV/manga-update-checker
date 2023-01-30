import { Manga } from '../types/Manga';

export default (mangaList: Manga[]): number => {
    return mangaList.reduce((acc, manga) => {
        // eslint-disable-next-line no-param-reassign
        if (manga.lastChapter !== manga.prevChapter) acc++;
        return acc;
    }, 0);
};
