import React, { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectFilter, setFilterAction } from '../../state/slices/mangaTab';
import SearchForm from '../../baseComponents/SearchForm';
const Filter: FC = () => {
    const dispatch = useAppDispatch();
    const filter = useAppSelector(selectFilter);
    const onChange = (value: string) => {
        dispatch(setFilterAction(value));
    };

    return <SearchForm onChange={onChange} value={filter} />;
};

export default Filter;
