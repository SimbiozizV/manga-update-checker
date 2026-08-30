import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Select, message } from 'antd';
import MangaStorage from '../../class/MangaStorage';
import { CHECK_INTERVAL_OPTIONS, CHECK_INTERVAL_MINUTES, STORAGE_KEY } from '../../constants';
import { CHECK_INTERVAL_TEXT } from '../../constants/text';

const mangaStorage = new MangaStorage(STORAGE_KEY);

const Wrap = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
`;

const CheckIntervalSelect: FC = () => {
    const [interval, setCheckInterval] = useState(CHECK_INTERVAL_MINUTES);

    useEffect(() => {
        mangaStorage.getStorage().then(storage => {
            setCheckInterval(storage.checkIntervalMinutes ?? CHECK_INTERVAL_MINUTES);
        });
    }, []);

    const handleChange = async (value: number) => {
        setCheckInterval(value);
        await mangaStorage.setCheckIntervalMinutes(value);
        await chrome.runtime.sendMessage({ type: 'updateCheckInterval' });
        message.success(CHECK_INTERVAL_TEXT.saved);
    };

    return (
        <Wrap>
            <span>{CHECK_INTERVAL_TEXT.label}:</span>
            <Select<number>
                value={interval}
                onChange={handleChange}
                style={{ width: 120 }}
                options={CHECK_INTERVAL_OPTIONS.map(value => ({
                    value,
                    label: `${value} мин`,
                }))}
            />
        </Wrap>
    );
};

export default CheckIntervalSelect;
