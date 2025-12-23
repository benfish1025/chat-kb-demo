import React, { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Conversations } from "@ant-design/x";
import type { ConversationItemType } from "@ant-design/x";
import chatkbLogo from "@/assets/chatkb-logo.svg";
import sidebarController from "@/assets/sidebar-controler.svg";
import newChatDefault from "@/assets/new-chat-1.svg";
import newChatHover from "@/assets/new-chat.svg";
import { removeConversationMessages } from "@/modules/chat/api/messages";
import { useAppStyles } from "@/common/styles/useAppStyles";
import { useSidebar } from "@/modules/conversations/contexts/SidebarContext";
import { useConversationsContext } from "@/modules/conversations/contexts/ConversationsContext";
import { generateConversationId } from "@/modules/chat/api/conversationId";

interface SidebarProps {
  curConversation: string;
  onConversationChange: (key: string) => void;
}

// 辅助函数：创建菜单配置（放在组件外部）
const createConversationMenu = (
  conversation: ConversationItemType,
  onDelete: (conversation: ConversationItemType) => void
) => {
  return {
    items: [
      {
        label: "删除",
        key: "delete",
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => onDelete(conversation),
      },
    ],
  };
};

export const Sidebar: React.FC<SidebarProps> = ({
  curConversation,
  onConversationChange,
}) => {
  // 设置：定义状态和使用钩子
  const { styles } = useAppStyles();
  const { collapsed, toggleCollapse } = useSidebar();
  const { conversations, setConversations } = useConversationsContext();
  const [newChatHovering, setNewChatHovering] = useState(false);

  // 逻辑：处理组件的数据，为渲染做准备
  const handleCreateConversation = () => {
    const newConversationKey = generateConversationId();
    onConversationChange(newConversationKey);
  };

  const handleDeleteConversation = (conversation: ConversationItemType) => {
    const newList = conversations.filter((item) => item.key !== conversation.key);
    removeConversationMessages(conversation.key);
    setConversations(newList);
    if (conversation.key === curConversation) {
      // 删除当前会话后，创建新的会话
      const newConversationKey = generateConversationId();
      onConversationChange(newConversationKey);
    }
  };

  const handleActiveChange = (val: string) => {
    onConversationChange(val);
  };

  const handleMouseEnter = () => {
    setNewChatHovering(true);
  };

  const handleMouseLeave = () => {
    setNewChatHovering(false);
  };

  // 标记：组件正常情况下的 JSX 渲染结果
  return (
    <div className={styles.side} data-collapsed={collapsed}>
      <div className="app-sidebar-inner-container">
        <div className="app-sidebar-header">
          <div className="app-sidebar-logo">
            <img src={chatkbLogo} draggable={false} alt="ChatKB" />
          </div>
          <div className="app-sidebar-toggle" onClick={toggleCollapse}>
            <img src={sidebarController} width={32} height={32} draggable={false} alt="toggle sidebar" />
          </div>
        </div>

        <div
          className="app-sidebar-new-chat"
          onClick={handleCreateConversation}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="app-sidebar-new-chat-icon">
            <img
              src={newChatHovering ? newChatHover : newChatDefault}
              alt="new chat"
              draggable={false}
            />
          </div>
          <span className="app-sidebar-new-chat-text">新对话</span>
        </div>
        <div className="app-sidebar-history-container">
          <div className="app-sidebar-history-header">
            <span className="app-sidebar-history-title">最近对话</span>
          </div>

          <div className="app-sidebar-history-list">
            <Conversations
              items={conversations}
              className="app-sidebar-conversations"
              activeKey={curConversation}
              onActiveChange={handleActiveChange}
              groupable={false}
              menu={(conversation) => createConversationMenu(conversation, handleDeleteConversation)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

