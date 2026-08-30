export const STORAGE_KEY = 'mangaUpdater';

export const UPDATE_PROGRESS_STORAGE_KEY = `${STORAGE_KEY}:updateProgress`;

export const CHECK_INTERVAL_STORAGE_KEY = `${STORAGE_KEY}:checkIntervalMinutes`;

export const BATCH_SIZE = 3;

export const CHECK_INTERVAL_MINUTES = 10;

export const UPDATE_PROGRESS_MAX_AGE_MS = 5 * 60 * 1000;

export const STORAGE_SCHEMA_VERSION = 1;

export const CHECK_INTERVAL_OPTIONS = [5, 10, 30, 60] as const;
