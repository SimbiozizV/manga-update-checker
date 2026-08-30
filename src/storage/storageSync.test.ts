import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY, UPDATE_PROGRESS_STORAGE_KEY } from '../constants';
import { getNewChaptersCount, setExtensionIconMode } from '../helpers';
import { subscribeToStorageChanges } from './storageSync';

vi.mock('../helpers', () => ({
    getNewChaptersCount: vi.fn(() => 0),
    setExtensionIconMode: vi.fn(),
}));

type StorageListener = (
    changes: { [key: string]: chrome.storage.StorageChange },
    area: chrome.storage.AreaName
) => void;

let listener: StorageListener | undefined;

Object.assign(globalThis, {
    chrome: {
        storage: {
            onChanged: {
                addListener: vi.fn(callback => {
                    listener = callback;
                }),
                removeListener: vi.fn(),
            },
        },
    },
});

describe('subscribeToStorageChanges', () => {
    const dispatch = vi.fn();

    beforeEach(() => {
        listener = undefined;
        dispatch.mockClear();
        vi.mocked(getNewChaptersCount).mockClear();
        vi.mocked(setExtensionIconMode).mockClear();
    });

    it('ignores progress writes and updates the popup only for a manga list write', () => {
        subscribeToStorageChanges(dispatch);

        listener?.({ [UPDATE_PROGRESS_STORAGE_KEY]: { newValue: { lastIndex: 3 } } }, 'local');
        expect(dispatch).not.toHaveBeenCalled();

        listener?.({ [STORAGE_KEY]: { newValue: { manga: [] } } }, 'local');
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(setExtensionIconMode).toHaveBeenCalledTimes(1);
    });
});
