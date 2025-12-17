## API 接口定义

**接口**：`POST /api/messages`

**请求头**：

```
Content-Type: application/json
Accept: text/event-stream  // 流式响应
```

**请求体**：

```json

{
  "id": "xxxxxxx", // 前端生成，在参数中加入此id，以标识一个 conversation
  "content": "用户输入的消息内容",
  "messages": [
    {
      "role": "user",
      "content": "历史用户消息1"
    },
    {
      "role": "assistant",
      "content": "历史助手回复1"
    },
    {
      "role": "user",
      "content": "历史用户消息2"
    }
  ],
  "stream": true, // 默认流式的话，这个字段也可不传
}

```


**请求字段说明**：

- `content`: **必填**，当前用户输入的消息内容
- `messages`: **必填**，历史消息数组（包含所有之前的 user 和 assistant 消息对）
- 首次对话时，`messages` 为空数组 `[]`
- 继续对话时，前端需要将会话历史作为 `messages` 传递
- 由于上下文窗口限制，不能够始终传递全部会话历史。默认传入最近的5条消息。
- 每个消息对象包含 `role`（"user" 或 "assistant"）和 `content`
- 历史消息中的 `content` 应包含完整的 Markdown 内容和 `<sup>` 标签
- `stream`: 是否流式返回，流式是标准方案，应始终为 `true`

**响应格式（SSE 流式）**：

```
data: {"type":"chunk","content":"内容", "id":"xxxxxxxx"}
data: {"type":"chunk","content":"内容", "id":"xxxxxxxx"}
data: {"type":"chunk","content":"内容", "id":"xxxxxxxx"}
data: {"type":"chunk","content":"内容", "id":"xxxxxxxx"}
data: {"type":"sources","sources":[{"key":1,"title":"来源来源","file":"文件地址","description":"描述"}], "id":"xxxxxxxx"}
data: {"type":"error","message":"错误信息","code":500}
data: {"type":"done","status":"success", "id":"xxxxxxxx"}
data: [DONE]
```


**响应字段说明**：

- `type` 字段: 事件类型，包含以下类型
	- `chunk`: 内容片段，包含部分回复内容
	- `sources`: 引用来源（在内容流完成后发送，包含完整的 sources 数组）
	- `title`：大模型根据首轮对话生成标题，会在流式记录中返回。收到返回后，前端立即更新。
	- `done`: 消息完成，表示整个响应结束
	- `error`: 错误信息
- `status` 字段: 状态（success, error, abort），仅在 `done`类型中出现。 `sources` 事件在所有 `chunk` 事件之后、`done` 事件之前发送。
- `content` 字段: 消息内容片段，仅在 chunk 类型中出现，前端需要将所有 chunk 拼接成完整内容
- `sources`: 引用来源数组（仅 sources 类型）
- `id`: 此处的id是在首个消息中，前端发给后端的代表 conversation 的 id。
- `message` 和 `code` 字段：在错误时出现。

## 消息内容格式
  
### Markdown语法

消息内容使用标准 Markdown 语法输出。
### 引用标注格式

在消息内容中使用 `<sup>` 标签标注引用：
- `<sup>` 标签中的数字对应流式响应中 `sources` 数组中的 `key`
- 后端需在响应中提供完整的 `sources` 数组
- 前端会根据 `key` 匹配并显示对应的来源信息

```markdown

这是普通文本内容。<sup>1</sup><sup>3</sup>继续的内容。<sup>2</sup>

```

## 错误处理格式

### 错误消息格式

```json
{
    "success": false,
    "error": {
        "code": "1302",
        "message": "您当前使用该API的并发数过高"
    }
}
```


**问题：消息 ID 生成**

前端需要为每条消息生成唯一 ID，建议使用：
- `uuid` 库：`uuidv4()`
- 时间戳 + 随机数：`Date.now() + Math.random()`
- 自增 ID：适合单会话场景

**问题：并发请求冲突**

- **现象**：用户快速连续发送消息，可能导致请求失败
- **解决方案**：
- 实现请求队列，确保同一时间只有一个请求
- 在请求进行中禁用发送按钮
- 显示"正在处理中"状态

**问题：服务不可用**

- **现象**：后端正在处理其他用户的请求，返回 503
- **解决方案**：
- 前端实现重试机制（指数退避）
- 提示用户"服务繁忙，请稍后重试"
- 考虑实现请求排队提示  

**问题：历史消息过长**

- **现象**：会话历史过长，导致 token 超限或请求过大
- **解决方案**：
- 限制单次请求的历史消息数量（如最多 50 条）

**问题：存储空间不足**

- **现象**：localStorage 存储空间有限，可能无法保存所有会话
- **解决方案**：
- 限制会话数量（如最多保存 50 个会话）

**问题：Sources 在 SSE 最后发送**

- **实现**：
- 在收到 `sources` 事件后，更新对应消息的 sources 字段
- 在消息内容中实时显示引用标记（`<sup>` 标签），但来源详情在流式完成后显示

**问题：网络中断**

- **现象**：SSE 连接断开，消息未完整接收
- **解决方案**：
- 监听 `error` 和 `close` 事件
- 标记消息状态为 `error`
- 显示错误信息
- 保存本地历史记录时，仅保存 message 和 resources 类型。

**问题：消息生成中断**

- **现象**：用户关闭页面或刷新，正在生成的消息丢失
- **解决方案**：
- 在收到第一个 `chunk` 时就开始保存消息（状态为 `loading`）
- 使用 `beforeunload` 事件提示用户
 