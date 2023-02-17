import MangaStorage from './class/MangaStorage';
import { STORAGE_KEY } from './constants';
import { updateManga } from './state/slices/mangaTab';
import { Manga } from './types/Manga';
import { getNewChaptersCount, setExtensionIconMode } from './helpers';
chrome.runtime.onInstalled.addListener(async () => {
    const store = new MangaStorage(STORAGE_KEY);
    const { manga } = await store.getStorage();

    setExtensionIconMode(getNewChaptersCount(manga));

    chrome.alarms.get('periodic', a => {
        if (!a) chrome.alarms.create('periodic', { periodInMinutes: 1.0 });
    });
});

chrome.alarms.onAlarm.addListener(async () => {
    const store = new MangaStorage(STORAGE_KEY);
    const { manga } = await store.getStorage();

    const updatedManga = await Promise.allSettled(manga.map(updateManga));
    const result = updatedManga.reduce<Manga[]>((acc, mangaItem, key) => {
        if (mangaItem.status === 'fulfilled') {
            acc.push({
                ...manga[key],
                lastChapter: mangaItem.value.lastChapter,
                status: mangaItem.value.status,
            });
        } else {
            acc.push(manga[key]);
        }
        return acc;
    }, []);

    await store.setMangaList(result);

    setExtensionIconMode(getNewChaptersCount(result));
});

chrome.runtime.onMessage.addListener(data => {
    if (data.type === 'notification') {
        chrome.notifications.create('', data.options);
    }
});
