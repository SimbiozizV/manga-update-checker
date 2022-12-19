import React, { FC } from 'react';
import { Button, Form, Input } from 'antd';
import styled from '@emotion/styled';
import { addManga, selectIsAdding } from '../state/slices/mangaTab';
import { useAppDispatch, useAppSelector } from '../hooks';
import { PlusOutlined } from '@ant-design/icons';

const StyledForm = styled(Form)`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr min-content;

    .ant-input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .ant-btn {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
`;

const AddForm: FC = () => {
    const isAdding = useAppSelector(selectIsAdding);
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const onFinish = () => {
        const data: { url: string } = form.getFieldsValue();
        dispatch(addManga(data.url));
        form.resetFields();
    };

    return (
        <StyledForm form={form} onFinish={onFinish}>
            <Form.Item name="url" rules={[{ required: true, message: 'заполните url' }]}>
                <Input placeholder="https://readmanga.live/XXXX" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isAdding} icon={<PlusOutlined />}>
                    Добавить
                </Button>
            </Form.Item>
        </StyledForm>
    );
};

export default AddForm;
