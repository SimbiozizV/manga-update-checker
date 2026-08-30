import {
    CHECK_INTERVAL_MINUTES,
    CHECK_INTERVAL_STORAGE_KEY,
    STORAGE_SCHEMA_VERSION,
    UPDATE_PROGRESS_STORAGE_KEY,
} from '../constants';
import { ChromeStorage, UpdateProgress } from '../types/ChromeStorage';
import { Manga } from '../types/Manga';

const createInitialStorage = (): ChromeStorage => ({
    schemaVersion: STORAGE_SCHEMA_VERSION,
    manga: [],
    updateProgress: null,
    checkIntervalMinutes: CHECK_INTERVAL_MINUTES,
});

const normalizeStorage = (raw: unknown): ChromeStorage => {
    if (!raw) {
        return createInitialStorage();
    }

    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw) as Partial<ChromeStorage>;
            return {
                schemaVersion: STORAGE_SCHEMA_VERSION,
                manga: parsed.manga ?? [],
                updateProgress: parsed.updateProgress ?? null,
                checkIntervalMinutes: parsed.checkIntervalMinutes ?? CHECK_INTERVAL_MINUTES,
            };
        } catch {
            return createInitialStorage();
        }
    }

    const data = raw as Partial<ChromeStorage>;
    return {
        schemaVersion: data.schemaVersion ?? STORAGE_SCHEMA_VERSION,
        manga: data.manga ?? [],
        updateProgress: data.updateProgress ?? null,
        checkIntervalMinutes: data.checkIntervalMinutes ?? CHECK_INTERVAL_MINUTES,
    };
};

class MangaStorage {
    private storageKey = '';

    constructor(key: string) {
        this.storageKey = key;
    }

    public getStorage = async (): Promise<ChromeStorage> => {
        const storageData = await chrome.storage.local.get([
            this.storageKey,
            UPDATE_PROGRESS_STORAGE_KEY,
            CHECK_INTERVAL_STORAGE_KEY,
        ]);
        const legacyStorage = normalizeStorage(storageData[this.storageKey]);

        return {
            ...legacyStorage,
            updateProgress:
                storageData[UPDATE_PROGRESS_STORAGE_KEY] === undefined
                    ? legacyStorage.updateProgress
                    : storageData[UPDATE_PROGRESS_STORAGE_KEY],
            checkIntervalMinutes:
                storageData[CHECK_INTERVAL_STORAGE_KEY] === undefined
                    ? legacyStorage.checkIntervalMinutes
                    : storageData[CHECK_INTERVAL_STORAGE_KEY],
        };
    };

    public saveStorage = async (state: Partial<ChromeStorage>) => {
        const changes: Record<string, unknown> = {};

        if (state.manga !== undefined) {
            changes[this.storageKey] = {
                schemaVersion: STORAGE_SCHEMA_VERSION,
                manga: state.manga,
            };
        }
        if (state.updateProgress !== undefined) {
            changes[UPDATE_PROGRESS_STORAGE_KEY] = state.updateProgress;
        }
        if (state.checkIntervalMinutes !== undefined) {
            changes[CHECK_INTERVAL_STORAGE_KEY] = state.checkIntervalMinutes;
        }

        if (Object.keys(changes).length) {
            await chrome.storage.local.set(changes);
        }
    };

    public setMangaList = async (mangaList: Manga[]) => {
        await this.saveStorage({ manga: mangaList });
    };

    public setUpdateProgress = async (updateProgress: UpdateProgress | null) => {
        await chrome.storage.local.set({ [UPDATE_PROGRESS_STORAGE_KEY]: updateProgress });
    };

    public setCheckIntervalMinutes = async (checkIntervalMinutes: number) => {
        await chrome.storage.local.set({ [CHECK_INTERVAL_STORAGE_KEY]: checkIntervalMinutes });
    };
}

export default MangaStorage;
