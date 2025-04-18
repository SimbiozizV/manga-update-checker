export default (url: string) => {
    try {
        return Boolean(new URL(url));
        // eslint-disable-next-line sonarjs/no-ignored-exceptions
    } catch (e) {
        return false;
    }
};
