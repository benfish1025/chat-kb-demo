import React from "react";
import { MessageList } from "@/modules/chat/components/MessageList";
import { SenderArea } from "@/modules/chat/components/SenderArea";
import { WelcomeScreen } from "@/modules/chat/components/WelcomeScreen";
import sidebarController from "@/assets/sidebar-controler.svg";
import { useAppStyles } from "@/common/styles/useAppStyles";
import { useSidebar } from "@/modules/conversations/contexts/SidebarContext";
import { useChatContext } from "@/modules/chat/contexts/ChatContext";
import { useConversationsContext } from "@/modules/conversations/contexts/ConversationsContext";
import { useAutoScroll } from "@/common/hooks/useAutoScroll";

export const ChatArea: React.FC = () => {
  // 设置：定义状态和使用钩子
  const { styles } = useAppStyles();
  const { collapsed, openSidebar } = useSidebar();
  const { messages, isRequesting, curConversation } = useChatContext();
  const { conversations } = useConversationsContext();

  // 逻辑：处理组件的数据，为渲染做准备
  const isExistingConversation = conversations.some(
    (item) => item.key === curConversation
  );
  const displayMessages = isExistingConversation ? messages : [];
  const chatListRef = useAutoScroll<HTMLDivElement>([displayMessages, isRequesting]);
  const hasMessages = displayMessages.length > 0;
  const isEmpty = displayMessages.length === 0;

  // 标记：组件正常情况下的 JSX 渲染结果
  return (
    <div className={styles.chat}>
      {collapsed ? (
        <div className={styles.chatSidebarToggle} onClick={openSidebar}>
          <img
            src={sidebarController}
            width={32}
            height={32}
            alt="open sidebar"
            draggable={false}
          />
        </div>
      ) : null}

      {isEmpty ? <div className={styles.senderBackground} /> : null}

      <div className={styles.chatList} ref={chatListRef}>
        {hasMessages ? <MessageList messages={displayMessages} /> : null}
        {isEmpty ? <WelcomeScreen /> : null}
      </div>
      <div className={styles.senderContainer}>
        <SenderArea />
        <div className="sender-footer">
          <span>内容由AI生成，仅供参考</span>
        </div>
      </div>
    </div>
  );
};

