import React, { FC } from 'react';
import { Store } from '../../types/Store';
import MangaList from '../MangaList/MangaList';
import { useAppSelector } from '../../hooks';

const selector = (state: Store) => state.manga;

const MangaListTab: FC = () => {
    const mangaList = useAppSelector(selector);

    return <MangaList mangaList={mangaList} />;
};

export default MangaListTab;
