import { ParsedData } from './ParsedData';

export type Parser = (url: string) => ParsedData | null;

export type AsyncParser = (url: string) => Promise<ParsedData | null>;
