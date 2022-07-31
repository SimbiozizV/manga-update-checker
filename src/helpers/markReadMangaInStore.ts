import getChromeStorage from './getChromeStorage';
import replaceChromeStorageManga from './replaceChromeStorageManga';

export default async (url: string) => {
    const state = await getChromeStorage();

    const index = state.manga.findIndex(manga => manga.url === url);
    if (index > -1) {
        state.manga[index].prevChapter = state.manga[index].lastChapter;
        await replaceChromeStorageManga(state.manga);
    }
};
