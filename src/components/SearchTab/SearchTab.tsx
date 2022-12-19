import React, { FC } from 'react';
import SearchInput from './SearchInput';
import TabWrap from '../../baseComponents/TabWrap';
import SearchResult from './SearchResult';

const SearchTab: FC = () => {
    return (
        <TabWrap>
            <SearchInput />
            <SearchResult />
        </TabWrap>
    );
};

export default SearchTab;
