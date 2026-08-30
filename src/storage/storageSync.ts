import { STORAGE_KEY } from '../constants';
import { getNewChaptersCount, setExtensionIconMode } from '../helpers';
import { setMangaArrayAction } from '../state/slices/mangaPage';
import { ChromeStorage } from '../types/ChromeStorage';

export const parseStorageChange = (value: unknown): ChromeStorage['manga'] | null => {
    if (!value) return null;

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value) as ChromeStorage;
            return parsed.manga ?? null;
        } catch {
            return null;
        }
    }

    return (value as ChromeStorage).manga ?? null;
};

export const subscribeToStorageChanges = (dispatch: (action: ReturnType<typeof setMangaArrayAction>) => void) => {
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }, area: chrome.storage.AreaName) => {
        if (area !== 'local' || !changes[STORAGE_KEY]) return;

        const manga = parseStorageChange(changes[STORAGE_KEY].newValue);
        if (!manga) return;

        dispatch(setMangaArrayAction(manga));
        void setExtensionIconMode(getNewChaptersCount(manga));
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
};
