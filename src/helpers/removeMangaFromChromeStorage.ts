import getChromeStorage from './getChromeStorage';
import { STORAGE_KEY } from '../constants';

export default async (url: string) => {
    const storage = await getChromeStorage();
    const index = storage.manga.findIndex(manga => manga.url === url);

    if (index > -1) {
        storage.manga.splice(index, 1);

        await chrome.storage.local.set({
            [STORAGE_KEY]: JSON.stringify(storage),
        });
    }
};
