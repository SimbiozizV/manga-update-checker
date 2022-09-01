import React, { FC } from 'react';
import MangaListItem from './MangaListItem';
import { useAppDispatch } from '../../hooks';
import { onRedirectByLink, removeManga } from '../../state/slices';
import { Manga } from '../../types/Manga';
import { List } from 'antd';

type Props = {
    mangaList: Manga[];
};

const MangaList: FC<Props> = ({ mangaList }) => {
    const dispatch = useAppDispatch();

    const onRemove = (url: string) => {
        dispatch(removeManga(url));
    };

    const onRedirect = (url: string) => {
        dispatch(onRedirectByLink(url));
    };

    return (
        <List
            size="small"
            dataSource={mangaList}
            renderItem={item => (
                <List.Item>
                    <MangaListItem key={item.url} manga={item} onRemove={onRemove} onRedirect={onRedirect} />
                </List.Item>
            )}
        />
    );
};

export default MangaList;
