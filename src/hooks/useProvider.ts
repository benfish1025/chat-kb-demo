import {
  DeepSeekChatProvider,
  type SSEFields,
  type XModelParams,
  type XModelResponse,
  XRequest,
} from "@ant-design/x-sdk";

const providerCaches = new Map<string, DeepSeekChatProvider>();

export const providerFactory = (conversationKey: string) => {
  if (!providerCaches.get(conversationKey)) {
    providerCaches.set(
      conversationKey,
      new DeepSeekChatProvider({
        request: XRequest<XModelParams, Partial<Record<SSEFields, XModelResponse>>>(
          "https://api.x.ant.design/api/big_model_glm-4.5-flash",
          {
            manual: true,
            params: {
              stream: true,
              model: "glm-4.5-flash",
            },
          }
        ),
      })
    );
  }
  return providerCaches.get(conversationKey);
};
