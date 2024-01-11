export default () => {
    const formatter = new Intl.DateTimeFormat('ru');
    return formatter.format(new Date()).replaceAll('.', '-');
};
