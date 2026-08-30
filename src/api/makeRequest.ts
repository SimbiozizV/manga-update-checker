import { message } from 'antd';
import { DEFAULT_ERROR } from '../constants/text';
import httpClient from './httpClient';

type MakeRequest = <T>(
    url: RequestInfo,
    options?: RequestInit & { successMessage?: string; errorMessage?: string; stringType?: boolean }
) => Promise<T>;

const makeRequest: MakeRequest = async <T>(
    url: RequestInfo,
    options?: RequestInit & { successMessage?: string; errorMessage?: string; stringType?: boolean }
) => {
    const { errorMessage = DEFAULT_ERROR, successMessage, stringType, ...fetchOptions } = options || {};

    try {
        const result = await httpClient<T>(url, { ...fetchOptions, stringType });
        if (successMessage) message.success(successMessage);
        return result;
    } catch (err) {
        message.error(errorMessage);
        throw err;
    }
};

export default makeRequest;
