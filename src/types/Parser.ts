import { Manga } from './Manga';

export type Parser = (url: string) => Pick<Manga, 'title' | 'lastChapter'> | null;
