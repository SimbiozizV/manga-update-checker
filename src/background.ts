import MangaStorage from './class/MangaStorage';
import { STORAGE_KEY, BATCH_SIZE } from './constants';
import { updateManga } from './state/slices/mangaPage';
import { getNewChaptersCount, setExtensionIconMode } from './helpers';
import { Manga } from './types/Manga';

chrome.runtime.onInstalled.addListener(async () => {
    const store = new MangaStorage(STORAGE_KEY);
    const { manga } = await store.getStorage();

    await setExtensionIconMode(getNewChaptersCount(manga));

    chrome.alarms.get('periodic', a => {
        if (!a) chrome.alarms.create('periodic', { periodInMinutes: 10.0 });
    });
});

chrome.alarms.onAlarm.addListener(async () => {
    const store = new MangaStorage(STORAGE_KEY);
    const { manga } = await store.getStorage();

    let index = 0;
    let result: Manga[] = [];
    while (index < manga.length) {
        const batch = manga.slice(index, index + BATCH_SIZE);
        const updatedManga = await Promise.all(batch.map(updateManga));
        const mangaBatch = updatedManga.map((item, key) => {
            return {
                ...batch[key],
                image: item.image,
                title: item.title,
                mirrors: item.mirrors,
            };
        });
        result = [...result, ...mangaBatch];
        index += BATCH_SIZE;
    }

    await store.setMangaList(result);
    await setExtensionIconMode(getNewChaptersCount(result));
});

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.type === 'notification') {
        chrome.notifications.create('', data.options);
    }
    sendResponse('OK');
});
