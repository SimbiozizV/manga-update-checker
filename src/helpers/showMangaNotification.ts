import { Manga } from '../types/Manga';
import { NOTIFICATION } from '../constants/text';
import { getIconBySource } from './index';

export default (manga: Manga) =>
    chrome.runtime.sendMessage('', {
        type: 'notification',
        options: {
            title: NOTIFICATION.title,
            message: NOTIFICATION.message(manga.prevChapter),
            iconUrl: getIconBySource(manga.source),
            type: 'basic',
        },
    });
