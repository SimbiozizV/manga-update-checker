import { STORAGE_KEY } from '../constants';
import { ChromeStorage } from '../types/ChromeStorage';
import { Manga } from '../types/Manga';

class MangaStorage {
    private storageKey = '';

    constructor(key: string) {
        this.storageKey = key;
    }

    public getStorage = async (): Promise<ChromeStorage> => {
        const initialStorage: ChromeStorage = { manga: [] };
        const storageData = await chrome.storage.local.get(STORAGE_KEY);
        return storageData[STORAGE_KEY] ? JSON.parse(storageData[STORAGE_KEY]) : initialStorage;
    };

    public saveStorage = async (state: ChromeStorage) => {
        await chrome.storage.local.set({
            [this.storageKey]: JSON.stringify(state),
        });
    };

    public setMangaList = async (mangaList: Manga[]) => {
        const storageData = await this.getStorage();
        storageData.manga = mangaList;
        await this.saveStorage(storageData);
    };
}

export default MangaStorage;
