import { Manga } from './Manga';

export type ExportItem = Pick<Manga, 'url' | 'lastChapter' | 'source'>;
