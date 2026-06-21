import { message } from 'antd';
import { DEFAULT_ERROR } from '../constants/text';

const makeRequest = async <T>(
    url: RequestInfo,
    options?: RequestInit & { successMessage?: string; errorMessage?: string; stringType?: boolean }
): Promise<T> => {
    const { errorMessage = DEFAULT_ERROR, successMessage } = options || {};
    try {
        const response = await fetch(url, options);

        if (response.ok) {
            if (successMessage) message.success(successMessage);

            if (options?.stringType) {
                return (await response.text()) as T;
            }

            const data: unknown = await response.json();
            return data as T;
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
