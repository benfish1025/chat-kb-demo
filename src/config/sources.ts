export interface SourceItem {
  title: string;
  key: number;
  url: string;
  description?: string;
}

/**
 * 来源数据配置
 * 可以根据实际需求修改或扩展
 *
 * 使用示例：
 * 在消息内容中使用 <sup>1</sup> 来引用第一个来源
 * 例如：Ant Financial has a large number of enterprise-level products.<sup>1</sup>
 */
export const DEFAULT_SOURCES: SourceItem[] = [
  {
    title: "1. Data source",
    key: 1,
    url: "https://x.ant.design/components/overview",
    description:
      "Artificial Intelligence, often abbreviated as AI, is a broad branch of computer science concerned with building smart machines capable of performing tasks that typically require human intelligence.",
  },
  {
    title: "2. Data source",
    key: 2,
    url: "https://x.ant.design/components/overview",
  },
  {
    title: "3. Data source",
    key: 3,
    url: "https://x.ant.design/components/overview",
  },
];
