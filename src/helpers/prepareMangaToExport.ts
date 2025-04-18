import { ExportItem } from '../types/ExportItem';
import { Manga } from '../types/Manga';

export default (manga: Manga[]): ExportItem[] => {
    return manga.map(({ id, prevChapter, mirrors }) => ({ id, mirrors, prevChapter }));
};
