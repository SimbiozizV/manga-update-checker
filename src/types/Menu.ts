import { Route } from '../enum';

export type MenuItem = {
    url: Route;
    text: string;
};

export type Menu = MenuItem[];
