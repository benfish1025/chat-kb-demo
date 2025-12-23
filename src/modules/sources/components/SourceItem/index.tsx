import React from "react";
import XMarkdown from "@ant-design/x-markdown";
import type { SourceItem as SourceItemType } from "@/modules/sources/types/source";
import { useAppStyles } from "@/common/styles/useAppStyles";
import { referenceFileHost } from "@/modules/chat/api/config";
import { sanitizeMarkdownTables } from "@/modules/sources/components/SourceItem/sanitizeMarkdownTables";

interface SourceItemProps {
  source: SourceItemType;
  isActive: boolean;
  onRef: (el: HTMLDivElement | null) => void;
}

export const SourceItem: React.FC<SourceItemProps> = ({ source, isActive, onRef }) => {
  // 设置：定义状态和使用钩子
  const { styles } = useAppStyles();

  // 逻辑：处理组件的数据，为渲染做准备
  const sourceNumber = source.key;
  const file = source.url;
  const fileUrl = referenceFileHost && file ? `${referenceFileHost}${file}` : "";
  const hasDescription = Boolean(source.description);
  const itemClassName = `${styles.sourcesDrawerItem} ${isActive ? "source-item-highlight" : ""}`;

  // 标记：组件正常情况下的 JSX 渲染结果
  return (
    <div ref={onRef} className={itemClassName}>
      <div className={styles.sourcesDrawerItemContent}>
        <div className={styles.sourcesTitleContainer}>
          <div className={styles.sourcesDrawerNumber}>{sourceNumber}</div>
          {fileUrl ? (
            <a
              className={styles.sourcesDrawerItemTitle}
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {source.title}
            </a>
          ) : (
            <div className={styles.sourcesDrawerItemTitle}>{source.title}</div>
          )}
        </div>
        <div className={styles.sourcesDrawerItemDescriptionContainer}>
          {hasDescription ? (
            <XMarkdown
              paragraphTag="p"
              className={styles.sourcesDrawerItemDescription}
            >
              {sanitizeMarkdownTables(source.description!)}
            </XMarkdown>
          ) : null}
        </div>
      </div>
    </div>
  );
};

