export type ReadMangaSearchItem = {
    additional: string;
    link: string;
    names: string[];
    thumbnail: string;
    value: string;
};

export type ReadMangaSearchResponse = {
    query: string;
    suggestions: ReadMangaSearchItem[];
};
