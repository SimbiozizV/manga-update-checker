import { Manga } from '../types/Manga';
import { ExportItem } from '../types/ExportItem';

export default (manga: Manga[]): ExportItem[] => {
    return manga.map(({ url, prevChapter, source }) => ({ url, prevChapter, source }));
};
