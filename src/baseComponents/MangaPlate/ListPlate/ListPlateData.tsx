import React, { FC, useMemo } from 'react';
import { Flex, Typography } from 'antd';
import { SourceType } from '../../../enum';
import { getEntries } from '../../../helpers/getEntries';
import { Manga } from '../../../types/Manga';
import { SourceIcon } from './SourceIcon';

type Props = {
    manga: Manga;
    onSourceClick: (source: SourceType) => void;
};

export const ListPlateData: FC<Props> = ({ manga, onSourceClick }) => {
    const maxChapter = useMemo(() => {
        return Object.values(manga.mirrors).reduce((acc, { lastChapter }) => {
            return Math.max(acc, Number(lastChapter));
        }, 0);
    }, [manga.mirrors]);

    return (
        <Flex vertical gap="small">
            <Typography.Title level={5} style={{ margin: 0 }}>
                {manga.title}
            </Typography.Title>
            <div>
                <Typography.Text strong>Прочитано:</Typography.Text> {manga.prevChapter} из {maxChapter}
            </div>
            <Flex gap="small">
                {getEntries(manga.mirrors).map(([source, mirror]) => (
                    <SourceIcon
                        key={source}
                        source={source}
                        lastChapter={mirror?.lastChapter}
                        onClick={onSourceClick}
                    />
                ))}
            </Flex>
        </Flex>
    );
};
