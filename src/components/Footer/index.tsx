import React, { useMemo, useState } from "react";
import type { CSSProperties } from "react";

import { DEFAULT_SOURCES } from "../../config/sources";
import { useSources } from "../../contexts/SourcesContext";
import copyIcon from "../../assets/copy.svg";
import spreadSourcesIcon from "../../assets/spread-sources.svg";

interface FooterProps {
  id?: string;
  content: string;
  status?: string;
}

export const Footer: React.FC<FooterProps> = ({ id, content, status }) => {
  const { openDrawer } = useSources();
  const [expanded, setExpanded] = useState(true);
  const [hoveredKey, setHoveredKey] = useState<number | null>(null);

  const sourceIndexes = useMemo(() => {
    const regex = /<sup>(\d+)<\/sup>/g;
    const set = new Set<number>();
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      const index = Number(match[1]);
      if (!Number.isNaN(index)) {
        set.add(index);
      }
    }

    return Array.from(set).sort((a, b) => a - b);
  }, [content]);

  const sourceCount = sourceIndexes.length || DEFAULT_SOURCES.length || 0;

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const handleSourceClick = (key: number) => {
    openDrawer(key);
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

  const displaySources = useMemo(() => {
    if (!DEFAULT_SOURCES.length) return [];
    if (!sourceIndexes.length) return DEFAULT_SOURCES;

    return DEFAULT_SOURCES.filter((item) => sourceIndexes.includes(item.key));
  }, [sourceIndexes]);

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

  const referenceIconStyle: CSSProperties = {
    ...baseIconStyle,
    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.2s ease",
  };

  const copyIconStyle: CSSProperties = {
    ...baseIconStyle,
  };

  const titlesContainerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
    alignSelf: "stretch",
  };

  const titleItemStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    alignSelf: "stretch",
  };

  const titleKeyStyle: CSSProperties = {
    color: "rgba(0, 0, 0, 0.76)",
    fontFamily:
      '"PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "24px",
  };

  const titleTextStyle: CSSProperties = {
    color: "rgba(0, 0, 0, 0.76)",
    fontFamily:
      '"PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "24px",
  };

  return (
    <div style={containerStyle}>
      <div style={footerRowStyle}>
        <button type="button" style={referenceButtonStyle} onClick={handleToggleExpand}>
          <img src={spreadSourcesIcon} alt="sources" style={referenceIconStyle} />
          <div style={referenceTextWrapperStyle}>
            <span style={referenceTextStyle}>参考来源</span>
            <span style={referenceNumberStyle}>{sourceCount}</span>
          </div>
        </button>

        <button type="button" style={copyButtonStyle} onClick={handleCopy}>
          <img src={copyIcon} alt="copy" style={copyIconStyle} />
          <span style={copyTextStyle}>复制</span>
        </button>
      </div>

      {expanded && displaySources.length > 0 && (
        <div style={titlesContainerStyle}>
          {displaySources.map((source) => (
            <div
              key={source.key}
              style={{
                ...titleItemStyle,
                cursor: "pointer",
                opacity: hoveredKey === source.key ? 0.5 : 1,
                transition: "opacity 0.2s ease",
              }}
              onClick={() => handleSourceClick(source.key)}
              onMouseEnter={() => setHoveredKey(source.key)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              <span style={titleKeyStyle}>{source.key}</span>
              <span style={titleTextStyle}>{source.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
