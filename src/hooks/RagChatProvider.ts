import {
  AbstractChatProvider,
  type TransformMessage,
  type XModelMessage,
  type XRequestOptions,
  type SSEOutput,
} from "@ant-design/x-sdk";

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

    const merged = {
      ...(baseParams || {}),
      ...(requestParams || {}),
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

    // 取当前已展示的内容
    const originContent =
      typeof (originMessage as XModelMessage | undefined)?.content === "string"
        ? ((originMessage as XModelMessage).content as string)
        : ((originMessage as XModelMessage | undefined)?.content as any)?.text || "";

    let content = originContent || "";

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
              // 当前 UI 的 sources 采用静态配置，暂不处理服务端返回的 sources
              // 如需接入，可在此将 sources 存到 extraInfo 中
              break;
            }
            case "error": {
              content = data.message || originContent || "";
              break;
            }
            case "done":
            case "title":
            default:
              // 对于 done/title 等事件，不修改已有内容
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

    return {
      role: "assistant",
      content,
    } as unknown as ChatMessage;
  }
}


