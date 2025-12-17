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
        width: "100%",
        paddingTop: 24,
        paddingBottom: 24,
        boxSizing: "border-box",
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
          width: "100%",
        },
        bubble: {
          maxWidth: 960,
          margin: "0 auto 24px",
          background: "transparent",
          boxShadow: "none",
          border: "none",
          padding: 0,
        },
      }}
      role={role}
    />
  );
};
