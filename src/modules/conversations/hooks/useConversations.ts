import { useEffect, useMemo, useCallback } from "react";
import { useXConversations } from "@ant-design/x-sdk";
import type { ConversationItemType } from "@ant-design/x";
import {
  loadConversationsFromStorage,
  saveConversationsToStorage,
} from "@/modules/conversations/api/storage";

/**
 * 对会话列表按 createdAt 降序排序（最新的在前）
 */
const sortConversationsByCreatedAt = (conversations: ConversationItemType[]): ConversationItemType[] => {
  return [...conversations].sort((a, b) => {
    const aTime = (a as any).createdAt || 0;
    const bTime = (b as any).createdAt || 0;
    return bTime - aTime; // 降序：最新的在前
  });
};

export const useConversations = () => {
  const storedConversations = loadConversationsFromStorage();
  const defaultConversations = useMemo(() => {
    const conversations =
      storedConversations && storedConversations.length > 0
        ? storedConversations
        : [];
    // 加载时排序
    return sortConversationsByCreatedAt(conversations);
  }, []);

  const { conversations, setConversations: setConversationsRaw } = useXConversations({
    defaultConversations,
  });

  // 包装 setConversations，确保每次设置时都自动排序
  const setConversations = useCallback(
    (newConversations: ConversationItemType[]) => {
      const sorted = sortConversationsByCreatedAt(newConversations);
      setConversationsRaw(sorted);
    },
    [setConversationsRaw]
  );

  // 持久化会话列表
  useEffect(() => {
    if (!conversations) return;
    saveConversationsToStorage(conversations);
  }, [conversations]);

  return {
    conversations,
    setConversations,
  };
};

