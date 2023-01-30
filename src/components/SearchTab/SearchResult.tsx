import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Spin } from 'antd';
import { useAppSelector } from '../../hooks';
import SearchResultItem from './SearchResultItem';
import { selectSearchTab } from '../../state/slices/searchTab';

const ResultWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px 0;
`;

const SearchResult: FC = () => {
    const { manga, isWaiting } = useAppSelector(selectSearchTab);

    if (isWaiting) return <Spin tip="Загрузка" size="large" />;

    return (
        <ResultWrap>
            {manga.map(item => (
                <SearchResultItem key={item.href} {...item} />
            ))}
        </ResultWrap>
    );
};

export default SearchResult;
