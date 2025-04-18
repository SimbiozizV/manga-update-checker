import React, { FC } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Tooltip, Popconfirm } from 'antd';
import { CONFIRM_DELETE_TEXT } from '../../../constants/text';

type Props = { onDelete: () => void; confirmText?: string };

export const DeleteButton: FC<Props> = ({ onDelete, confirmText = CONFIRM_DELETE_TEXT }) => {
    return (
        <Tooltip placement="top" title="Удалить">
            <div>
                <Popconfirm placement="topRight" title={confirmText} onConfirm={onDelete} okText="Да" cancelText="Нет">
                    <Button icon={<DeleteOutlined />} />
                </Popconfirm>
            </div>
        </Tooltip>
    );
};
