import React, { FC } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectFilter, setFilterAction } from '../../state/slices';
const Filter: FC = () => {
    const dispatch = useAppDispatch();
    const filter = useAppSelector(selectFilter);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilterAction(e.target.value));
    };

    return (
        <Input placeholder="Название манги" prefix={<SearchOutlined />} onChange={onChange} value={filter} allowClear />
    );
};

export default Filter;
