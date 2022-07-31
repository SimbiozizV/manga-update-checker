import React, { FC } from 'react';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

type Props = { onRemove: () => void };

const MangaRemoveButton: FC<Props> = ({ onRemove }) => {
    return (
        <Popconfirm
            placement="topRight"
            title="Вы точно хотите удалить мангу?"
            onConfirm={onRemove}
            okText="Да"
            cancelText="Нет"
        >
            <Button icon={<DeleteOutlined />} shape="circle" />
        </Popconfirm>
    );
};

export default MangaRemoveButton;
