import { useState } from "react";
import "@/index.css";
import { XProvider } from "@ant-design/x";
import { message } from "antd";

import "@ant-design/x-markdown/themes/light.css";
import "@ant-design/x-markdown/themes/dark.css";

import { ChatContextProvider } from "@/modules/chat/contexts/ChatContext";
import { ConversationsProvider, useConversationsContext } from "@/modules/conversations/contexts/ConversationsContext";
import { SidebarProvider } from "@/modules/conversations/contexts/SidebarContext";
import { SourcesProvider } from "@/modules/sources/contexts/SourcesContext";
import { useChat } from "@/modules/chat/hooks/useChat";
import { useChatPersistence } from "@/modules/chat/hooks/useChatPersistence";
import { useAutoTitleUpdate } from "@/modules/conversations/hooks/useAutoTitleUpdate";
import { useChatRequest } from "@/modules/chat/hooks/useChatRequest";
import { useAppStyles } from "@/common/styles/useAppStyles";
import { Sidebar } from "@/modules/conversations/components/Sidebar";
import { ChatArea } from "@/modules/chat/components/ChatArea";
import { SourcesDrawer } from "@/modules/sources/components/SourcesDrawer";

const AppContent = () => {
  // 首次进入时始终生成一个"全新"的会话 key，
  // 不直接进入历史对话，从而默认展示首页。
  // 只有在用户发送第一条消息或点击侧边栏会话时，才会真正进入对应会话。
  const [curConversation, setCurConversation] = useState<string>(() => {
    // 使用时间戳确保唯一性
    return Date.now().toString();
  });

  const { onRequest, messages, isRequesting, abort, onReload } = useChat(curConversation);
  const { conversations, setConversations } = useConversationsContext();
  const { styles } = useAppStyles();
  const [, contextHolder] = message.useMessage();

  // 使用自定义 Hooks 处理业务逻辑
  useChatPersistence(curConversation, messages, conversations);
  useAutoTitleUpdate(curConversation, messages, conversations, setConversations);
  const { handleRequest } = useChatRequest({
    curConversation,
    messages,
    conversations,
    setConversations,
    onRequest,
  });

  const handleConversationChange = (key: string) => {
    setCurConversation(key);
  };

  return (
    <XProvider>
      {contextHolder}
      <SourcesProvider>
        <ChatContextProvider
          curConversation={curConversation}
          messages={messages}
          isRequesting={isRequesting}
          onRequest={handleRequest}
          onCancel={abort}
          onReload={onReload}
        >
          <div className={styles.layout}>
            <Sidebar
              curConversation={curConversation}
              onConversationChange={handleConversationChange}
            />
            <ChatArea />
            <SourcesDrawer />
          </div>
        </ChatContextProvider>
      </SourcesProvider>
    </XProvider>
  );
};

const App = () => {
  return (
    <ConversationsProvider>
      <SidebarProvider>
        <AppContent />
      </SidebarProvider>
    </ConversationsProvider>
  );
};

export default App;
