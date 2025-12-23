/**
 * 通用存储工具函数
 * 提供 localStorage 的通用操作方法
 */

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const readStorageItem = <T>(key: string, defaultValue: T): T => {
  const storage = getStorage();
  if (!storage) return defaultValue;

  try {
    const raw = storage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

export const writeStorageItem = <T>(key: string, value: T): void => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write errors (e.g. quota exceeded)
  }
};

export const removeStorageItem = (key: string): void => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(key);
  } catch {
    // ignore
  }
};

export const clearStorageItem = (key: string): void => {
  removeStorageItem(key);
};

