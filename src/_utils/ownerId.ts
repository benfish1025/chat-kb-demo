import { v4 as uuidv4 } from "uuid";

const OWNER_ID_KEY = "X-Owner-Id";

/**
 * 获取或生成当前浏览器的 X-Owner-Id
 * - 每个浏览器一个 ID
 * - 持久化在 localStorage 中
 */
export const getOwnerId = (): string => {
  if (typeof window === "undefined") {
    // SSR 场景兜底生成一个，但不会持久化
    return uuidv4();
  }

  try {
    const existing = window.localStorage.getItem(OWNER_ID_KEY);
    if (existing && existing.trim()) {
      return existing;
    }

    const newId = uuidv4();
    window.localStorage.setItem(OWNER_ID_KEY, newId);
    return newId;
  } catch {
    // localStorage 不可用时，退化为内存级 uuid
    return uuidv4();
  }
};


