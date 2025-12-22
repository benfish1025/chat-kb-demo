import {
  AbstractChatProvider,
  type TransformMessage,
  type XModelMessage,
  type XRequestOptions,
  type SSEOutput,
} from "@ant-design/x-sdk";
import type { SourceItem } from "@/types/chat";

/**
 * 后端 /api/messages SSE 接口的请求入参
 * 对应 API 文档中的：
 * {
 *   "id": "会话ID",
 *   "content": "用户输入内容",
 *   "messages": [{ "role": "user" | "assistant", "content": "..." }],
 *   "stream": true
 * }
 */
export interface RagRequestMessage {
  role: "user" | "assistant";
  content: string;
}

export interface RagRequestParams {
  id?: string;
  content?: string;
  messages?: RagRequestMessage[];
  stream?: boolean;
  /**
   * X SDK 内部使用的“深度思考 / 思维链”配置
   * - 仅用于前端控制，不需要传给后端
   */
  thinking?: unknown;
}

/**
 * 自定义 Provider，适配当前后端简化版 SSE 返回格式
 */
export class RagChatProvider<
  ChatMessage extends XModelMessage = XModelMessage,
  Input extends RagRequestParams = RagRequestParams,
  Output extends SSEOutput = SSEOutput,
> extends AbstractChatProvider<ChatMessage, Input, Output> {
  /**
   * 合并默认 params 与 onRequest 传入的参数，并确保符合后端入参格式
   */
  transformParams(requestParams: Partial<Input>, options: XRequestOptions<Input, Output>): Input {
    if (typeof requestParams !== "object") {
      throw new Error("requestParams must be an object");
    }

    const baseParams = (options?.params || {}) as Input;

    // 从请求参数中剔除仅前端使用的字段（例如 thinking）
    const { thinking: _thinking, ...restParams } = (requestParams || {}) as Input & {
      thinking?: unknown;
    };

    const merged = {
      ...(baseParams || {}),
      ...(restParams || {}),
    } as Input;

    // 确保有会话 id（前端会用 conversationKey 作为 id 传入 params）
    if (!merged.id && (baseParams as Input)?.id) {
      merged.id = (baseParams as Input).id;
    }

    // 默认开启流式
    if (typeof merged.stream === "undefined") {
      merged.stream = true as Input["stream"];
    }

    // 若 content 为空，则尝试从 messages 中取当前用户最新一条内容
    if (!merged.content && Array.isArray(merged.messages) && merged.messages.length > 0) {
      const lastMessage = merged.messages[merged.messages.length - 1] as RagRequestMessage;
      merged.content = lastMessage?.content as Input["content"];
    }

    return merged;
  }

  /**
   * 将 onRequest 传入的参数转换为本地（用户发送）的 ChatMessage，用于立刻渲染用户消息
   */
  transformLocalMessage(requestParams: Partial<Input>): ChatMessage {
    const content = (requestParams.content ||
      (requestParams.messages && requestParams.messages[requestParams.messages.length - 1]?.content) ||
      "") as string;

    return {
      role: "user",
      content,
    } as unknown as ChatMessage;
  }

  /**
   * 将 SSE 流式返回的 chunk 转换为 ChatMessage（助手消息）
   * 适配文档中的简化格式：
   * data: {"type":"chunk","content":"内容","id":"xxx"}
   * data: {"type":"sources","sources":[...],"id":"xxx"}
   * data: {"type":"done","status":"success","id":"xxx"}
   * data: {"type":"error","message":"错误信息","code":500}
   */
  transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage {
    const { originMessage, chunk, responseHeaders } = info || {};

    const origin = (originMessage as XModelMessage | undefined) || ({} as XModelMessage);
    const originContent =
      typeof origin.content === "string"
        ? (origin.content as string)
        : (origin as any)?.content?.text || "";
    const originExtraInfo = ((origin as any).extraInfo || {}) as {
      sources?: SourceItem[];
      title?: string;
      [key: string]: any;
    };

    let content = originContent || "";
    let sources = originExtraInfo.sources || [];
    let title = originExtraInfo.title;

    try {
      const isSSE = responseHeaders.get("content-type")?.includes("text/event-stream");

      if (isSSE) {
        const raw = (chunk as SSEOutput)?.data;

        if (typeof raw === "string" && raw.trim() && raw.trim() !== "[DONE]") {
          const data = JSON.parse(raw);

          switch (data.type) {
            case "chunk": {
              if (typeof data.content === "string") {
                content = `${originContent || ""}${data.content}`;
              }
              break;
            }
            case "sources": {
              // 适配后端返回的 sources，规范化为前端 SourceItem 结构
              if (Array.isArray(data.sources)) {
                const normalized: SourceItem[] = data.sources
                  .map((item: any) => {
                    const key = Number(item?.key);
                    if (!Number.isFinite(key)) return null;
                    return {
                      key,
                      title: item?.title || item?.file || `来源 ${key}`,
                      url: item?.file || "",
                      description: item?.description,
                      chunkId: item?.chunk_id,
                      fileId: item?.file_id,
                    } as SourceItem;
                  })
                  .filter(Boolean) as SourceItem[];

                if (normalized.length) {
                  sources = normalized;
                }
              }
              break;
            }
            case "title": {
              if (typeof data.title === "string" && data.title.trim()) {
                title = data.title.trim();
              }
              break;
            }
            case "error": {
              content = data.message || originContent || "";
              break;
            }
            case "done":
            default:
              // 对于 done 等事件，不修改已有内容
              break;
          }
        }
      } else if (chunk) {
        // 非 SSE（例如一次性 JSON 返回）兜底处理
        const raw = (chunk as any).data ?? chunk;
        const data = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (data?.content && typeof data.content === "string") {
          content = data.content;
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("RagChatProvider transformMessage error:", error, chunk);
    }

    const nextExtraInfo: Record<string, any> = {
      ...originExtraInfo,
    };

    if (sources && sources.length) {
      nextExtraInfo.sources = sources;
    }
    if (title) {
      nextExtraInfo.title = title;
    }

    return {
      role: "assistant",
      content,
      // 挂载在 extraInfo 上，供 UI 展示引用来源与自动标题，并一并持久化
      extraInfo: nextExtraInfo,
    } as unknown as ChatMessage;
  }
}


