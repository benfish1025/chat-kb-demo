import XMarkdown from "@ant-design/x-markdown";
import type { BubbleListProps } from "@ant-design/x";
import { Footer } from "../components/Footer";
import { SourcesComponent } from "../components/SourcesComponent";
import type { SourceItem } from "../config/sources";

// 从消息内容中提取所有出现过的 <sup>数字</sup> 引用 key
const extractUsedSourceKeys = (content: string): number[] => {
  if (!content) return [];
  const regex = /<sup>(\d+)<\/sup>/g;
  const set = new Set<number>();
  let match: RegExpExecArray | null;

  // 遍历所有匹配，收集数字
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(content)) !== null) {
    const index = Number(match[1]);
    if (!Number.isNaN(index)) {
      set.add(index);
    }
  }

  return Array.from(set);
};

export const getRole = (className: string): BubbleListProps["role"] => ({
  assistant: {
    placement: "start",
    footer: (content, info) => {
      const { status, key, extraInfo } = info || {};
      const rawSources = (extraInfo?.sources as SourceItem[]) || [];
      const textContent = typeof content === "string" ? content : String(content ?? "");
      const usedKeys = extractUsedSourceKeys(textContent);
      const filteredSources =
        usedKeys.length > 0
          ? rawSources.filter((item) => usedKeys.includes(item.key))
          : rawSources;

      return (
        <Footer
          content={textContent}
          status={status}
          id={key as string}
          sources={filteredSources}
        />
      );
    },
    contentRender: (content: string, info) => {
      const { status, extraInfo, key } = info || {};
      const rawSources = (extraInfo?.sources as SourceItem[]) || [];
      const usedKeys = extractUsedSourceKeys(content);
      const filteredSources =
        usedKeys.length > 0
          ? rawSources.filter((item) => usedKeys.includes(item.key))
          : rawSources;

      const text = content.trim().length > 0 ? content : "思考中...";

      return (
        <XMarkdown
          paragraphTag="p"
          className={className}
          streaming={{
            hasNextChunk: status === "updating",
            enableAnimation: true,
          }}
          components={{
            sup: (props) => (
              <SourcesComponent
                {...props}
                sources={filteredSources}
                messageId={key as string}
              />
            ),
          }}
        >
          {text}
        </XMarkdown>
      );
    },
  },
  user: { placement: "end" },
});
