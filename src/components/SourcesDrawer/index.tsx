import React, { useEffect, useRef } from "react";
import { Drawer } from "antd";
import XMarkdown from "@ant-design/x-markdown";
import { useSources } from "../../contexts/SourcesContext";
import { useAppStyles } from "../../styles/useAppStyles";
import { referenceFileHost } from "../../config/host";

export const SourcesDrawer: React.FC = () => {
  const { open, activeSourceIndex, closeDrawer, sources } = useSources();
  const { styles } = useAppStyles();
  const itemRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    // 延迟执行，确保 Drawer 内容和 itemRefs 已全部渲染完成
    const timer = setTimeout(() => {
      const container = scrollContainerRef.current;

      // 如果有指定的 activeSourceIndex，优先滚动到该来源
      if (activeSourceIndex !== null) {
        const targetElement = itemRefs.current[activeSourceIndex];
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "center" });

          // 触发闪烁动画，高亮当前来源
          setTimeout(() => {
            targetElement.classList.add("source-item-highlight");
            setTimeout(() => {
              targetElement.classList.remove("source-item-highlight");
            }, 1500);
          }, 300);

          return;
        }
      }

      // 找不到指定来源或没有 activeSourceIndex 时，回到顶部，避免停留在上一次的位置
      if (container) {
        container.scrollTop = 0;
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [open, activeSourceIndex, sources]);

  return (
    <Drawer
      title="来源文档"
      placement="right"
      onClose={closeDrawer}
      open={open}
      width={560}
      className={styles.sourcesDrawer}
    >
      <div className={styles.sourcesDrawerContent} ref={scrollContainerRef}>
        {sources.map((source) => {
          const sourceNumber = source.key;
          const isActive = activeSourceIndex === source.key;
          const file = source.url;
          const fileUrl =
            referenceFileHost && file
              ? `${referenceFileHost}${file}`
              : "";

          return (
            <div
              key={source.key}
              ref={(el) => {
                itemRefs.current[source.key] = el;
              }}
              className={`${styles.sourcesDrawerItem} ${isActive ? "source-item-highlight" : ""}`}
            >
              {/* 内容区域 */}
              <div className={styles.sourcesDrawerItemContent}>
                {/* 标题 */}
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
                  {/* 描述（支持 Markdown 渲染） */}
                  {source.description && (
                    <XMarkdown
                      paragraphTag="p"
                      className={styles.sourcesDrawerItemDescription}
                    >
                      {sanitizeMarkdownTables(source.description)}
                    </XMarkdown>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Drawer>
  );
};

function sanitizeMarkdownTables(input: string): string {
  const lines = input.split("\n");
  const isSeparatorLine = (line: string) => /^(\s*\|?\s*[-:]+\s*\|)+\s*[-:]+\s*\|?\s*$/.test(line);
  const countColumns = (line: string) => line.split("|").length - 1;
  const normalizeSeparator = (line: string) => {
    const trimmed = line.trimStart();
    return trimmed.startsWith("|") ? line : `|${trimmed}`;
  };
  const buildEmptyHeader = (pipeCount: number) => `| ${" |".repeat(Math.max(pipeCount - 1, 0))}`;

  for (let i = 0; i < lines.length; i += 1) {
    if (!isSeparatorLine(lines[i])) {
      continue;
    }

    lines[i] = normalizeSeparator(lines[i]);
    const separatorColumns = countColumns(lines[i]);

    const headerIndex = i - 1;
    if (headerIndex < 0) {
      lines.splice(i, 0, buildEmptyHeader(separatorColumns));
      i += 1;
      continue;
    }

    const header = lines[headerIndex].trimEnd();
    if (header.length === 0 || isSeparatorLine(header)) {
      lines[headerIndex] = buildEmptyHeader(separatorColumns);
    }

    const fixedHeaderStart = lines[headerIndex].trimEnd();
    const fixedHeaderColumns = countColumns(fixedHeaderStart);
    if (!fixedHeaderStart.trimStart().startsWith("|") && fixedHeaderColumns > 0) {
      lines[headerIndex] = `| ${fixedHeaderStart}`;
    }

    const fixedHeader = lines[headerIndex];
    const fixedHeaderPipeCount = countColumns(fixedHeader);
    if (separatorColumns > fixedHeaderPipeCount && fixedHeaderPipeCount > 0) {
      const missing = separatorColumns - fixedHeaderPipeCount;
      lines[headerIndex] = `${fixedHeader}${" |".repeat(missing)}`;
    }

    if (header.length === 0 || isSeparatorLine(header)) {
      continue;
    }
  }

  return lines.join("\n");
}

