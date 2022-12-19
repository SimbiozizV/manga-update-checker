export default () => {
    const now = new Date();
    return `manga-export_${now.toLocaleString('ru-RU').split(',')[0].replace(/\./g, '-')}.json`;
};
