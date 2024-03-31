import MangaStorage from './class/MangaStorage';
import { STORAGE_KEY } from './constants';
import { updateManga } from './state/slices/mangaPage';
import { getNewChaptersCount, setExtensionIconMode } from './helpers';
chrome.runtime.onInstalled.addListener(async () => {
    const store = new MangaStorage(STORAGE_KEY);
    const { manga } = await store.getStorage();

    setExtensionIconMode(getNewChaptersCount(manga));

    chrome.alarms.get('periodic', a => {
        if (!a) chrome.alarms.create('periodic', { periodInMinutes: 10.0 });
    });
});

chrome.alarms.onAlarm.addListener(async () => {
    const store = new MangaStorage(STORAGE_KEY);
    const { manga } = await store.getStorage();

    const updatedManga = await Promise.allSettled(manga.map(updateManga));
    const result = updatedManga.map((item, key) => {
        return item.status === 'fulfilled'
            ? {
                  ...manga[key],
                  image: item.value.image,
                  title: item.value.title,
                  url: item.value.url,
                  lastChapter: item.value.lastChapter,
                  status: item.value.status,
              }
            : manga[key];
    });

    await store.setMangaList(result);

    setExtensionIconMode(getNewChaptersCount(result));
});

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.type === 'notification') {
        chrome.notifications.create('', data.options);
    }
    sendResponse('OK');
});
