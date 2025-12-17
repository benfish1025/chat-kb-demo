import type { DefaultMessageInfo, XModelMessage } from "@ant-design/x-sdk";
import locale from "../_utils/local";

export const HISTORY_MESSAGES: {
  [key: string]: DefaultMessageInfo<XModelMessage>[];
} = {
  "default-2": [
    {
      message: { role: "user", content: locale.newAgiHybridInterface },
      status: "success",
    },
    {
      message: {
        role: "assistant",
        content: locale.aiMessage_1,
      },
      status: "success",
    },
  ],
};

export const historyMessageFactory = (
  conversationKey: string
): DefaultMessageInfo<XModelMessage>[] => {
  return HISTORY_MESSAGES[conversationKey] || [];
};
