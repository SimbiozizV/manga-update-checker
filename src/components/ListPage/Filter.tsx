import React, { FC } from 'react';
import SearchForm from '../../baseComponents/SearchForm';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectFilter, setFilterAction } from '../../state/slices/mangaPage';

const Filter: FC = () => {
    const dispatch = useAppDispatch();
    const filter = useAppSelector(selectFilter);

    const handleFilterChange = (value: string) => {
        dispatch(setFilterAction(value));
    };

    return <SearchForm onChange={handleFilterChange} value={filter} />;
};

export default Filter;
