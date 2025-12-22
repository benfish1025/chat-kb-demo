import type { DefaultMessageInfo, XModelMessage } from "@ant-design/x-sdk";

export type ChatMessage = DefaultMessageInfo<XModelMessage>;

export interface SourceItem {
  /**
   * 引用序号，对应 Markdown 中的 <sup>数字</sup>
   */
  key: number;
  /**
   * 来源标题
   */
  title: string;
  /**
   * 文件地址，对应后端返回的 file 字段
   */
  url: string;
  /**
   * 片段文本或摘要
   */
  description?: string;
  /**
   * 后端返回的 chunk_id（可选，用于后续扩展）
   */
  chunkId?: string;
  /**
   * 后端返回的 file_id（可选，用于后续扩展）
   */
  fileId?: string;
}
