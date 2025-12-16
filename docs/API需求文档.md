# API 需求文档

## 1. 概述

本文档描述了大模型会话应用的后端 API 需求。应用主要功能包括：

- **大模型会话**：支持多轮对话，流式响应
- **引用信息显示**：在消息中支持来源引用标注

## 2. 技术规范

### 2.1 通信协议

- **协议**：HTTP/HTTPS
- **数据格式**：JSON
- **流式传输**：Server-Sent Events (SSE)
- **字符编码**：UTF-8

### 2.2 认证方式

- **推荐**：Bearer Token (JWT) 或 API Key
- **Header**：`Authorization: Bearer <token>`

## 3. API 接口定义

### 3.1 会话管理

#### 3.1.1 创建会话

**接口**：`POST /api/conversations`

**请求体**：

```json
{
  "title": "新对话", // 可选，默认自动生成
  "model": "glm-4.5-flash" // 可选，使用的模型
}
```

**响应**：

```json
{
  "code": 200,
  "data": {
    "conversationId": "conv_1234567890",
    "title": "新对话",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 3.1.2 获取会话列表

**接口**：`GET /api/conversations`

**查询参数**：

- `page`: 页码（默认 1）
- `pageSize`: 每页数量（默认 20）
- `groupBy`: 分组方式（可选：date, none）

**响应**：

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "conversationId": "conv_1234567890",
        "title": "对话标题",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "group": "今天" // 用于前端分组显示
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

#### 3.1.3 获取会话详情

**接口**：`GET /api/conversations/:conversationId`

**响应**：

```json
{
  "code": 200,
  "data": {
    "conversationId": "conv_1234567890",
    "title": "对话标题",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "messages": [
      {
        "messageId": "msg_001",
        "role": "user",
        "content": "用户消息内容",
        "status": "success",
        "createdAt": "2024-01-01T00:00:00Z"
      },
      {
        "messageId": "msg_002",
        "role": "assistant",
        "content": "助手回复内容",
        "status": "success",
        "sources": [
          {
            "key": 1,
            "title": "来源标题",
            "url": "https://example.com",
            "description": "来源描述"
          }
        ],
        "createdAt": "2024-01-01T00:00:01Z"
      }
    ]
  }
}
```

#### 3.1.4 更新会话标题

**接口**：`PUT /api/conversations/:conversationId`

**请求体**：

```json
{
  "title": "新的对话标题"
}
```

#### 3.1.5 删除会话

**接口**：`DELETE /api/conversations/:conversationId`

**响应**：

```json
{
  "code": 200,
  "message": "删除成功"
}
```

### 3.2 消息发送（流式响应）

#### 3.2.1 发送消息

**接口**：`POST /api/conversations/:conversationId/messages`

**请求头**：

```
Content-Type: application/json
Accept: text/event-stream  // 流式响应
```

**请求体**：

```json
{
  "content": "用户输入的消息内容",
  "model": "glm-4.5-flash", // 可选
  "stream": true, // 是否流式返回
  "temperature": 0.7, // 可选，控制随机性
  "maxTokens": 2000, // 可选，最大token数
  "deepThink": false // 可选，是否启用深度思考模式
}
```

**响应格式（SSE 流式）**：

```
data: {"type":"chunk","content":"这是","messageId":"msg_002"}

data: {"type":"chunk","content":"一段","messageId":"msg_002"}

data: {"type":"chunk","content":"流式","messageId":"msg_002"}

data: {"type":"chunk","content":"内容","messageId":"msg_002"}

data: {"type":"sources","sources":[{"key":1,"title":"来源1","url":"https://example.com","description":"描述"}],"messageId":"msg_002"}

data: {"type":"done","messageId":"msg_002","status":"success"}

data: [DONE]
```

**响应字段说明**：

- `type`: 事件类型
  - `chunk`: 内容片段
  - `sources`: 引用来源（在消息完成后发送）
  - `done`: 消息完成
  - `error`: 错误信息
- `content`: 消息内容片段（仅 chunk 类型）
- `messageId`: 消息ID
- `sources`: 引用来源数组（仅 sources 类型）
- `status`: 状态（success, error, abort）

**完整消息响应示例（非流式）**：

```json
{
  "code": 200,
  "data": {
    "messageId": "msg_002",
    "role": "assistant",
    "content": "完整的回复内容",
    "status": "success",
    "sources": [
      {
        "key": 1,
        "title": "来源标题1",
        "url": "https://example.com/source1",
        "description": "来源描述1"
      },
      {
        "key": 2,
        "title": "来源标题2",
        "url": "https://example.com/source2"
      }
    ],
    "createdAt": "2024-01-01T00:00:01Z"
  }
}
```

#### 3.2.2 中止消息生成

**接口**：`POST /api/conversations/:conversationId/messages/:messageId/abort`

**响应**：

```json
{
  "code": 200,
  "message": "已中止"
}
```

#### 3.2.3 重新生成消息

**接口**：`POST /api/conversations/:conversationId/messages/:messageId/regenerate`

**请求体**：

```json
{
  "model": "glm-4.5-flash", // 可选
  "stream": true
}
```

**响应**：同 3.2.1 发送消息

### 3.3 引用来源管理

#### 3.3.1 获取消息的引用来源

**接口**：`GET /api/conversations/:conversationId/messages/:messageId/sources`

**响应**：

```json
{
  "code": 200,
  "data": {
    "messageId": "msg_002",
    "sources": [
      {
        "key": 1,
        "title": "来源标题",
        "url": "https://example.com",
        "description": "来源描述（可选）"
      }
    ]
  }
}
```

## 4. 数据模型

### 4.1 消息数据结构

```typescript
interface Message {
  messageId: string; // 消息唯一标识
  conversationId: string; // 所属会话ID
  role: "user" | "assistant"; // 角色
  content: string; // 消息内容（支持 Markdown，包含 <sup> 标签）
  status: "loading" | "updating" | "success" | "error" | "abort"; // 状态
  sources?: SourceItem[]; // 引用来源（仅 assistant 消息）
  createdAt: string; // ISO 8601 格式时间戳
  updatedAt?: string; // 更新时间
}

interface SourceItem {
  key: number; // 来源编号（对应 <sup> 标签中的数字）
  title: string; // 来源标题
  url: string; // 来源链接
  description?: string; // 来源描述（可选）
}
```

### 4.2 会话数据结构

```typescript
interface Conversation {
  conversationId: string; // 会话唯一标识
  title: string; // 会话标题
  model?: string; // 使用的模型
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  group?: string; // 分组标识（如：今天、昨天）
}
```

## 5. 消息内容格式规范

### 5.1 Markdown 支持

消息内容支持标准 Markdown 语法，包括：

- 标题、列表、代码块
- 粗体、斜体
- 链接、图片

### 5.2 引用标注格式

在消息内容中使用 `<sup>` 标签标注引用：

```markdown
这是普通文本内容。<sup>1</sup> 这里引用了第一个来源。

继续的内容。<sup>2</sup> 这里引用了第二个来源。
```

**规则**：

- `<sup>` 标签中的数字对应 `sources` 数组中的 `key`
- 后端需要在响应中提供完整的 `sources` 数组
- 前端会根据 `key` 匹配并显示对应的来源信息

### 5.3 示例消息内容

```json
{
  "content": "Ant Financial 拥有大量企业级产品。<sup>1</sup> 在复杂场景下，设计师和开发者经常需要快速响应。<sup>2</sup> 通过抽象，我们可以获得一些稳定且高度可复用的组件和页面。<sup>3</sup>",
  "sources": [
    {
      "key": 1,
      "title": "Ant Design 官方文档",
      "url": "https://ant.design/docs/react/introduce",
      "description": "Ant Design 是一个企业级 UI 设计语言和 React UI 库"
    },
    {
      "key": 2,
      "title": "React 最佳实践",
      "url": "https://react.dev/learn"
    },
    {
      "key": 3,
      "title": "组件设计模式",
      "url": "https://example.com/patterns"
    }
  ]
}
```

## 6. 错误处理

### 6.1 错误响应格式

```json
{
  "code": 400,
  "message": "错误描述",
  "error": {
    "type": "VALIDATION_ERROR",
    "details": "详细错误信息"
  }
}
```

### 6.2 常见错误码

| 错误码 | 说明                       |
| ------ | -------------------------- |
| 200    | 成功                       |
| 400    | 请求参数错误               |
| 401    | 未授权                     |
| 403    | 无权限                     |
| 404    | 资源不存在                 |
| 429    | 请求频率限制               |
| 500    | 服务器内部错误             |
| 502    | 网关错误（大模型服务异常） |
| 503    | 服务不可用                 |

### 6.3 流式响应错误处理

当流式响应出现错误时，发送错误事件：

```
data: {"type":"error","message":"错误信息","code":500}

data: [DONE]
```

## 7. 性能要求

### 7.1 响应时间

- 首次响应时间（TTFB）：< 2s
- 流式响应延迟：< 100ms/片段

### 7.2 并发支持

- 支持多会话并发
- 单个用户建议支持至少 10 个并发会话

### 7.3 流式传输

- 使用 SSE 协议
- 支持客户端中止连接
- 支持服务端主动关闭连接

## 8. 安全要求

### 8.1 认证授权

- 所有 API 需要认证
- 会话隔离：用户只能访问自己的会话

### 8.2 输入验证

- 消息内容长度限制：建议最大 10000 字符
- 防止 XSS 攻击
- 防止 SQL 注入（如使用数据库）

### 8.3 速率限制

- 消息发送频率限制：建议 10 条/分钟/用户
- 会话创建限制：建议 100 个/天/用户

## 9. 扩展性考虑

### 9.1 模型切换

- 支持通过参数指定不同模型
- 支持模型版本管理

### 9.2 功能扩展

- 支持文件上传（未来）
- 支持多模态输入（未来）
- 支持插件系统（未来）

## 10. 测试建议

### 10.1 功能测试

- 正常消息发送和接收
- 流式响应完整性
- 引用来源正确匹配
- 会话管理 CRUD 操作

### 10.2 异常测试

- 网络中断处理
- 服务异常处理
- 超时处理
- 并发压力测试

## 11. 接口对接示例

### 11.1 完整对话流程

```javascript
// 1. 创建会话
POST /api/conversations
Response: { conversationId: "conv_123" }

// 2. 发送消息（流式）
POST /api/conversations/conv_123/messages
Request: { content: "你好", stream: true }
Response: SSE stream

// 3. 获取会话历史
GET /api/conversations/conv_123
Response: { messages: [...] }

// 4. 删除会话
DELETE /api/conversations/conv_123
```

### 11.2 SSE 流式响应处理示例

```javascript
const eventSource = new EventSource("/api/conversations/conv_123/messages", {
  method: "POST",
  body: JSON.stringify({ content: "你好", stream: true }),
});

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "chunk") {
    // 追加内容片段
    appendContent(data.content);
  } else if (data.type === "sources") {
    // 显示引用来源
    displaySources(data.sources);
  } else if (data.type === "done") {
    // 消息完成
    eventSource.close();
  }
};
```

## 12. 附录

### 12.1 参考实现

当前前端使用的 API 端点示例：

- 基础 URL: `https://api.x.ant.design/api/big_model_glm-4.5-flash`
- 请求方式: POST
- 流式传输: SSE

### 12.2 联系方式

如有疑问，请联系前端开发团队。

---

**文档版本**: v1.0  
**最后更新**: 2024-01-01
