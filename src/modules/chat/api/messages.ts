import type { ChatMessage } from "@/modules/chat/types/chat";
import { readStorageItem, writeStorageItem, removeStorageItem } from "@/common/utils/storage";

const STORAGE_KEY_MESSAGES = "chatkb:messages:v1";

type MessagesRecord = Record<string, ChatMessage[]>;

const readMessagesRecord = (): MessagesRecord => {
  return readStorageItem<MessagesRecord>(STORAGE_KEY_MESSAGES, {});
};

const writeMessagesRecord = (record: MessagesRecord) => {
  writeStorageItem(STORAGE_KEY_MESSAGES, record);
};

export const loadMessages = (conversationKey: string): ChatMessage[] => {
  if (!conversationKey) return [];

  const record = readMessagesRecord();
  const list = record[conversationKey];

  if (!Array.isArray(list)) {
    return [];
  }

  return list;
};

export const saveMessages = (conversationKey: string, messages: ChatMessage[]): void => {
  if (!conversationKey) return;

  const record = readMessagesRecord();
  record[conversationKey] = messages ?? [];
  writeMessagesRecord(record);
};

export const removeConversationMessages = (conversationKey: string): void => {
  if (!conversationKey) return;

  const record = readMessagesRecord();
  if (record[conversationKey]) {
    delete record[conversationKey];
    writeMessagesRecord(record);
  }
};

export const clearAllMessages = (): void => {
  removeStorageItem(STORAGE_KEY_MESSAGES);
};

