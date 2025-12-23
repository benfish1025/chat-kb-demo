import type { ConversationItemType } from "@ant-design/x";
import { readStorageItem, writeStorageItem } from "@/common/utils/storage";

const STORAGE_KEY_CONVERSATIONS = "chatkb:conversations:v1";

export const loadConversationsFromStorage = (): ConversationItemType[] => {
  return readStorageItem<ConversationItemType[]>(STORAGE_KEY_CONVERSATIONS, []);
};

export const saveConversationsToStorage = (conversations: ConversationItemType[]): void => {
  writeStorageItem(STORAGE_KEY_CONVERSATIONS, conversations ?? []);
};

