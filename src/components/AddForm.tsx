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
`;

const selector = (state: Store) => state.isAdding;

const AddForm: FC = () => {
    const isAdding = useAppSelector(selector);
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const onFinish = async (data: { url: string }) => {
        form.resetFields();
        dispatch(addManga(data.url));
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
