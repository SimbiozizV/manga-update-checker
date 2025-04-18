import React, { FC, useCallback } from 'react';
import debounce from 'debounce';
import SearchForm from '../../baseComponents/SearchForm';
import { AppDispatch, useAppDispatch } from '../../hooks';
import { searchMangaByName } from '../../state/slices/searchPage';

const change = debounce((search: string, dispatch: AppDispatch) => {
    dispatch(searchMangaByName(search));
}, 400);

export const SearchInput: FC = () => {
    const dispatch = useAppDispatch();

    const onChange = useCallback(
        (search: string) => {
            change(search, dispatch);
        },
        [dispatch]
    );

    return <SearchForm onChange={onChange} />;
};

export default SearchInput;
