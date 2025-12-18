import React from "react";
import type { CSSProperties } from "react";

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
        return;
      }

      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch (error) {
      // 忽略复制失败，避免影响主流程
      // 可以在这里添加日志或提示
      // console.error("Copy failed:", error);
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
    padding: "3px 10px",
    alignItems: "center",
    gap: 6,
    appearance: "none",
    outline: "none",
    borderRadius: 8,
    border: "1px solid rgba(0, 0, 0, 0.20)",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.08)",
    cursor: "pointer",
    background: "#FFF",
  };

  const referenceTextWrapperStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 4,
  };

  const referenceTextStyle: CSSProperties = {
    color: "#000",
    fontFamily:
      '"PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "24px",
  };

  const referenceNumberStyle: CSSProperties = {
    color: "#868B8F",
    fontFamily:
      '"PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "24px",
  };

  const copyButtonStyle: CSSProperties = {
    display: "flex",
    padding: "3px 10px",
    borderRadius: 8,
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    appearance: "none",
    outline: "none",
    border: "none",
    background: "#F4F6F7",
    boxShadow: "none",
  };

  const copyTextStyle: CSSProperties = {
    color: "#000",
    fontFamily:
      '"PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "24px",
  };

  const baseIconStyle: CSSProperties = {
    width: 18,
    height: 18,
    flexShrink: 0,
  };

  const copyIconStyle: CSSProperties = {
    ...baseIconStyle,
  };

  return (
    <div style={containerStyle}>
      <div style={footerRowStyle}>
        {sourceCount > 0 && (
          <button type="button" style={referenceButtonStyle} onClick={handleOpenSources}>
            <div style={referenceTextWrapperStyle}>
              <span style={referenceTextStyle}>参考来源</span>
              <span style={referenceNumberStyle}>{sourceCount}</span>
            </div>
          </button>
        )}

        <button type="button" style={copyButtonStyle} onClick={handleCopy}>
          <img src={copyIcon} alt="copy" style={copyIconStyle} />
          <span style={copyTextStyle}>复制</span>
        </button>
      </div>
    </div>
  );
};
