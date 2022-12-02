import React, { FC, useCallback } from 'react';
import { Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../hooks';
import { Manga } from '../../types/Manga';
import { ExportItem } from '../../types/ExportItem';

const prepareMangaList = (manga: Manga[]): ExportItem[] => {
    return manga.map(({ url, lastChapter, source }) => ({ url, lastChapter, source }));
};

const makeFileName = () => {
    const now = new Date();
    return `manga-export_${now.toLocaleString('ru-RU').split(',')[0].replace(/\./g, '-')}.json`;
};

const ExportButton: FC = () => {
    const manga = useAppSelector(state => state.manga);

    const onClick = useCallback(() => {
        const link = document.createElement('a');
        link.setAttribute('download', makeFileName());
        link.href = `data:text/html;charset=utf-8,${btoa(JSON.stringify(prepareMangaList(manga)))}`;
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
