import { useEffect } from "react";
import type { ChatMessage } from "@/modules/chat/types/chat";
import type { ConversationItemType } from "@ant-design/x";

/**
 * 自动更新会话标题
 * 当服务端返回自动标题（title 事件）时，在首轮对话后更新会话标题
 */
export const useAutoTitleUpdate = (
  curConversation: string,
  messages: ChatMessage[],
  conversations: ConversationItemType[],
  setConversations: (conversations: ConversationItemType[]) => void
) => {
  useEffect(() => {
    if (!curConversation) return;
    if (!conversations || conversations.length === 0) return;

    // 找到最新一条包含自动标题的助手消息
    const lastWithTitle = [...messages]
      .reverse()
      .find(
        (item) =>
          item?.message?.role === "assistant" &&
          item?.message?.extraInfo?.title
      );

    const newTitle = lastWithTitle?.message?.extraInfo?.title as string | undefined;
    if (!newTitle || !newTitle.trim()) return;

    const index = conversations.findIndex((c) => c.key === curConversation);
    if (index === -1) return;

    const current = conversations[index];
    if (current.label === newTitle) return;

    const next = [...conversations];
    // 更新标题时保留 createdAt 字段
    next[index] = { ...current, label: newTitle };
    setConversations(next);
  }, [messages, conversations, curConversation, setConversations]);
};

