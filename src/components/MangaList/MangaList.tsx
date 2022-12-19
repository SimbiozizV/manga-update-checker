import React, { FC } from 'react';
import MangaListItem from './MangaListItem';
import { useAppDispatch } from '../../hooks';
import { onRedirectByLink, removeManga } from '../../state/slices/mangaTab';
import { Manga } from '../../types/Manga';
import { List } from 'antd';
import styled from '@emotion/styled';

const ListItem = styled(List)`
    .ant-list-item {
        padding-right: 0;
        padding-left: 0;
    }
`;

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
                <ListItem>
                    <MangaListItem key={item.url} manga={item} onRemove={onRemove} onRedirect={onRedirect} />
                </ListItem>
            )}
        />
    );
};

export default MangaList;
