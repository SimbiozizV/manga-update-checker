export type MangaOvhSearchItem = {
    name: {
        ru: string;
        en: string;
    };
    poster: string;
    slug: string;
};

export type MangaOvhSearchResponse = MangaOvhSearchItem[];
