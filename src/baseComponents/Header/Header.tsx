import React, { FC } from 'react';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import ReloadOutlined from '@ant-design/icons/ReloadOutlined';
import UpCircleOutlined from '@ant-design/icons/UpCircleOutlined';
import styled from '@emotion/styled';
import { Button, Tooltip } from 'antd';
import AddForm from '../../components/AddForm';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useToggle from '../../hooks/useToggle';
import { checkMangaUpdate, selectIsUpdating } from '../../state/slices/mangaPage';

const Title = styled.div`
    font-size: 24px;
    font-weight: bold;
`;

const Wrap = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ButtonsWrap = styled.div`
    display: flex;
    gap: 0 10px;
`;

export const Header: FC = () => {
    const dispatch = useAppDispatch();
    const isUpdating = useAppSelector(selectIsUpdating);
    const [open, toggleOpen] = useToggle(false);

    const onUpdate = () => {
        dispatch(checkMangaUpdate());
    };

    return (
        <>
            <Wrap>
                <Title>Manga update checker</Title>
                <ButtonsWrap>
                    <Tooltip title="Добавить мангу" open={open ? false : undefined}>
                        <Button
                            shape="circle"
                            type="text"
                            icon={open ? <UpCircleOutlined /> : <PlusCircleOutlined />}
                            onClick={toggleOpen}
                        />
                    </Tooltip>
                    <Tooltip title="Проверить обновления">
                        <Button
                            shape="circle"
                            type={isUpdating ? 'primary' : 'text'}
                            icon={<ReloadOutlined />}
                            onClick={onUpdate}
                            loading={isUpdating}
                        />
                    </Tooltip>
                </ButtonsWrap>
            </Wrap>
            {open && <AddForm />}
        </>
    );
};
