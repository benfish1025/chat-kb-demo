# Chatbot API

目标：用 **SSE 代替 WebSocket** 仅保留一个接口：
- `POST /api/messages`（SSE）
 
1) 聊天记录不在后端存储；前端需为每个 `conversation_id` 全量保存历史。  
2) 传给大模型的历史仅取 **最近 3 轮**（最多 6 条 messages），不足则全传；再加上本轮 `content`。  
3) 证据展示：
   - `chunk`：在回答内容中用 `<sup>` 标记引用，点击后从 `sources` 里展示对应 `description`（chunk 文本）。
   - `file`：`sources[*].file` 提供可打开的文件地址（目前主要为 PDF；也可为文本等）。
5) 多用户可以并发对话；同一 `conversation_id` 内后端会顺序化处理（避免乱序）。

## POST `/api/messages`（SSE）

请求头：
```
Content-Type: application/json
Accept: text/event-stream
```

请求体：
```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "content": "用户输入的消息内容",
  "messages": [
    { "role": "user", "content": "历史用户消息1" },
    { "role": "assistant", "content": "历史助手回复1（包含 Markdown 与 <sup>）" }
  ],
  "stream": true
}
```

字段说明：
- `id`：前端生成的 `conversation_id`（uuid）。
- `content`：本轮用户输入。
- `messages`：该 `conversation_id` 的**全量历史**（前端保存并回传）。后端只会截取最近 6 条用于 LLM 上下文。
- `stream`：保留字段，默认 `true`。

### 2.1 SSE 响应事件

服务端按行推送（每行以 `data:` 开头）：
```text
data: {"type":"chunk","content":"内容片段","id":"<conversation_id>"}
data: {"type":"sources","sources":[{"key":1,"chunk_id":"<chunk_id>","file_id":"<file_id>","title":"xxx","file":"<url>","description":"chunk 文本"}],"id":"<conversation_id>"}
data: {"type":"title","title":"自动标题","id":"<conversation_id>"}
data: {"type":"done","status":"success","id":"<conversation_id>"}
data: [DONE]
```

事件类型：
- `chunk`：回复内容片段（前端拼接后渲染 Markdown；内容内可能含 `<sup>` 引用标注）。
- `sources`：引用来源数组（所有 `chunk` 发送完后、`done` 之前发送）。
- `title`：仅首轮会话返回（`messages=[]` 时）。
- `done`：结束事件（`status`: `success|error|abort`）。
- `error`：错误事件（见 2.2）。

### 2.2 错误事件

发生错误时，会推送：
```text
data: {"type":"error","message":"context_too_long","code":413,"id":"<conversation_id>"}
data: {"type":"done","status":"error","id":"<conversation_id>"}
data: [DONE]
```

常见 `code`：
- `413`：上下文过长（建议前端提示新开对话）。
- `429`：同一会话繁忙或服务繁忙（建议重试）。
- `500`：内部错误（提示稍后重试）。

## 3. 引用标注（<sup>）

回答内容中用 `<sup>` 标注证据来源：
- `<sup>` 中的数字对应 `sources[*].key`
- 支持多个：`...<sup>1</sup><sup>3</sup>`

后端会通过 system prompt 强制模型使用 `<sup>`，并在模型未按要求输出时追加兜底 `<sup>` 标记（只要本轮检索到 sources）。

