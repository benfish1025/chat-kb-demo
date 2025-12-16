import React from "react";
import type { useXChat } from "@ant-design/x-sdk";

export const ChatContext = React.createContext<{
  onReload?: ReturnType<typeof useXChat>["onReload"];
}>({});

