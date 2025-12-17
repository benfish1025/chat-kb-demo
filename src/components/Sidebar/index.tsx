import React, { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Conversations } from "@ant-design/x";
import dayjs from "dayjs";
import { message } from "antd";
import type { ConversationItemType } from "@ant-design/x";
import type { ChatMessage } from "../../types/chat";
import locale from "../../_utils/local";
import chatkbLogo from "../../assets/chatkb-logo.svg";
import sidebarController from "../../assets/sidebar-controler.svg";
import newChatDefault from "../../assets/new-chat-1.svg";
import newChatHover from "../../assets/new-chat.svg";

interface SidebarProps {
  conversations: ConversationItemType[];
  curConversation: string;
  activeConversation?: string;
  messages: ChatMessage[];
  styles: {
    side: string;
    logo: string;
    conversations: string;
  };
  onConversationChange: (key: string) => void;
  addConversation: (conversation: ConversationItemType) => void;
  setConversations: (conversations: ConversationItemType[]) => void;
  setCurConversation: (key: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  curConversation,
  activeConversation,
  messages,
  styles,
  onConversationChange,
  addConversation,
  setConversations,
  setCurConversation,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(false);
  const [newChatHovering, setNewChatHovering] = useState(false);

  const handleCreateConversation = () => {
    if (messages.length === 0) {
      messageApi.error(locale.itIsNowANewConversation);
      return;
    }
    const now = dayjs().valueOf().toString();
    addConversation({
      key: now,
      label: `${locale.newConversation} ${conversations.length + 1}`,
    });
    setCurConversation(now);
  };

  const handleDeleteConversation = (conversation: ConversationItemType) => {
    const newList = conversations.filter((item) => item.key !== conversation.key);
    const newKey = newList?.[0]?.key;
    setConversations(newList);
    if (conversation.key === curConversation) {
      setCurConversation(newKey);
    }
  };

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <>
      {contextHolder}
      <div className={styles.side} data-collapsed={collapsed}>
        {/* 顶部：LOGO + 折叠按钮 */}
        <div className="app-sidebar-header">
          <div className="app-sidebar-logo">
            <img src={chatkbLogo} draggable={false} alt="ChatKB" />
          </div>
          <div className="app-sidebar-toggle" onClick={handleToggleCollapse}>
            <img src={sidebarController} draggable={false} alt="toggle sidebar" />
          </div>
        </div>

        {/* 新对话按钮 */}
        <div
          className="app-sidebar-new-chat"
          onClick={handleCreateConversation}
          onMouseEnter={() => setNewChatHovering(true)}
          onMouseLeave={() => setNewChatHovering(false)}
        >
          <div className="app-sidebar-new-chat-icon">
            <img
              src={newChatHovering ? newChatHover : newChatDefault}
              alt="new chat"
              draggable={false}
            />
          </div>
          <div className="app-sidebar-new-chat-text">新对话</div>
        </div>

        {/* 历史标题 */}
        <div className="app-sidebar-history-header">
          <span className="app-sidebar-history-title">历史</span>
        </div>

        {/* 会话记录列表 */}
        <div className="app-sidebar-history-list">
          <Conversations
            items={conversations
              .map(({ key, label, ...other }) => ({
                key,
                label: key === activeConversation ? `[${locale.curConversation}]${label}` : label,
                ...other,
              }))
              .sort(({ key }) => (key === activeConversation ? -1 : 0))}
            className="app-sidebar-conversations"
            activeKey={curConversation}
            onActiveChange={async (val) => {
              onConversationChange(val);
            }}
            groupable={false}
            styles={{
              item: {
                padding: "8px 20px 8px 8px",
                borderRadius: 10,
              },
              list: {
                paddingInlineStart: 0,
              },
              label: {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 14,
              },
            }}
            menu={(conversation) => ({
              items: [
                {
                  label: locale.delete,
                  key: "delete",
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => handleDeleteConversation(conversation),
                },
              ],
            })}
          />
        </div>
      </div>
    </>
  );
};
