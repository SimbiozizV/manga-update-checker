import React, { FC } from 'react';
import { Button, Form, Input } from 'antd';
import styled from '@emotion/styled';
import { addManga } from '../state/slices';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Store } from '../types/Store';
import { PlusOutlined } from '@ant-design/icons';

const StyledForm = styled(Form)`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr min-content;

    .ant-form-item {
        margin-bottom: 15px;
    }
`;

const selector = (state: Store) => state.isAdding;

const AddForm: FC = () => {
    const isAdding = useAppSelector(selector);
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
