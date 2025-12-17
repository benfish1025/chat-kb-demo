import React from "react";
import classNames from "classnames";
import type { BubbleListProps } from "@ant-design/x";
import { MessageList } from "../MessageList";
import { SenderArea } from "../SenderArea";
import type { ChatMessage } from "../../types/chat";
import locale from "../../_utils/local";

interface ChatAreaProps {
  messages: ChatMessage[];
  styles: {
    chat: string;
    chatList: string;
    startPage: string;
    agentName: string;
  };
  role: BubbleListProps["role"];
  curConversation: string;
  isRequesting: boolean;
  onRequest: (val: string) => void;
  onCancel: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  styles,
  role,
  curConversation,
  isRequesting,
  onRequest,
  onCancel,
}) => {
  return (
    <div className={styles.chat}>
      <div className={styles.chatList}>
        {messages?.length !== 0 && <MessageList messages={messages} role={role} />}
        <div
          style={{ width: "100%", maxWidth: 840 }}
          className={classNames({
            [styles.startPage]: messages.length === 0,
          })}
        >
          {messages.length === 0 && <div className={styles.agentName}>{locale.agentName}</div>}
          <SenderArea
            curConversation={curConversation}
            isRequesting={isRequesting}
            onRequest={onRequest}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
};
