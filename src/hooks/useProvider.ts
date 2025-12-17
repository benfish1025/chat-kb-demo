import { XRequest, type SSEOutput } from "@ant-design/x-sdk";
import { RagChatProvider, type RagRequestParams } from "./RagChatProvider";
// import { getOwnerId } from "../_utils/ownerId";

const providerCaches = new Map<string, RagChatProvider>();

export const providerFactory = (conversationKey: string) => {
  if (!providerCaches.get(conversationKey)) {
    providerCaches.set(
      conversationKey,
      new RagChatProvider({
        request: XRequest<RagRequestParams, SSEOutput>("/api/messages", {
          manual: true,
          // 默认参数中带上会话 id，方便后端按会话追踪
          params: {
            id: conversationKey,
            stream: true,
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            // "X-Owner-Id": getOwnerId(),
          },
        }),
      })
    );
  }
  return providerCaches.get(conversationKey);
};
