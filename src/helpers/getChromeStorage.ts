import { STORAGE_KEY } from '../constants';
import { ChromeStorage } from '../types/ChromeStorage';

const initialStorage: ChromeStorage = { manga: [] };

export default async (): Promise<ChromeStorage> => {
    const storageData = await chrome.storage.local.get(STORAGE_KEY);
    if (storageData[STORAGE_KEY]) return JSON.parse(storageData[STORAGE_KEY]);

    return initialStorage;
};
