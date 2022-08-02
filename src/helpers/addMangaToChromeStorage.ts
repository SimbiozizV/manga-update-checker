import { STORAGE_KEY } from '../constants';
import getChromeStorage from './getChromeStorage';
import { Manga } from '../types/Manga';

export default async (manga: Manga) => {
    const storageData = await getChromeStorage();
    const index = storageData.manga.findIndex(item => item.url === manga.url);

    if (index > -1) {
        storageData.manga[index] = manga;
    } else {
        storageData.manga.push(manga);
    }
    await chrome.storage.local.set({
        [STORAGE_KEY]: JSON.stringify(storageData),
    });
};
