import { message } from 'antd';
import { DEFAULT_ERROR } from '../constants/text';

type MakeRequest = <T>(
    url: RequestInfo,
    options?: RequestInit & { successMessage?: string; errorMessage?: string; stringType?: boolean }
) => Promise<T>;

const makeRequest: MakeRequest = async (url, options) => {
    const { errorMessage = DEFAULT_ERROR, successMessage } = options || {};
    try {
        const response = await fetch(url, options);

        if (response.ok) {
            if (successMessage) message.success(successMessage);
            return options?.stringType ? await response.text() : await response.json();
        }

        throw new Error(errorMessage);
    } catch (err) {
        if (err instanceof Error) {
            message.error(errorMessage);
        }

        throw err;
    }
};

export default makeRequest;
