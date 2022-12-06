import React, { FC } from 'react';
import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Store } from '../../types/Store';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { checkMangaUpdate } from '../../state/slices';

const selector = (state: Store) => state.isUpdating;

const UpdateButton: FC = () => {
    const dispatch = useAppDispatch();
    const isUpdating = useAppSelector(selector);

    const onUpdate = () => {
        dispatch(checkMangaUpdate());
    };

    return (
        <Button type="primary" onClick={onUpdate} loading={isUpdating} icon={<ReloadOutlined />}>
            Проверить обновления
        </Button>
    );
};

export default UpdateButton;
