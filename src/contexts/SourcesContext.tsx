import React, { createContext, useContext, useState, useCallback } from "react";
import type { SourceItem } from "../config/sources";

interface SourcesContextType {
  open: boolean;
  activeSourceIndex: number | null;
  /**
   * 当前消息对应的来源列表，由 Footer / SourcesComponent 在交互时写入
   */
  sources: SourceItem[];
  setSources: (sources: SourceItem[]) => void;
  openDrawer: (sourceIndex: number) => void;
  closeDrawer: () => void;
}

const SourcesContext = createContext<SourcesContextType | undefined>(undefined);

export const SourcesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [activeSourceIndex, setActiveSourceIndex] = useState<number | null>(null);
  const [sources, setSources] = useState<SourceItem[]>([]);

  const openDrawer = useCallback((sourceIndex: number) => {
    setActiveSourceIndex(sourceIndex);
    setOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setOpen(false);
    // 延迟清除 activeSourceIndex，以便闪烁动画完成
    setTimeout(() => {
      setActiveSourceIndex(null);
    }, 2000);
  }, []);

  return (
    <SourcesContext.Provider
      value={{ open, activeSourceIndex, sources, setSources, openDrawer, closeDrawer }}
    >
      {children}
    </SourcesContext.Provider>
  );
};

export const useSources = () => {
  const context = useContext(SourcesContext);
  if (!context) {
    throw new Error("useSources must be used within SourcesProvider");
  }
  return context;
};
