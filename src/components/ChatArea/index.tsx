import React, { useEffect, useRef } from "react";
import type { BubbleListProps } from "@ant-design/x";
import { MessageList } from "@/components/MessageList";
import { SenderArea } from "@/components/SenderArea";
import type { ChatMessage } from "@/types/chat";
import brandRobot from "@/assets/brand-robot.png";
import sidebarController from "@/assets/sidebar-controler.svg";
import decorativeCurve from "@/assets/decorative-curve.svg";

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
    sidebarToggle: string;
    welcomeDecorativeCurve: string;
  };
  role: BubbleListProps["role"];
  curConversation: string;
  isRequesting: boolean;
  onRequest: (val: string) => void;
  onCancel: () => void;
  sidebarCollapsed: boolean;
  onSidebarOpen: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  styles,
  role,
  curConversation,
  isRequesting,
  onRequest,
  onCancel,
  sidebarCollapsed,
  onSidebarOpen,
}) => {
  const chatListRef = useRef<HTMLDivElement | null>(null);

  // 每次消息列表变化或 AI 正在输出时，自动滚动到底部
  useEffect(() => {
    const container = chatListRef.current;
    if (!container) return;

    // 使用 requestAnimationFrame 确保在内容渲染完成后再执行滚动
    const id = window.requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });

    return () => {
      window.cancelAnimationFrame(id);
    };
  }, [messages, isRequesting]);

  return (
    <div className={styles.chat}>
      {sidebarCollapsed && (
        <div className={styles.sidebarToggle} onClick={onSidebarOpen}>
          <img
            src={sidebarController}
            width={32}
            height={32}
            alt="open sidebar"
            draggable={false}
          />
        </div>
      )}

      {/* 渐变背景色只在首页显示 */}
      {messages.length === 0 && <div className={styles.senderBackground} />}

      <div className={styles.chatList} ref={chatListRef}>
        {messages?.length !== 0 && <MessageList messages={messages} role={role} />}
        {messages.length === 0 && (
          <div className={styles.welcomeArea}>
            <div className={styles.welcomeContent}>
              <img src={brandRobot} width={275} height={275} alt="Robot" draggable={false} />
              <div className={styles.welcomeText}>
                <div className={styles.welcomeTextLine1}>Hi！我是小K</div>
                <div className={styles.welcomeTextLine2}>遇到什么疑问，尽管问我</div>
                <div className="app-styled-decorative-curve">
                  <img
                    src={decorativeCurve}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                  />
                </div>
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
        <div className="sender-footer">
          <span>内容由AI生成，仅供参考</span>
        </div>
      </div>
    </div>
  );
};
