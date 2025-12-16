import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Conversations } from "@ant-design/x";
import dayjs from "dayjs";
import { message } from "antd";
import type { ConversationItemType } from "@ant-design/x";
import type { ChatMessage } from "../../types/chat";
import locale from "../../_utils/local";

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

  const handleCreateConversation = () => {
    if (messages.length === 0) {
      messageApi.error(locale.itIsNowANewConversation);
      return;
    }
    const now = dayjs().valueOf().toString();
    addConversation({
      key: now,
      label: `${locale.newConversation} ${conversations.length + 1}`,
      group: locale.today,
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

  return (
    <>
      {contextHolder}
      <div className={styles.side}>
        <div className={styles.logo}>
          <img
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
            draggable={false}
            alt="logo"
            width={24}
            height={24}
          />
          <span>Ant Design X</span>
        </div>
        <Conversations
          creation={{
            onClick: handleCreateConversation,
          }}
          items={conversations
            .map(({ key, label, ...other }) => ({
              key,
              label: key === activeConversation ? `[${locale.curConversation}]${label}` : label,
              ...other,
            }))
            .sort(({ key }) => (key === activeConversation ? -1 : 0))}
          className={styles.conversations}
          activeKey={curConversation}
          onActiveChange={async (val) => {
            onConversationChange(val);
          }}
          groupable
          styles={{ item: { padding: "0 8px" } }}
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
    </>
  );
};
