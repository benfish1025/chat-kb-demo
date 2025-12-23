import { XRequest, type SSEOutput } from "@ant-design/x-sdk";
import { RagChatProvider, type RagRequestParams } from "@/modules/chat/hooks/RagChatProvider";
import { getOwnerId } from "@/common/utils/ownerId";
import { apiHost } from "@/modules/chat/api/config";
import {
  getOrSetConversationId,
  loadConversationIdMap,
} from "@/modules/chat/api/conversationId";

const providerCaches = new Map<string, RagChatProvider>();

// 将前端的 conversationKey 映射为后端需要的 UUID 会话 id
// 从 localStorage 恢复映射关系
const conversationIdMap = new Map<string, string>(
  Object.entries(loadConversationIdMap())
);

const getConversationId = (conversationKey: string): string => {
  // 先从内存缓存中查找
  const existing = conversationIdMap.get(conversationKey);
  if (existing) return existing;

  // 如果内存中没有，从 localStorage 获取或创建新的
  const id = getOrSetConversationId(conversationKey);
  conversationIdMap.set(conversationKey, id);

  return id;
};

export const providerFactory = (conversationKey: string) => {
  if (!providerCaches.get(conversationKey)) {
    providerCaches.set(
      conversationKey,
      new RagChatProvider({
        request: XRequest<RagRequestParams, SSEOutput>(`${apiHost}/api/messages`, {
          manual: true,
          // 默认参数中带上会话 id，方便后端按会话追踪（后端要求是 UUID）
          params: {
            id: getConversationId(conversationKey),
            stream: true,
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            "X-Owner-Id": getOwnerId(),
          },
        }),
      })
    );
  }
  return providerCaches.get(conversationKey);
};

