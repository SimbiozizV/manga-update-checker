import { Manga } from '../types/Manga';
import { STORAGE_KEY } from '../constants';
import getChromeStorage from './getChromeStorage';

export default async (manga: Manga[]) => {
    const storageData = await getChromeStorage();

    await chrome.storage.local.set({
        [STORAGE_KEY]: JSON.stringify({ ...storageData, manga }),
    });
};
