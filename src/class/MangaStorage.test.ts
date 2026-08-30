import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CHECK_INTERVAL_STORAGE_KEY, STORAGE_KEY, UPDATE_PROGRESS_STORAGE_KEY } from '../constants';
import MangaStorage from './MangaStorage';

const storage = new Map<string, unknown>();
const get = vi.fn(async (keys: string | string[]) => {
    const keyList = Array.isArray(keys) ? keys : [keys];
    return Object.fromEntries(keyList.flatMap(key => (storage.has(key) ? [[key, storage.get(key)]] : [])));
});
const set = vi.fn(async (changes: Record<string, unknown>) => {
    Object.entries(changes).forEach(([key, value]) => storage.set(key, value));
});

Object.assign(globalThis, { chrome: { storage: { local: { get, set } } } });

describe('MangaStorage', () => {
    beforeEach(() => {
        storage.clear();
        get.mockClear();
        set.mockClear();
    });

    it('reads legacy fields until separate values are written', async () => {
        storage.set(
            STORAGE_KEY,
            JSON.stringify({ manga: [{ id: '1' }], checkIntervalMinutes: 30, updateProgress: { lastIndex: 1 } })
        );

        const mangaStorage = new MangaStorage(STORAGE_KEY);

        await expect(mangaStorage.getStorage()).resolves.toMatchObject({
            manga: [{ id: '1' }],
            checkIntervalMinutes: 30,
            updateProgress: { lastIndex: 1 },
        });

        await mangaStorage.setCheckIntervalMinutes(5);
        await mangaStorage.setUpdateProgress(null);

        expect(set).toHaveBeenCalledWith({ [CHECK_INTERVAL_STORAGE_KEY]: 5 });
        expect(set).toHaveBeenCalledWith({ [UPDATE_PROGRESS_STORAGE_KEY]: null });
    });

    it('writes progress without rewriting the manga list', async () => {
        const mangaStorage = new MangaStorage(STORAGE_KEY);

        await mangaStorage.setUpdateProgress({ lastIndex: 3, startedAt: 1, partialManga: [] });

        expect(set).toHaveBeenCalledTimes(1);
        expect(set).toHaveBeenCalledWith({
            [UPDATE_PROGRESS_STORAGE_KEY]: { lastIndex: 3, startedAt: 1, partialManga: [] },
        });
    });
});
