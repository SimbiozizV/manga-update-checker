import { Manga } from '../../../types/Manga';
import { ExportItem } from '../../../types/ExportItem';

export default (manga: Manga[]): ExportItem[] => {
    return manga.map(({ url, lastChapter, source }) => ({ url, lastChapter, source }));
};
