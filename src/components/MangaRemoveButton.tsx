import React, { FC } from 'react';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { CONFIRM_DELETE_TEXT } from '../constants/text';

type Props = { onRemove: () => void };

const MangaRemoveButton: FC<Props> = ({ onRemove }) => {
    return (
        <Popconfirm placement="topRight" title={CONFIRM_DELETE_TEXT} onConfirm={onRemove} okText="Да" cancelText="Нет">
            <Button icon={<DeleteOutlined />} shape="circle" />
        </Popconfirm>
    );
};

export default MangaRemoveButton;
