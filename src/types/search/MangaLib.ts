export type MangaLibSearchItem = {
    rus_name: string;
    eng_name: string;
    href: string;
    covers: {
        default: string;
        thumbnail: string;
    };
};

export type MangaLibSearchResponse = MangaLibSearchItem[];
