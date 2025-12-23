import type { ChatMessage } from "@/modules/chat/types/chat";
import type { RagRequestMessage } from "@/modules/chat/hooks/RagChatProvider";

/**
 * 将 ChatMessage 数组转换为 RagRequestMessage 数组
 * 用于构造发送给后端的消息历史记录
 */
export const transformMessagesToHistory = (
  messages: ChatMessage[],
  limit: number = 10
): RagRequestMessage[] => {
  return messages
    .map((item) => {
      const role = item?.message?.role;
      if (role !== "user" && role !== "assistant") {
        return null;
      }
      const rawContent = item?.message?.content;
      const content =
        typeof rawContent === "string" ? rawContent : rawContent?.text || "";
      if (!content) {
        return null;
      }
      return {
        role,
        content,
      } as RagRequestMessage;
    })
    .filter((m): m is RagRequestMessage => !!m)
    .slice(-limit);
};

