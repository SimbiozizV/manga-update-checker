import React, { ChangeEvent, FC, useRef, useCallback } from 'react';
import ImportOutlined from '@ant-design/icons/ImportOutlined';
import { Button } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { importFile, selectIsImported } from '../../state/slices/mangaPage';
import { ExportItem } from '../../types/ExportItem';

const ImportButton: FC = () => {
    const isImported = useAppSelector(selectIsImported);
    const dispatch = useAppDispatch();
    const inputRef = useRef<HTMLInputElement>(null);

    const onClick = () => {
        inputRef.current!.click();
    };

    const onChange = useCallback(
        ({ target }: ChangeEvent<HTMLInputElement>) => {
            const { files } = target;
            if (files && files.length > 0) {
                const file = files.item(0);
                if (file) {
                    file.text()
                        .then(data => {
                            dispatch(importFile(JSON.parse(atob(data)) as ExportItem[]));
                        })
                        .catch(() => {
                            console.error('Cant import');
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
