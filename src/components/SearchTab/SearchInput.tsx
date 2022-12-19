import React, { FC, useCallback } from 'react';
import { AppDispatch, useAppDispatch } from '../../hooks';
import debounce from 'debounce';
import { searchMangaByName } from '../../state/slices/searchTab';
import SearchForm from '../../baseComponents/SearchForm';

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
