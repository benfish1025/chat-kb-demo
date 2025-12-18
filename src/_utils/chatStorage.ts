import type { ChatMessage } from "../types/chat";
import type { ConversationItemType } from "@ant-design/x";

const STORAGE_KEY_MESSAGES = "chatkb:messages:v1";
const STORAGE_KEY_CONVERSATIONS = "chatkb:conversations:v1";

type MessagesRecord = Record<string, ChatMessage[]>;

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

const readMessagesRecord = (): MessagesRecord => {
  const storage = getStorage();
  if (!storage) return {};

  try {
    const raw = storage.getItem(STORAGE_KEY_MESSAGES);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as MessagesRecord;
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
};

const writeMessagesRecord = (record: MessagesRecord) => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(record));
  } catch {
    // ignore write errors (e.g. quota exceeded)
  }
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
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(STORAGE_KEY_MESSAGES);
  } catch {
    // ignore
  }
};

export const loadConversationsFromStorage = (): ConversationItemType[] => {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(STORAGE_KEY_CONVERSATIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ConversationItemType[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

export const saveConversationsToStorage = (conversations: ConversationItemType[]): void => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(conversations ?? []));
  } catch {
    // ignore
  }
};

