import { Manga } from './Manga';

export type ParsedData = Pick<Manga, 'title' | 'image'> & { lastChapter: string };
