import React, { useEffect, useRef } from "react";
import { Drawer } from "antd";
import XMarkdown from "@ant-design/x-markdown";
import { useSources } from "../../contexts/SourcesContext";
import { useAppStyles } from "../../styles/useAppStyles";
import fileIcon from "../../assets/file-icon.svg";

/**
 * 从 URL 中提取文件名（从尾部截取）
 */
const extractFileName = (url: string): string => {
  try {
    // 移除查询参数和锚点
    const urlWithoutQuery = url.split("?")[0].split("#")[0];
    // 从尾部提取文件名
    const parts = urlWithoutQuery.split("/");
    const fileName = parts[parts.length - 1];
    // 如果最后一部分为空，取倒数第二部分
    return fileName || parts[parts.length - 2] || url;
  } catch {
    // 如果不是有效的 URL，尝试从字符串中提取文件名
    const parts = url.split("/");
    return parts[parts.length - 1] || url;
  }
};

/**
 * 将数字转换为圆圈数字（①、②、③等）
 */
const getCircleNumber = (num: number): string => {
  const circleNumbers = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];
  if (num >= 1 && num <= 10) {
    return circleNumbers[num - 1];
  }
  return num.toString();
};

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
      width={480}
      className={styles.sourcesDrawer}
    >
      <div className={styles.sourcesDrawerContent} ref={scrollContainerRef}>
        {sources.map((source, index) => {
          const sourceNumber = index + 1;
          const isActive = activeSourceIndex === source.key;
          const fileName = extractFileName(source.url);
          const circleNumber = getCircleNumber(sourceNumber);

          return (
            <div
              key={source.key}
              ref={(el) => {
                itemRefs.current[source.key] = el;
              }}
              className={`${styles.sourcesDrawerItem} ${isActive ? "source-item-highlight" : ""}`}
            >
              {/* 序号 */}
              <div className={styles.sourcesDrawerNumber}>{circleNumber}</div>

              {/* 内容区域 */}
              <div className={styles.sourcesDrawerItemContent}>
                {/* 标题 */}
                <div className={styles.sourcesDrawerItemTitle}>{source.title}</div>

                {/* 描述（支持 Markdown 渲染） */}
                {source.description && (
                  <XMarkdown
                    paragraphTag="p"
                    className={styles.sourcesDrawerItemDescription}
                  >
                    {source.description}
                  </XMarkdown>
                )}

                {/* 分隔线 */}
                <div className={styles.sourcesDrawerItemDivider} />

                {/* 文件名 */}
                <div className={styles.sourcesDrawerItemFileName}>
                  <img src={fileIcon} alt="file" className={styles.sourcesDrawerItemFileIcon} />
                  {fileName}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Drawer>
  );
};
