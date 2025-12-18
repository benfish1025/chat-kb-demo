import React from "react";
import type { ComponentProps } from "@ant-design/x-markdown";
import type { SourceItem } from "../../config/sources";
import { useSources } from "../../contexts/SourcesContext";
import { useAppStyles } from "../../styles/useAppStyles";

interface SourcesComponentProps extends ComponentProps {
  sources?: SourceItem[];
  messageId?: string;
}

/**
 * 来源引用组件
 * 将 Markdown 中的 <sup> 标签渲染为来源引用
 */
export const SourcesComponent = React.memo((props: SourcesComponentProps) => {
  const { sources, children } = props;
  const sourceIndex = parseInt(`${children}` || "0", 10);
  const source = (sources || []).find((item) => item.key === sourceIndex);
  const { openDrawer, setSources } = useSources();
  const { styles } = useAppStyles();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (source && sources && sources.length) {
      // 点击时同步更新 Drawer 的来源列表，并定位到对应来源
      setSources(sources);
      openDrawer(source.key);
    }
  };

  if (!source) {
    // 如果找不到对应的来源，则不显示该 sup 标签
    return null;
  }

  return (
    <sup className={styles.sourceSup} onClick={handleClick}>
      {children}
    </sup>
  );
});

SourcesComponent.displayName = "SourcesComponent";
