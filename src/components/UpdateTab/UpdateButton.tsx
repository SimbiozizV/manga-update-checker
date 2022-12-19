import React, { FC } from 'react';
import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { checkMangaUpdate, selectIsUpdating } from '../../state/slices/mangaTab';

const UpdateButton: FC = () => {
    const dispatch = useAppDispatch();
    const isUpdating = useAppSelector(selectIsUpdating);

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
