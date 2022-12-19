import { message } from 'antd';
import { DEFAULT_ERROR } from '../constants/text';

type MakeRequest = <T>(
    url: RequestInfo,
    options?: RequestInit & { successMessage?: string; errorMessage?: string; stringType?: boolean }
) => Promise<T>;

const makeRequest: MakeRequest = async (url, options) => {
    let errorMessage = options?.errorMessage || DEFAULT_ERROR;
    try {
        const response = await fetch(url, options);

        if (response.ok) {
            if (options?.successMessage) message.success(options.successMessage);
            return options?.stringType ? await response.text() : await response.json();
        }

        throw new Error(errorMessage);
    } catch (err) {
        if (err instanceof Error) {
            errorMessage = err.message;
            message.error(errorMessage);
        }
    }

    throw new Error(errorMessage);
};

export default makeRequest;
