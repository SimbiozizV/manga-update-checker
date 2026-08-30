import { afterEach, describe, expect, it, vi } from 'vitest';
import httpClient, { HttpError, RequestTimeoutError } from './httpClient';

describe('httpClient', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('retries a 5xx response once', async () => {
        const fetchMock = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce({ ok: false, status: 503 } as Response)
            .mockResolvedValueOnce({ ok: true, json: async () => ({ value: 'ok' }) } as Response);

        await expect(httpClient('https://example.test', { retryDelayMs: 0 })).resolves.toEqual({ value: 'ok' });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('does not retry a 4xx response', async () => {
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 404 } as Response);

        await expect(httpClient('https://example.test')).rejects.toEqual(expect.any(HttpError));
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('retries a timed out request once', async () => {
        vi.useFakeTimers();
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((_url, options) => {
            return new Promise((_resolve, reject) => {
                (options?.signal as AbortSignal).addEventListener('abort', () =>
                    reject(new DOMException('Aborted', 'AbortError'))
                );
            });
        });

        const request = httpClient('https://example.test', { timeoutMs: 15, retryDelayMs: 0 });
        const assertion = expect(request).rejects.toEqual(expect.any(RequestTimeoutError));

        await vi.advanceTimersByTimeAsync(31);
        await assertion;
        expect(fetchMock).toHaveBeenCalledTimes(2);
        vi.useRealTimers();
    });
});
