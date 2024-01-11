import React, { FC } from 'react';
import styled from '@emotion/styled';
import { SearchResultManga } from '../../types/search/SearchResultManga';
import SearchResultImage from './SearchResultImage';
import { Space } from 'antd';
import SearchResultButtons from './SearchResultButtons';
import { addManga } from '../../state/slices/mangaPage';
import { useAppDispatch } from '../../hooks';

const Title = styled.div`
    font-size: 16px;
    font-weight: bold;
`;

const SearchResultItem: FC<SearchResultManga> = ({ thumbnail, name, nameEng, href, source }) => {
    const dispatch = useAppDispatch();
    const onAdd = () => {
        dispatch(addManga(href));
    };
    const onOpen = () => {
        chrome.tabs.create({ active: false, url: href });
    };

    return (
        <Space align="start">
            <SearchResultImage thumbnail={thumbnail} source={source} />
            <Space direction="vertical">
                <Title>{name}</Title>
                <div>{nameEng}</div>
                <SearchResultButtons onAdd={onAdd} onOpen={onOpen} />
            </Space>
        </Space>
    );
};

export default SearchResultItem;
