import { Route } from '../../enum';
import { Menu } from '../../types/Menu';

const menuMap: Menu = [
    { text: 'Новые главы', url: Route.Root },
    { text: 'Список манги', url: Route.MangaList },
    { text: 'Поиск манги', url: Route.Search },
];

export default menuMap;
