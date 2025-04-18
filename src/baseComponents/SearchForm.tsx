import React, { FC } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

type Props = {
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
};

const SearchForm: FC<Props> = ({ placeholder = 'Название манги', onChange, value }) => {
    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return <Input placeholder={placeholder} prefix={<SearchOutlined />} onChange={change} value={value} allowClear />;
};

export default SearchForm;
