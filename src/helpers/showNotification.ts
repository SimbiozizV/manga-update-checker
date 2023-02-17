type Props = {
    title: string;
    message: string;
    iconUrl: string;
};
export default ({ title, message, iconUrl }: Props) => {
    chrome.runtime.sendMessage('', {
        type: 'notification',
        options: {
            title,
            message,
            iconUrl,
            type: 'basic',
        },
    });
};
