import React, { ChangeEvent, FC } from 'react';
import { CheckOutlined, CloseOutlined, ExportOutlined } from '@ant-design/icons';
import { Input, Flex, Button, Typography } from 'antd';
import { CONFIRM_DELETE_MIRROR } from '../../../constants/text';
import { SourceType } from '../../../enum';
import { getIconBySource } from '../../../helpers';
import { Mirror } from '../../../types/Manga';
import { DeleteButton } from './DeleteButton';

type Props = {
    source: SourceType;
    mirror: Mirror;
    onSave: (url: string) => void;
    onCancel: () => void;
    onDelete: (source: SourceType) => void;
};

export const SourceEditForm: FC<Props> = ({ source, mirror, onSave, onCancel, onDelete }) => {
    const [url, setUrl] = React.useState(mirror.url);

    const handleChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setUrl(e.target.value);
    };

    const handleSave = () => {
        onSave(url);
    };

    const handleDelete = () => {
        onDelete(source);
    };

    return (
        <Flex vertical gap="small">
            <Flex gap="small" align="center">
                <Typography.Text strong>Ссылка на источник:</Typography.Text>{' '}
                <img src={getIconBySource(source as SourceType)} alt="icon" />[{mirror.lastChapter}]
                <Typography.Link href={mirror.url} target="_blank">
                    <ExportOutlined />
                </Typography.Link>
            </Flex>
            <Input.TextArea value={url} onChange={handleChangeValue} />
            <Flex gap="small" align="center" justify="flex-end">
                <DeleteButton onDelete={handleDelete} confirmText={CONFIRM_DELETE_MIRROR} />
                <Button type="primary" icon={<CheckOutlined />} onClick={handleSave} />
                <Button icon={<CloseOutlined />} onClick={onCancel} />
            </Flex>
        </Flex>
    );
};
