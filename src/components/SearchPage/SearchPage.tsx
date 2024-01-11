import React, { FC } from 'react';
import Page from '../../baseComponents/Page';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';

const SearchPage: FC = () => {
    return (
        <Page>
            <SearchInput />
            <SearchResult />
        </Page>
    );
};

export default SearchPage;
