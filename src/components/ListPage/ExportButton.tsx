import React, { FC, useCallback } from 'react';
import { Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../hooks';
import { selectManga } from '../../state/slices/mangaPage';
import { prepareMangaToExport, makeFileName } from '../../helpers';
const ExportButton: FC = () => {
    const manga = useAppSelector(selectManga);

    const onClick = useCallback(() => {
        const link = document.createElement('a');
        link.setAttribute('download', makeFileName());
        link.href = `data:application/json;charset=utf-8,${btoa(JSON.stringify(prepareMangaToExport(manga)))}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }, [manga]);

    return (
        <Button type="primary" icon={<ExportOutlined />} onClick={onClick}>
            Выгрузить список
        </Button>
    );
};

export default ExportButton;
