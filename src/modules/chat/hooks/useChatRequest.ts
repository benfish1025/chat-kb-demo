import type { ConversationItemType } from "@ant-design/x";
import type { ChatMessage } from "@/modules/chat/types/chat";
import type { RagRequestMessage } from "@/modules/chat/hooks/RagChatProvider";
import { transformMessagesToHistory } from "@/modules/chat/api/messageTransform";

interface UseChatRequestParams {
  curConversation: string;
  messages: ChatMessage[];
  conversations: ConversationItemType[];
  setConversations: (conversations: ConversationItemType[]) => void;
  onRequest: (params: {
    content: string;
    messages: RagRequestMessage[];
    thinking: { type: "disabled" };
  }) => void;
}

/**
 * 处理聊天请求逻辑
 * 包括创建新会话、转换历史消息等
 */
export const useChatRequest = ({
  curConversation,
  messages,
  conversations,
  setConversations,
  onRequest,
}: UseChatRequestParams) => {
  const handleRequest = (val: string) => {
    // 如果当前会话 key 不在侧边栏列表中，说明是通过「新对话」进入的首页，
    // 此时用户第一次发送消息，需要在侧边栏最上方新增一条记录。
    const exists = conversations.some((item) => item.key === curConversation);

    if (!exists) {
      const title = val.slice(0, 15) || "新对话";
      const createdAt = Date.now();
      setConversations([
        { key: curConversation, label: title, createdAt },
        ...conversations,
      ]);
    }

    // 仅当当前会话仍然存在于会话列表中时，才使用历史消息；
    // 否则视为新会话，不传递任何历史记录
    const baseMessages = conversations.some((item) => item.key === curConversation)
      ? messages
      : [];

    // 构造同一会话下最近 10 条历史记录（不包含本次用户输入）
    const historyMessages = transformMessagesToHistory(baseMessages, 10);

    // content 为本次用户输入；messages 为历史记录
    onRequest({
      content: val,
      messages: historyMessages,
      thinking: {
        type: "disabled",
      },
    });
  };

  return { handleRequest };
};

