import { useEffect } from "react";
import type { ChatMessage } from "@/modules/chat/types/chat";
import type { ConversationItemType } from "@ant-design/x";
import { saveMessages } from "@/modules/chat/api/messages";

/**
 * 处理聊天消息的持久化逻辑
 * 只有当会话存在于会话列表中时才持久化消息
 */
export const useChatPersistence = (
  curConversation: string,
  messages: ChatMessage[],
  conversations: ConversationItemType[]
) => {
  useEffect(() => {
    if (!curConversation) return;
    // 只有当当前会话仍然存在于会话列表中时，才持久化消息
    const exists = conversations.some((item) => item.key === curConversation);
    if (!exists) return;
    saveMessages(curConversation, messages);
  }, [curConversation, messages, conversations]);
};

