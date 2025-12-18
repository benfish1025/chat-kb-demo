import { useState } from "react";
import "./index.css";
import { XProvider } from "@ant-design/x";
import { useXChat, useXConversations } from "@ant-design/x-sdk";
import { message } from "antd";

import "@ant-design/x-markdown/themes/light.css";
import "@ant-design/x-markdown/themes/dark.css";

import { ChatContext } from "./contexts/ChatContext";
import { SourcesProvider } from "./contexts/SourcesContext";
import { DEFAULT_CONVERSATIONS_ITEMS } from "./config/conversations";
import { historyMessageFactory } from "./config/messages";
import { providerFactory } from "./hooks/useProvider";
import { useAppStyles } from "./styles/useAppStyles";
import { useMarkdownTheme } from "./_utils/x-markdown";
import { getRole } from "./utils/bubbleRole";
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import { SourcesDrawer } from "./components/SourcesDrawer";
import locale from "./_utils/local";

const App = () => {
  const [className] = useMarkdownTheme();
  const { conversations, setConversations } = useXConversations({
    defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
  });
  const [curConversation, setCurConversation] = useState<string>(
    DEFAULT_CONVERSATIONS_ITEMS[0].key
  );
  const [activeConversation, setActiveConversation] = useState<string>();

  const { onRequest, messages, isRequesting, abort, onReload } = useXChat({
    provider: providerFactory(curConversation), // every conversation has its own provider
    conversationKey: curConversation,
    defaultMessages: historyMessageFactory(curConversation),
    requestPlaceholder: () => {
      return {
        content: locale.noData,
        role: "assistant",
      };
    },
    requestFallback: (_, { messageInfo }) => {
      return {
        ...messageInfo?.message,
        content: messageInfo?.message.content || locale.requestFailedPleaseTryAgain,
      };
    },
  });

  const { styles } = useAppStyles();
  const [, contextHolder] = message.useMessage();

  const handleConversationChange = (key: string) => {
    setCurConversation(key);
    setActiveConversation(key);
  };

  const handleRequest = (val: string) => {
    // 如果当前会话 key 不在侧边栏列表中，说明是通过「新对话」进入的首页，
    // 此时用户第一次发送消息，需要在侧边栏最上方新增一条记录。
    const exists = conversations.some((item) => item.key === curConversation);

    if (!exists) {
      const title = val.slice(0, 15) || locale.newConversation;
      setConversations([{ key: curConversation, label: title }, ...conversations]);
    }

    onRequest({
      messages: [{ role: "user", content: val }],
      thinking: {
        type: "disabled",
      },
    });
    setActiveConversation(curConversation);
  };

  return (
    <XProvider locale={locale}>
      {contextHolder}
      <SourcesProvider>
        <ChatContext.Provider value={{ onReload }}>
          <div className={styles.layout}>
            <Sidebar
              conversations={conversations}
              curConversation={curConversation}
              activeConversation={activeConversation}
              messages={messages}
              styles={{
                side: styles.side,
                logo: styles.logo,
                conversations: styles.conversations,
              }}
              onConversationChange={handleConversationChange}
              setConversations={setConversations}
            />
            <ChatArea
              messages={messages}
              styles={{
                chat: styles.chat,
                chatList: styles.chatList,
                startPage: styles.startPage,
                agentName: styles.agentName,
                senderContainer: styles.senderContainer,
                senderBackground: styles.senderBackground,
                welcomeArea: styles.welcomeArea,
                welcomeContent: styles.welcomeContent,
                welcomeText: styles.welcomeText,
                welcomeTextLine1: styles.welcomeTextLine1,
                welcomeTextLine2: styles.welcomeTextLine2,
              }}
              role={getRole(className)}
              curConversation={curConversation}
              isRequesting={isRequesting}
              onRequest={handleRequest}
              onCancel={abort}
            />
            <SourcesDrawer />
          </div>
        </ChatContext.Provider>
      </SourcesProvider>
    </XProvider>
  );
};

export default App;
