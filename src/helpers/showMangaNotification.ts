import { Manga } from '../types/Manga';
import showNotification from './showNotification';
import { NOTIFICATION } from '../constants/text';
import { getIconBySource } from './index';

export default (manga: Manga) => {
    showNotification({
        title: NOTIFICATION.title,
        message: NOTIFICATION.message(manga.prevChapter),
        iconUrl: getIconBySource(manga.source),
    });
};
