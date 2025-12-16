import React from "react";
import { Bubble } from "@ant-design/x";
import type { BubbleListProps } from "@ant-design/x";
import type { ChatMessage } from "../../types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  role: BubbleListProps["role"];
}

export const MessageList: React.FC<MessageListProps> = ({ messages, role }) => {
  return (
    <Bubble.List
      style={{
        height: "calc(100% - 160px)",
      }}
      items={messages
        ?.filter((i) => i.id)
        .map((i) => ({
          ...i.message,
          key: i.id!,
          status: i.status,
          loading: i.status === "loading",
          extraInfo: i.message.extraInfo,
        }))}
      styles={{
        root: {
          marginBlockEnd: 24,
        },
        bubble: { maxWidth: 840 },
      }}
      role={role}
    />
  );
};
