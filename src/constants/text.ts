import getPluralForm from '../helpers/getPluralForm';

export const NOTIFICATION = {
    title: 'Подсказка по главе',
    message: (lastChapter: any) => `В прошлый раз вы остановились на главе ${lastChapter}`,
};

export const EMPTY_TEXT = {
    list: 'Добавьте мангу в список',
    newChapters: 'Нет новых глав',
    filter: 'Нет манги по вашему фильтру',
};

export const DEFAULT_ERROR = 'Что-то пошло не так';

export const CONFIRM_DELETE_TEXT = 'Вы точно хотите удалить мангу?';

export const CONFIRM_DELETE_MIRROR = 'Вы точно хотите удалить этот источник?';

export const SEARCH_MANGA_TEXT = {
    error: 'Во время поиска возникла ошибка',
};

export const ADD_MANGA_TEXT = {
    success: 'Манга успешно добавлена',
    error: 'Ошибка добавления манги',
    alreadyExist: 'Манга уже есть в списке',
    notSupported: 'Источник манги не поддерживается',
};

export const UPDATE_MANGA_TEXT = {
    error: 'При обновлении возникли проблемы',
    success: (newChapterCount: number) => {
        return newChapterCount
            ? `${newChapterCount} ${getPluralForm(newChapterCount, 'обновление', 'обновления', 'обновлений')} манги`
            : 'Нет новых глав';
    },
};

export const IMPORT_MANGA_TEXT = {
    success: 'Успешный импорт',
    error: 'При импорте возникли проблемы',
    noNew: 'Нет новой манги для импорта',
    alreadyExist: 'Часть манги уже есть в списке',
};
