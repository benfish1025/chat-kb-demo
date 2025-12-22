import { useEffect, useMemo, useState } from "react";
import "@/index.css";
import { XProvider } from "@ant-design/x";
import { useXChat, useXConversations } from "@ant-design/x-sdk";
import { message } from "antd";

import "@ant-design/x-markdown/themes/light.css";
import "@ant-design/x-markdown/themes/dark.css";

import { ChatContext } from "@/contexts/ChatContext";
import { SourcesProvider } from "@/contexts/SourcesContext";
import { providerFactory } from "@/hooks/useProvider";
import type { RagRequestMessage } from "@/hooks/RagChatProvider";
import { useAppStyles } from "@/styles/useAppStyles";
import { useMarkdownTheme } from "@/_utils/x-markdown";
import { getRole } from "@/components/MessageList/bubbleRole.tsx";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { SourcesDrawer } from "@/components/SourcesDrawer";
import {
  loadConversationsFromStorage,
  loadMessages,
  saveConversationsToStorage,
  saveMessages,
} from "@/_utils/chatStorage";

const App = () => {
  const [className] = useMarkdownTheme();
  const storedConversations = loadConversationsFromStorage();
  const defaultConversations = storedConversations && storedConversations.length > 0
    ? storedConversations
    : [];

  const { conversations, setConversations } = useXConversations({
    defaultConversations,
  });

  // 首次进入时始终生成一个“全新”的会话 key，
  // 不直接进入历史对话，从而默认展示首页。
  // 只有在用户发送第一条消息或点击侧边栏会话时，才会真正进入对应会话。
  const [curConversation, setCurConversation] = useState<string>(() => {
    // 使用时间戳确保唯一性
    return Date.now().toString();
  });
  const [activeConversation, setActiveConversation] = useState<string>();

  const defaultMessages = useMemo(() => {
    if (!curConversation) return [];

    const stored = loadMessages(curConversation);
    if (stored && stored.length > 0) {
      return stored;
    }
    return [];
  }, [curConversation]);

  const { onRequest, messages, isRequesting, abort, onReload } = useXChat({
    provider: providerFactory(curConversation), // every conversation has its own provider
    conversationKey: curConversation,
    defaultMessages,
    requestPlaceholder: () => {
      return {
        content: "暂无数据",
        role: "assistant",
      };
    },
    requestFallback: (_, { messageInfo }) => {
      return {
        ...messageInfo?.message,
        content: messageInfo?.message.content || "请求失败，请重试！",
      };
    },
  });

  const { styles } = useAppStyles();
  const [, contextHolder] = message.useMessage();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 当前会话 key 是否仍然存在于侧边栏会话列表中
  const isExistingConversation = conversations.some((item) => item.key === curConversation);

  // 持久化会话列表
  useEffect(() => {
    if (!conversations) return;
    saveConversationsToStorage(conversations);
  }, [conversations]);

  // 按会话 key 持久化消息列表
  useEffect(() => {
    if (!curConversation) return;
    // 只有当当前会话仍然存在于会话列表中时，才持久化消息
    const exists = conversations.some((item) => item.key === curConversation);
    if (!exists) return;
    saveMessages(curConversation, messages);
  }, [curConversation, messages, conversations]);

  // 如果服务端返回自动标题（title 事件），在首轮对话后更新会话标题
  useEffect(() => {
    if (!curConversation) return;
    if (!conversations || conversations.length === 0) return;

    // 找到最新一条包含自动标题的助手消息
    const lastWithTitle = [...messages]
      .reverse()
      .find(
        (item) =>
          item?.message?.role === "assistant" &&
          item?.message?.extraInfo?.title
      );

    const newTitle = lastWithTitle?.message?.extraInfo?.title as string | undefined;
    if (!newTitle || !newTitle.trim()) return;

    const index = conversations.findIndex((c) => c.key === curConversation);
    if (index === -1) return;

    const current = conversations[index];
    if (current.label === newTitle) return;

    const next = [...conversations];
    next[index] = { ...current, label: newTitle };
    setConversations(next);
  }, [messages, conversations, curConversation, setConversations]);

  const handleConversationChange = (key: string) => {
    setCurConversation(key);
    setActiveConversation(key);
  };

  const handleRequest = (val: string) => {
    // 如果当前会话 key 不在侧边栏列表中，说明是通过「新对话」进入的首页，
    // 此时用户第一次发送消息，需要在侧边栏最上方新增一条记录。
    const exists = conversations.some((item) => item.key === curConversation);

    if (!exists) {
      const title = val.slice(0, 15) || "新对话";
      setConversations([{ key: curConversation, label: title }, ...conversations]);
    }

    // 仅当当前会话仍然存在于会话列表中时，才使用历史消息；
    // 否则视为新会话，不传递任何历史记录
    const baseMessages = conversations.some((item) => item.key === curConversation)
      ? messages
      : [];

    // 构造同一会话下最近 10 条历史记录（不包含本次用户输入）
    const historyMessages: RagRequestMessage[] = baseMessages
      .map((item) => {
        const role = item?.message?.role;
        if (role !== "user" && role !== "assistant") {
          return null;
        }
        const rawContent = item?.message?.content;
        const content =
          typeof rawContent === "string" ? rawContent : rawContent?.text || "";
        if (!content) {
          return null;
        }
        return {
          role,
          content,
        } as RagRequestMessage;
      })
      .filter((m): m is RagRequestMessage => !!m)
      .slice(-10);

    // content 为本次用户输入；messages 为历史记录
    onRequest({
      content: val,
      messages: historyMessages,
      thinking: {
        type: "disabled",
      },
    });
    setActiveConversation(curConversation);
  };

  return (
    <XProvider>
      {contextHolder}
      <SourcesProvider>
        <ChatContext.Provider value={{ onReload }}>
          <div className={styles.layout}>
            <Sidebar
              conversations={conversations}
              curConversation={curConversation}
              activeConversation={activeConversation}
              styles={{
                side: styles.side,
                logo: styles.logo,
                conversations: styles.conversations,
              }}
              onConversationChange={handleConversationChange}
              setConversations={setConversations}
              collapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            />
            <ChatArea
              // 如果当前会话已被删除（不在会话列表中），则不展示其历史消息，回到首页状态
              messages={isExistingConversation ? messages : []}
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
                sidebarToggle: styles.chatSidebarToggle,
                welcomeDecorativeCurve: styles.welcomeDecorativeCurve,
              }}
              role={getRole(className)}
              curConversation={curConversation}
              isRequesting={isRequesting}
              onRequest={handleRequest}
              onCancel={abort}
              sidebarCollapsed={isSidebarCollapsed}
              onSidebarOpen={() => setIsSidebarCollapsed(false)}
            />
            <SourcesDrawer />
          </div>
        </ChatContext.Provider>
      </SourcesProvider>
    </XProvider>
  );
};

export default App;
