import { useEffect, useRef } from "react";
import type { SourceItem } from "@/modules/sources/types/source";

/**
 * 处理来源高亮和滚动的 Hook
 * 当 Drawer 打开时，自动滚动到指定来源并触发高亮动画
 */
export const useSourceHighlight = (
  open: boolean,
  activeSourceIndex: number | null,
  sources: SourceItem[]
) => {
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

  return {
    itemRefs,
    scrollContainerRef,
  };
};

