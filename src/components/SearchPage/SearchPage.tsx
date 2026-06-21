import React, { FC } from 'react';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';

const SearchPage: FC = () => {
    return (
        <>
            <SearchInput />
            <SearchResult />
        </>
    );
};

export default SearchPage;
