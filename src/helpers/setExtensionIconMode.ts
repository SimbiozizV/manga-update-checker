export default async (newChaptersCount: number) => {
    const icon = newChaptersCount > 0 ? 'green.png' : 'gray.png';
    const text = newChaptersCount > 0 ? newChaptersCount.toString() : '';

    await chrome.action.setBadgeText({ text });
    await chrome.action.setIcon({
        path: {
            '16': icon,
            '32': icon,
            '48': icon,
            '128': icon,
        },
    });
};
