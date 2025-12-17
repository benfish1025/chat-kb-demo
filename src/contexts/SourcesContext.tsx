import React, { createContext, useContext, useState, useCallback } from "react";

interface SourcesContextType {
  open: boolean;
  activeSourceIndex: number | null;
  openDrawer: (sourceIndex: number) => void;
  closeDrawer: () => void;
}

const SourcesContext = createContext<SourcesContextType | undefined>(undefined);

export const SourcesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [activeSourceIndex, setActiveSourceIndex] = useState<number | null>(null);

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
    <SourcesContext.Provider value={{ open, activeSourceIndex, openDrawer, closeDrawer }}>
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
