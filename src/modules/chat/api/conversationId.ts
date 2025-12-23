import { v4 as uuidv4 } from "uuid";
import { readStorageItem, writeStorageItem } from "@/common/utils/storage";

const STORAGE_KEY_CONVERSATION_ID_MAP = "chatkb:conversationIdMap:v1";

type ConversationIdMap = Record<string, string>;

/**
 * 加载 conversationKey 到 UUID 的映射关系
 */
export const loadConversationIdMap = (): ConversationIdMap => {
  return readStorageItem<ConversationIdMap>(STORAGE_KEY_CONVERSATION_ID_MAP, {});
};

/**
 * 保存 conversationKey 到 UUID 的映射关系
 */
export const saveConversationIdMap = (map: ConversationIdMap): void => {
  writeStorageItem(STORAGE_KEY_CONVERSATION_ID_MAP, map);
};

/**
 * 获取或设置 conversationKey 对应的 UUID
 */
export const getOrSetConversationId = (conversationKey: string): string => {
  const map = loadConversationIdMap();
  if (map[conversationKey]) {
    return map[conversationKey];
  }

  // 生成新的 UUID（使用标准的 UUID v4 格式）
  const newId = uuidv4();
  map[conversationKey] = newId;
  saveConversationIdMap(map);
  return newId;
};

