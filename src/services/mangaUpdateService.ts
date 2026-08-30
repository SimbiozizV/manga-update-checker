import getDataByUrl from '../api/getDataByUrl';
import { BATCH_SIZE, UPDATE_PROGRESS_MAX_AGE_MS } from '../constants';
import { MangaStatus } from '../enum';
import { getKeys } from '../helpers/getKeys';
import getNewChaptersCount from '../helpers/getNewChaptersCount';
import { hasNewChapters } from '../helpers/hasNewChapters';
import { UpdateProgress } from '../types/ChromeStorage';
import { Manga } from '../types/Manga';

export type UpdateMangaListResult = {
    updated: Manga[];
    newUpdates: Manga[];
    hasErrors: boolean;
};

export const hasMirrorErrors = (mirrors: Manga['mirrors']): boolean =>
    Object.values(mirrors).some(mirror => mirror.status === MangaStatus.Error);

export const updateSingleManga = async (manga: Manga): Promise<Manga> => {
    const keys = getKeys(manga.mirrors);

    const mirrors = await Promise.allSettled(
        keys.map(source => getDataByUrl({ url: manga.mirrors[source]!.url, source }))
    );

    let { image, title } = manga;

    const nextMirrors = mirrors.reduce<Manga['mirrors']>((acc, mirror) => {
        if (mirror.status === 'fulfilled') {
            const { url, source, data } = mirror.value;

            if (data) {
                if (data.image) image = data.image;
                if (data.title) title = data.title;

                acc[source] = {
                    url,
                    status: MangaStatus.Success,
                    lastChapter: data.lastChapter.toString(),
                };
            } else {
                acc[source] = {
                    url,
                    status: MangaStatus.Error,
                    lastChapter: manga.mirrors[source]!.lastChapter,
                };
            }
        }
        return acc;
    }, {});

    return {
        ...manga,
        image,
        title,
        mirrors: nextMirrors,
    };
};

const mergeUpdatedManga = (original: Manga, updated: Manga): Manga => ({
    ...original,
    image: updated.image || original.image,
    title: updated.title || original.title,
    mirrors: updated.mirrors,
});

export const updateMangaList = async (
    manga: Manga[],
    options?: {
        startIndex?: number;
        initialResult?: Manga[];
        onBatchComplete?: (result: Manga[], nextIndex: number) => Promise<void>;
    }
): Promise<UpdateMangaListResult> => {
    const startIndex = options?.startIndex ?? 0;
    let result = options?.initialResult ?? [];
    const newUpdates: Manga[] = [];
    let hasErrors = false;
    let index = startIndex;

    while (index < manga.length) {
        const batch = manga.slice(index, index + BATCH_SIZE);
        const updatedBatch = await Promise.all(batch.map(updateSingleManga));

        for (let key = 0; key < updatedBatch.length; key++) {
            const original = batch[key];
            const merged = mergeUpdatedManga(original, updatedBatch[key]);

            if (hasNewChapters(original.mirrors, merged.mirrors)) {
                newUpdates.push(merged);
            }
            if (hasMirrorErrors(merged.mirrors)) {
                hasErrors = true;
            }

            result.push(merged);
        }

        index += BATCH_SIZE;

        if (options?.onBatchComplete) {
            await options.onBatchComplete([...result], index);
        }
    }

    return { updated: result, newUpdates, hasErrors };
};

export const getNewUpdatesCount = (manga: Manga[]): number => getNewChaptersCount(manga);

export const isUpdateProgressFresh = (progress: UpdateProgress | null | undefined): progress is UpdateProgress => {
    if (!progress) return false;
    return Date.now() - progress.startedAt < UPDATE_PROGRESS_MAX_AGE_MS;
};
