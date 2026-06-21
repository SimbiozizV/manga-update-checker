export default (url: string) => {
    try {
        return Boolean(new URL(url));
    } catch (e) {
        console.error(e);
        return false;
    }
};
