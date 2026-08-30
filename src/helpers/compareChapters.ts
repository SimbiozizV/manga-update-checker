export const parseChapter = (value: string): number => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

export const compareChapters = (a: string, b: string): number => parseChapter(a) - parseChapter(b);
