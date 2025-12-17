import React from "react";
import type { BubbleListProps } from "@ant-design/x";
import { MessageList } from "../MessageList";
import { SenderArea } from "../SenderArea";
import type { ChatMessage } from "../../types/chat";
import brandRobot from "../../assets/brand-robot.svg";

interface ChatAreaProps {
  messages: ChatMessage[];
  styles: {
    chat: string;
    chatList: string;
    startPage: string;
    agentName: string;

    senderContainer: string;
    senderBackground: string;
    welcomeArea: string;
    welcomeContent: string;
    welcomeText: string;
    welcomeTextLine1: string;
    welcomeTextLine2: string;
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
      {messages.length === 0 && <div className={styles.senderBackground} />}
      <div className={styles.chatList}>
        {messages?.length !== 0 && <MessageList messages={messages} role={role} />}
        {messages.length === 0 && (
          <div className={styles.welcomeArea}>
            <div className={styles.welcomeContent}>
              <img src={brandRobot} alt="Robot" draggable={false} />
              <div className={styles.welcomeText}>
                <div className={styles.welcomeTextLine1}>Hi！我是小K</div>
                <div className={styles.welcomeTextLine2}>遇到什么疑问，尽管提问</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.senderContainer}>
        <SenderArea
          curConversation={curConversation}
          isRequesting={isRequesting}
          onRequest={onRequest}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};
