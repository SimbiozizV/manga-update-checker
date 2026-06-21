import MangaStorage from './class/MangaStorage';
import { STORAGE_KEY, BATCH_SIZE } from './constants';
import { getNewChaptersCount, setExtensionIconMode } from './helpers';
import { updateManga } from './state/slices/mangaPage';
import { Manga } from './types/Manga';

const handleInstalled = async () => {
    const store = new MangaStorage(STORAGE_KEY);
    const { manga } = await store.getStorage();

    await setExtensionIconMode(getNewChaptersCount(manga));

    chrome.alarms.get('periodic', a => {
        if (!a) void chrome.alarms.create('periodic', { periodInMinutes: 10.0 });
    });
};

chrome.runtime.onInstalled.addListener(() => {
    void handleInstalled();
});

const handleAlarm = async () => {
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
};

chrome.alarms.onAlarm.addListener(() => {
    void handleAlarm();
});

type NotificationMessage = {
    type: 'notification';
    options: chrome.notifications.NotificationCreateOptions;
};

chrome.runtime.onMessage.addListener((data: NotificationMessage, sender, sendResponse) => {
    if (data && data.type === 'notification') {
        void chrome.notifications.create('', data.options);
    }

    sendResponse('OK');
});
