import React, { FC } from 'react';
import { Store } from '../../types/Store';
import { useAppDispatch, useAppSelector } from '../../hooks';
import MangaListItem from './MangaListItem';
import styled from '@emotion/styled';
import { onRedirectByLink, removeManga } from '../../state/slices';

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px 0;
    width: 100%;
`;

const selector = (state: Store) => state.manga;

const MangaList: FC = () => {
    const dispatch = useAppDispatch();
    const manga = useAppSelector(selector);

    const onRemove = (url: string) => {
        dispatch(removeManga(url));
    };

    const onRedirect = (url: string) => {
        dispatch(onRedirectByLink(url));
    };

    return (
        <Wrap>
            {manga.map(mangaItem => (
                <MangaListItem key={mangaItem.url} manga={mangaItem} onRemove={onRemove} onRedirect={onRedirect} />
            ))}
        </Wrap>
    );
};

export default MangaList;
