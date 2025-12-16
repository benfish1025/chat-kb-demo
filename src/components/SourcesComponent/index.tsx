import React from "react";
import { Sources } from "@ant-design/x";
import type { ComponentProps } from "@ant-design/x-markdown";
import { DEFAULT_SOURCES } from "../../config/sources";

/**
 * 来源引用组件
 * 将 Markdown 中的 <sup> 标签渲染为来源引用
 */
export const SourcesComponent = React.memo((props: ComponentProps) => {
  const sourceIndex = parseInt(`${props?.children}` || "0", 10);
  const source = DEFAULT_SOURCES.find((item) => item.key === sourceIndex);

  if (!source) {
    // 如果找不到对应的来源，返回原始的 sup 标签内容
    return <sup>{props?.children}</sup>;
  }

  return (
    <Sources activeKey={sourceIndex} title={props.children} items={DEFAULT_SOURCES} inline={true} />
  );
});

SourcesComponent.displayName = "SourcesComponent";
