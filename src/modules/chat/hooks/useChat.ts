import { useMemo } from "react";
import { useXChat } from "@ant-design/x-sdk";
import { providerFactory } from "@/modules/chat/hooks/useProvider";
import { loadMessages } from "@/modules/chat/api/messages";

export const useChat = (curConversation: string) => {
  const defaultMessages = useMemo(() => {
    if (!curConversation) return [];

    const stored = loadMessages(curConversation);
    if (stored && stored.length > 0) {
      return stored;
    }
    return [];
  }, [curConversation]);

  const { onRequest, messages, isRequesting, abort, onReload } = useXChat({
    provider: providerFactory(curConversation),
    conversationKey: curConversation,
    defaultMessages,
    requestPlaceholder: () => {
      return {
        content: "暂无数据",
        role: "assistant",
      };
    },
    requestFallback: (_, { messageInfo }) => {
      return {
        ...messageInfo?.message,
        content: messageInfo?.message.content || "请求失败，请重试！",
      };
    },
  });

  return {
    onRequest,
    messages,
    isRequesting,
    abort,
    onReload,
  };
};

