import { v4 as uuidv4 } from "uuid";

/**
 * 生成新的会话 UUID
 * conversationKey 现在直接使用 UUID，不再需要映射关系
 */
export const generateConversationId = (): string => {
  return uuidv4();
};

