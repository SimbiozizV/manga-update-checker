import React, { FC } from 'react';
import { Button, Space } from 'antd';
import { PlusOutlined, LinkOutlined } from '@ant-design/icons';

type Props = {
    onAdd: () => void;
    onOpen: () => void;
};

const SearchResultButtons: FC<Props> = ({ onOpen, onAdd }) => {
    return (
        <Space>
            <Button onClick={onOpen} icon={<LinkOutlined />}>
                Открыть
            </Button>
            <Button onClick={onAdd} icon={<PlusOutlined />}>
                Добавить
            </Button>
        </Space>
    );
};

export default SearchResultButtons;
