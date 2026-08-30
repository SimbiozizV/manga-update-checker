import MangaStorage from './class/MangaStorage';
import { CHECK_INTERVAL_MINUTES, STORAGE_KEY } from './constants';
import { getNewChaptersCount, setExtensionIconMode } from './helpers';
import { hasNewChapters } from './helpers/hasNewChapters';
import { getNewUpdatesCount, isUpdateProgressFresh, updateMangaList } from './services/mangaUpdateService';
import { notifyNewUpdatesIfPopupClosed } from './services/notificationService';
import { Manga } from './types/Manga';

const store = new MangaStorage(STORAGE_KEY);
let periodicUpdatePromise: Promise<void> | null = null;

const countNewUpdates = (original: Manga[], updated: Manga[]): number => {
    const originalById = new Map(original.map(item => [item.id, item]));

    return updated.reduce((count, item) => {
        const previous = originalById.get(item.id);
        if (previous && hasNewChapters(previous.mirrors, item.mirrors)) {
            return count + 1;
        }
        return count;
    }, 0);
};

const ensurePeriodicAlarm = async () => {
    const { checkIntervalMinutes = CHECK_INTERVAL_MINUTES } = await store.getStorage();

    chrome.alarms.get('periodic', alarm => {
        if (!alarm || alarm.periodInMinutes !== checkIntervalMinutes) {
            chrome.alarms.clear('periodic', () => {
                chrome.alarms.create('periodic', { periodInMinutes: checkIntervalMinutes });
            });
        }
    });
};

const runPeriodicUpdate = async () => {
    const storage = await store.getStorage();
    const { manga, updateProgress } = storage;
    const originalManga = manga;

    let startIndex = 0;
    let initialResult: Manga[] = [];
    const startedAt = isUpdateProgressFresh(updateProgress) ? updateProgress.startedAt : Date.now();

    if (isUpdateProgressFresh(updateProgress)) {
        startIndex = updateProgress.lastIndex;
        initialResult = updateProgress.partialManga;
    } else {
        await store.setUpdateProgress({
            lastIndex: 0,
            startedAt,
            partialManga: [],
        });
    }

    const { updated, hasErrors } = await updateMangaList(manga, {
        startIndex,
        initialResult,
        onBatchComplete: async (partial, nextIndex) => {
            await store.setUpdateProgress({
                lastIndex: nextIndex,
                startedAt,
                partialManga: partial,
            });
        },
    });

    await store.setMangaList(updated);
    await store.setUpdateProgress(null);

    const newUpdatesCount = countNewUpdates(originalManga, updated);
    await setExtensionIconMode(getNewUpdatesCount(updated));
    await notifyNewUpdatesIfPopupClosed(newUpdatesCount);

    if (hasErrors) {
        console.warn('Periodic update completed with mirror errors');
    }
};

const initBackground = async () => {
    try {
        const { manga } = await store.getStorage();
        await setExtensionIconMode(getNewChaptersCount(manga));
        await ensurePeriodicAlarm();
    } catch (error) {
        console.error('Failed to initialize background worker:', error);
    }
};

chrome.runtime.onInstalled.addListener(initBackground);
initBackground();

chrome.alarms.onAlarm.addListener(async alarm => {
    if (alarm.name !== 'periodic' || periodicUpdatePromise) return;

    periodicUpdatePromise = runPeriodicUpdate()
        .catch(error => {
            console.error('Periodic update failed:', error);
        })
        .finally(() => {
            periodicUpdatePromise = null;
        });

    await periodicUpdatePromise;
});

chrome.runtime.onMessage.addListener((data, _sender, sendResponse) => {
    if (data.type === 'notification') {
        chrome.notifications.create(data.options);
        sendResponse('OK');
        return;
    }

    if (data.type === 'ping') {
        sendResponse('pong');
        return;
    }

    if (data.type === 'updateCheckInterval') {
        ensurePeriodicAlarm().then(() => sendResponse('OK'));
        return true;
    }

    sendResponse('OK');
});
