import { NOTIFICATION } from '../constants/text';
import { SourceType } from '../enum';
import { getIconBySource } from './index';

export default ({ source, prevChapter }: { source: SourceType; prevChapter: string }) =>
    chrome.runtime.sendMessage('', {
        type: 'notification',
        options: {
            title: NOTIFICATION.title,
            message: NOTIFICATION.message(prevChapter),
            iconUrl: getIconBySource(source),
            type: 'basic',
        },
    });
