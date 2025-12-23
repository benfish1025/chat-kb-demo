import React from "react";
import { Bubble } from "@ant-design/x";
import type { ChatMessage } from "@/modules/chat/types/chat";
import { useMarkdownTheme } from "@/common/hooks/useMarkdownTheme";
import { MessageFooter } from "@/modules/chat/components/MessageList/MessageFooter.tsx";
import { MessageContent } from "@/modules/chat/components/MessageList/MessageContent.tsx";

interface MessageListProps {
  messages: ChatMessage[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const [className] = useMarkdownTheme();
  const orderedMessages = [...(messages ?? [])].filter((i) => i.id).reverse();

  return (
    <Bubble.List
      style={{
        width: "100%",
        paddingTop: 24,
        paddingBottom: 30,
        boxSizing: "border-box",
      }}
      items={orderedMessages.map((i) => ({
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
          maxWidth: 896,
          margin: "0 auto 24px",
          background: "transparent",
          boxShadow: "none",
          border: "none",
          padding: 0,
        },
      }}
      role={{
        assistant: {
          placement: "start",
          footer: (content, info) => <MessageFooter content={content} info={info} />,
          contentRender: (content: string, info) => (
            <MessageContent content={content} className={className} info={info} />
          ),
        },
        user: { placement: "end" },
      }}
    />
  );
};

