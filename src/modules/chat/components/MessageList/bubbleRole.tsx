import type { BubbleListProps } from "@ant-design/x";
import { MessageFooter } from "@/modules/chat/components/MessageList/MessageFooter";
import { MessageContent } from "@/modules/chat/components/MessageList/MessageContent";

// 从消息内容中提取所有出现过的 <sup>数字</sup> 引用 key
export const extractUsedSourceKeys = (content: string): number[] => {
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
    footer: (content, info) => <MessageFooter content={content} info={info} />,
    contentRender: (content: string, info) => (
      <MessageContent content={content} className={className} info={info} />
    ),
  },
  user: { placement: "end" },
});

