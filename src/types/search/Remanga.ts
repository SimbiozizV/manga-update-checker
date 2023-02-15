export type RemangaSearchItem = {
    avg_rating: string;
    bookmark_type: null;
    count_chapters: number;
    dir: string;
    en_name: string;
    id: number;
    img: {
        high: string;
        low: string;
        mid: string;
    };
    is_erotic: boolean;
    is_yaoi: boolean;
    issue_year: number;
    rus_name: string;
    type: number;
};

export type RemangaSearchResponse = {
    content: RemangaSearchItem[];
    msg: string;
    props: {
        page: number;
        total_items: number;
        total_pages: number;
    };
};

export type RemangaChapter = {
    chapter: string;
    id: number;
    index: number;
    is_bought: null;
    is_paid: boolean;
    name: string;
    price: null;
    pub_date: null;
    publishers: { name: string; dir: string; type: number }[];
    rated: null;
    score: number;
    tome: number;
    upload_date: string;
    viewed: null;
};

export type RemangaChaptersResponse = {
    content: RemangaChapter[];
    msg: string;
    props: {
        branch_id: number;
        page: number;
    };
};
