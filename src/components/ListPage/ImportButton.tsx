import React, { ChangeEvent, FC, createRef, useCallback } from 'react';
import { ImportOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { importFile, selectIsImported } from '../../state/slices/mangaPage';

const ImportButton: FC = () => {
    const isImported = useAppSelector(selectIsImported);
    const dispatch = useAppDispatch();
    const inputRef = createRef<HTMLInputElement>();

    const onClick = () => {
        inputRef.current!.click();
    };

    const onChange = useCallback(
        ({ target }: ChangeEvent<HTMLInputElement>) => {
            const { files } = target;
            if (files && files.length > 0) {
                const file = files.item(0);
                if (file) {
                    file.text().then(data => {
                        dispatch(importFile(JSON.parse(atob(data))));
                    });
                }
            }
        },
        [dispatch]
    );

    return (
        <>
            <Button type="primary" icon={<ImportOutlined />} onClick={onClick} loading={isImported}>
                Загрузить список
            </Button>
            <input hidden type="file" accept=".json" ref={inputRef} onChange={onChange} />
        </>
    );
};

export default ImportButton;
