import { Manga } from './Manga';

export type ExportItem = Pick<Manga, 'id' | 'prevChapter' | 'mirrors'>;
