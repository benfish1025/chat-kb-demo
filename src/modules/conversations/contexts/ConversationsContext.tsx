import React, { createContext, useContext } from "react";
import type { ConversationItemType } from "@ant-design/x";
import { useConversations } from "@/modules/conversations/hooks/useConversations";

interface ConversationsContextType {
  conversations: ConversationItemType[];
  setConversations: (conversations: ConversationItemType[]) => void;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export const ConversationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { conversations, setConversations } = useConversations();

  return (
    <ConversationsContext.Provider value={{ conversations, setConversations }}>
      {children}
    </ConversationsContext.Provider>
  );
};

export const useConversationsContext = () => {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error("useConversationsContext must be used within ConversationsProvider");
  }
  return context;
};

