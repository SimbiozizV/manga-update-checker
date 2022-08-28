export default (number: number, sobaka: string, sobaki: string, sobak: string): string => {
    const titles = [sobaka, sobaki, sobak];
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
};
