import React, { FC, useCallback } from 'react';
import { Store } from '../types/Store';
import { useAppDispatch, useAppSelector } from '../hooks';
import MangaListItem from './MangaListItem';
import styled from '@emotion/styled';
import { Button } from 'antd';
import { checkMangaUpdate } from '../state/slices';

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px 0;
    width: 100%;
`;

const selector = (state: Store) => ({
    manga: state.manga,
    isUpdating: state.isUpdating,
});

const MangaList: FC = () => {
    const dispatch = useAppDispatch();
    const { manga, isUpdating } = useAppSelector(selector);

    const onUpdate = useCallback(() => {
        dispatch(checkMangaUpdate());
    }, [dispatch]);

    return (
        <Wrap>
            <Button type="primary" onClick={onUpdate} loading={isUpdating}>
                Проверить обновления
            </Button>

            <Wrap>
                {manga.map(item => (
                    <MangaListItem key={item.url} {...item} />
                ))}
            </Wrap>
        </Wrap>
    );
};

export default MangaList;
