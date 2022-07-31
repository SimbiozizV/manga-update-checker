import { message } from 'antd';

type MakeRequest = (
    url: RequestInfo,
    options?: RequestInit & { successMessage?: string; errorMessage?: string }
) => Promise<string>;

const makeRequest: MakeRequest = async (url, options) => {
    let errorMessage = options?.errorMessage || 'Что-то пошло не так';
    try {
        const response = await fetch(url, options);

        if (response.ok) {
            if (options?.successMessage) message.success(options.successMessage);
            return await response.text();
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
