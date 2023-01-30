import grayIcon from '../icons/extension/gray.png';
import greenIcon from '../icons/extension/green.png';
export default (newChaptersCount: number) => {
    const icon = newChaptersCount > 0 ? greenIcon : grayIcon;
    const text = newChaptersCount > 0 ? newChaptersCount.toString() : '';

    chrome.action.setBadgeText({ text });

    chrome.action.setIcon({
        path: {
            '16': icon,
            '32': icon,
            '48': icon,
            '128': icon,
        },
    });
};
