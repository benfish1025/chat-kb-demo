import React, { createContext, useContext } from "react";
import type { useXChat } from "@ant-design/x-sdk";
import type { ChatMessage } from "@/modules/chat/types/chat";

interface ChatContextType {
  curConversation: string;
  messages: ChatMessage[];
  isRequesting: boolean;
  onRequest: (val: string) => void;
  onCancel: () => void;
  onReload?: ReturnType<typeof useXChat>["onReload"];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider: React.FC<{
  children: React.ReactNode;
  curConversation: string;
  messages: ChatMessage[];
  isRequesting: boolean;
  onRequest: (val: string) => void;
  onCancel: () => void;
  onReload?: ReturnType<typeof useXChat>["onReload"];
}> = ({
  children,
  curConversation,
  messages,
  isRequesting,
  onRequest,
  onCancel,
  onReload,
}) => {
  return (
    <ChatContext.Provider
      value={{
        curConversation,
        messages,
        isRequesting,
        onRequest,
        onCancel,
        onReload,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatContextProvider");
  }
  return context;
};

