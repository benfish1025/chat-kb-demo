import { useEffect, useRef } from "react";

/**
 * 自动滚动到底部的 Hook
 * 当依赖项变化时，自动将容器滚动到底部
 */
export const useAutoScroll = <T extends HTMLElement>(
  dependencies: unknown[]
) => {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 使用 requestAnimationFrame 确保在内容渲染完成后再执行滚动
    const id = window.requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });

    return () => {
      window.cancelAnimationFrame(id);
    };
  }, dependencies);

  return containerRef;
};

