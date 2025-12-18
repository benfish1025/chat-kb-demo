import React, { useEffect, useRef } from "react";
import { Drawer } from "antd";
import { useSources } from "../../contexts/SourcesContext";
import { DEFAULT_SOURCES } from "../../config/sources";
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
  const { open, activeSourceIndex, closeDrawer } = useSources();
  const { styles } = useAppStyles();
  const itemRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (open && activeSourceIndex !== null) {
      // 延迟滚动和闪烁，确保 Drawer 内容已渲染
      const timer = setTimeout(() => {
        const targetElement = itemRefs.current[activeSourceIndex];
        if (targetElement) {
          // 先滚动到目标元素
          targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
          // 然后触发闪烁动画
          setTimeout(() => {
            targetElement.classList.add("source-item-highlight");
            // 动画持续 1.5 秒（0.5s * 3次）
            setTimeout(() => {
              targetElement.classList.remove("source-item-highlight");
            }, 1500);
          }, 300);
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open, activeSourceIndex]);

  return (
    <Drawer
      title="来源文档"
      placement="right"
      onClose={closeDrawer}
      open={open}
      width={480}
      className={styles.sourcesDrawer}
    >
      <div className={styles.sourcesDrawerContent}>
        {DEFAULT_SOURCES.map((source, index) => {
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

                {/* 描述 */}
                {source.description && (
                  <div className={styles.sourcesDrawerItemDescription}>{source.description}</div>
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
