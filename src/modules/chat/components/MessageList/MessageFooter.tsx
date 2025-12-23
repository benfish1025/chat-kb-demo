import React from "react";
import type { CSSProperties } from "react";
import { message } from "antd";
import type { SourceItem } from "@/modules/sources/types/source";
import { useSources } from "@/modules/sources/contexts/SourcesContext";
import { extractUsedSourceKeys } from "@/modules/chat/components/MessageList/bubbleRole";
import copyIcon from "@/assets/copy.svg";

interface MessageFooterProps {
  content: string | React.ReactNode;
  info?: {
    status?: string;
    key?: string | number;
    extraInfo?: {
      sources?: SourceItem[];
    };
  };
}

// 样式定义（放在组件外部）
const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 18,
  alignSelf: "stretch",
};

const footerRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const referenceButtonStyle: CSSProperties = {
  display: "flex",
  padding: "4px 8px",
  alignItems: "center",
  gap: 6,
  appearance: "none",
  outline: "none",
  borderRadius: 6,
  background: "rgba(188, 197, 206, 0.1)",
  cursor: "pointer",
  border: 0,
};

const referenceTextWrapperStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
};

const referenceTextStyle: CSSProperties = {
  color: "rgba(18, 31, 43, 0.6)",
  fontFamily:
    '"PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
  fontSize: 14,
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "20px",
};

const referenceNumberStyle: CSSProperties = {
  color: "rgba(16, 114, 195, 1)",
  fontFamily:
    '"PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
  fontSize: 16,
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "20px",
};

const copyButtonStyle: CSSProperties = {
  display: "flex",
  borderRadius: 6,
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
  appearance: "none",
  width: 28,
  height: 28,
  outline: "none",
  border: "none",
  background: "transparent",
  boxShadow: "none",
};

const baseIconStyle: CSSProperties = {
  width: 14,
  height: 14,
  flexShrink: 0,
};

const copyIconStyle: CSSProperties = {
  ...baseIconStyle,
};

// 辅助函数（放在组件外部）
const handleCopyToClipboard = async (content: string): Promise<void> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(content);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    message.success("复制成功！");
  } catch (error) {
    message.error("复制失败，请稍后重试");
  }
};

export const MessageFooter: React.FC<MessageFooterProps> = ({ content, info }) => {
  // 设置：定义状态和使用钩子
  const { openDrawer, setSources } = useSources();

  // 逻辑：处理组件的数据，为渲染做准备
  const { status, key, extraInfo } = info || {};
  const rawSources = (extraInfo?.sources as SourceItem[]) || [];
  const textContent = typeof content === "string" ? content : String(content ?? "");
  const usedKeys = extractUsedSourceKeys(textContent);
  const filteredSources =
    usedKeys.length > 0
      ? rawSources.filter((item) => usedKeys.includes(item.key))
      : rawSources;

  const sourceCount = filteredSources.length;
  const hasSources = sourceCount > 0;
  const messageId = key as string;

  // 守卫子句：在 JSX 返回之前处理异常情况
  if (!messageId || status === "updating" || status === "loading") {
    return null;
  }

  // 事件处理函数
  const handleOpenSources = () => {
    if (!hasSources) return;
    setSources(filteredSources);
    openDrawer(filteredSources[0].key);
  };

  const handleCopy = () => {
    handleCopyToClipboard(textContent);
  };

  // 标记：组件正常情况下的 JSX 渲染结果
  return (
    <div style={containerStyle}>
      <div style={footerRowStyle}>
        {hasSources ? (
          <button
            type="button"
            className="message-footer-button"
            style={referenceButtonStyle}
            onClick={handleOpenSources}
          >
            <div style={referenceTextWrapperStyle}>
              <span style={referenceTextStyle}>参考来源</span>
              <span style={referenceNumberStyle}>{sourceCount}</span>
            </div>
          </button>
        ) : null}

        <button
          type="button"
          className="message-footer-button"
          style={copyButtonStyle}
          onClick={handleCopy}
        >
          <img src={copyIcon} alt="copy" style={copyIconStyle} />
        </button>
      </div>
    </div>
  );
};

