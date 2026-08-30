export class HttpError extends Error {
    constructor(public status: number) {
        super(`HTTP error ${status}`);
        this.name = 'HttpError';
    }
}

export class RequestTimeoutError extends Error {
    constructor(timeoutMs: number) {
        super(`Request timed out after ${timeoutMs}ms`);
        this.name = 'RequestTimeoutError';
    }
}

type HttpClientOptions = RequestInit & {
    stringType?: boolean;
    retries?: number;
    retryDelayMs?: number;
    timeoutMs?: number;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isRetryable = (error: unknown): boolean => {
    if (error instanceof HttpError) {
        return error.status >= 500;
    }
    return error instanceof RequestTimeoutError || error instanceof TypeError;
};

const httpClient = async <T>(url: RequestInfo, options?: HttpClientOptions): Promise<T> => {
    const { stringType, retries = 1, retryDelayMs = 2000, timeoutMs = 15_000, signal, ...fetchOptions } = options || {};
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController();
        let timedOut = false;
        const abortFromCaller = () => controller.abort();
        const timeout = setTimeout(() => {
            timedOut = true;
            controller.abort();
        }, timeoutMs);

        if (signal) {
            if (signal.aborted) {
                controller.abort();
            } else {
                signal.addEventListener('abort', abortFromCaller, { once: true });
            }
        }

        try {
            const response = await fetch(url, { ...fetchOptions, signal: controller.signal });

            if (!response.ok) {
                throw new HttpError(response.status);
            }

            return (stringType ? await response.text() : await response.json()) as T;
        } catch (error) {
            lastError = timedOut ? new RequestTimeoutError(timeoutMs) : error;
            if (attempt < retries && isRetryable(lastError)) {
                await sleep(retryDelayMs);
                continue;
            }
            throw lastError;
        } finally {
            clearTimeout(timeout);
            signal?.removeEventListener('abort', abortFromCaller);
        }
    }

    throw lastError;
};

export default httpClient;
