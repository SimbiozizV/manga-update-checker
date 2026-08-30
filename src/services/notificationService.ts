import { BACKGROUND_NOTIFICATION } from '../constants/text';

export const notifyNewUpdates = async (count: number): Promise<void> => {
    if (count <= 0) return;

    await chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('gray.png'),
        title: BACKGROUND_NOTIFICATION.title,
        message: BACKGROUND_NOTIFICATION.message(count),
    });
};

export const isPopupOpen = async (): Promise<boolean> => {
    try {
        const response = await chrome.runtime.sendMessage({ type: 'ping' });
        return response === 'pong';
    } catch {
        return false;
    }
};

export const notifyNewUpdatesIfPopupClosed = async (count: number): Promise<void> => {
    if (count <= 0) return;

    const popupOpen = await isPopupOpen();
    if (!popupOpen) {
        await notifyNewUpdates(count);
    }
};
