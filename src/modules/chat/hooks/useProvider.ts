import { XRequest, type SSEOutput } from "@ant-design/x-sdk";
import { RagChatProvider, type RagRequestParams } from "@/modules/chat/hooks/RagChatProvider";
import { getOwnerId } from "@/common/utils/ownerId";
import { apiHost } from "@/modules/chat/api/config";

const providerCaches = new Map<string, RagChatProvider>();

export const providerFactory = (conversationKey: string) => {
  if (!providerCaches.get(conversationKey)) {
    providerCaches.set(
      conversationKey,
      new RagChatProvider({
        request: XRequest<RagRequestParams, SSEOutput>(`${apiHost}/api/messages`, {
          manual: true,
          // conversationKey 现在直接就是 UUID，直接使用
          params: {
            id: conversationKey,
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

