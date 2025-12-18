import { XRequest, type SSEOutput } from "@ant-design/x-sdk";
import { v4 as uuidv4 } from "uuid";
import { RagChatProvider, type RagRequestParams } from "./RagChatProvider";
import { getOwnerId } from "../_utils/ownerId";

const providerCaches = new Map<string, RagChatProvider>();

// 将前端的 conversationKey 映射为后端需要的 UUID 会话 id
const conversationIdMap = new Map<string, string>();

const getConversationId = (conversationKey: string): string => {
  const existing = conversationIdMap.get(conversationKey);
  if (existing) return existing;

  const newId = uuidv4();
  conversationIdMap.set(conversationKey, newId);
  return newId;
};

export const providerFactory = (conversationKey: string) => {
  if (!providerCaches.get(conversationKey)) {
    providerCaches.set(
      conversationKey,
      new RagChatProvider({
        request: XRequest<RagRequestParams, SSEOutput>(
          "https://inharmoniously-superartificial-remedios.ngrok-free.dev/api/messages",
          {
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
          }
        ),
      })
    );
  }
  return providerCaches.get(conversationKey);
};
