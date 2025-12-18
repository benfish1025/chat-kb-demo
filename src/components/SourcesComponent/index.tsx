import React from "react";
import type { ComponentProps } from "@ant-design/x-markdown";
import { DEFAULT_SOURCES } from "../../config/sources";
import { useSources } from "../../contexts/SourcesContext";
import { useAppStyles } from "../../styles/useAppStyles";

/**
 * 来源引用组件
 * 将 Markdown 中的 <sup> 标签渲染为来源引用
 */
export const SourcesComponent = React.memo((props: ComponentProps) => {
  const sourceIndex = parseInt(`${props?.children}` || "0", 10);
  const source = DEFAULT_SOURCES.find((item) => item.key === sourceIndex);
  const { openDrawer } = useSources();
  const { styles } = useAppStyles();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (source) {
      openDrawer(source.key);
    }
  };

  if (!source) {
    // 如果找不到对应的来源，返回原始的 sup 标签内容
    return <sup>{props?.children}</sup>;
  }

  return (
    <sup className={styles.sourceSup} onClick={handleClick}>
      {props?.children}
    </sup>
  );
});

SourcesComponent.displayName = "SourcesComponent";
