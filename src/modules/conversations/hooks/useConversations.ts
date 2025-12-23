import { useEffect } from "react";
import { useXConversations } from "@ant-design/x-sdk";
import {
  loadConversationsFromStorage,
  saveConversationsToStorage,
} from "@/modules/conversations/api/storage";

export const useConversations = () => {
  const storedConversations = loadConversationsFromStorage();
  const defaultConversations =
    storedConversations && storedConversations.length > 0
      ? storedConversations
      : [];

  const { conversations, setConversations } = useXConversations({
    defaultConversations,
  });

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

