import getPluralForm from '../helpers/getPluralForm';

export const EMPTY_TEXT = {
    list: 'Добавьте мангу в список',
    newChapters: 'Нет новых глав',
};

export const DEFAULT_ERROR = 'Что-то пошло не так';

export const CONFIRM_DELETE_TEXT = 'Вы точно хотите удалить мангу?';

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
