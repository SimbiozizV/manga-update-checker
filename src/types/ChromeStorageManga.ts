import { Manga } from './Manga';

export type ChromeStorageManga = Pick<Manga, 'title' | 'url' | 'lastChapter' | 'prevChapter'>;
