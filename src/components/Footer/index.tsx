import React from "react";
import type { CSSProperties } from "react";
import { message } from "antd";

import type { SourceItem } from "../../config/sources";
import { useSources } from "../../contexts/SourcesContext";
import copyIcon from "../../assets/copy.svg";

interface FooterProps {
  id?: string;
  content: string;
  status?: string;
  sources?: SourceItem[];
}

export const Footer: React.FC<FooterProps> = ({ id, content, status, sources }) => {
  const { openDrawer, setSources } = useSources();
  const allSources: SourceItem[] = sources || [];
  const sourceCount = allSources.length || 0;

  // 点击「参考来源」时，直接打开来源详情 Drawer，展示所有来源
  const handleOpenSources = () => {
    if (!allSources.length) return;
    setSources(allSources);
    // 默认高亮第一个来源，便于用户感知位置
    openDrawer(allSources[0].key);
  };

  const handleCopy = async () => {
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

  if (!id || status === "updating" || status === "loading") {
    return null;
  }

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

  return (
    <div style={containerStyle}>
      <div style={footerRowStyle}>
        {sourceCount > 0 && (
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
        )}

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
