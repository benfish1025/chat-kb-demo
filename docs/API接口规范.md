# API 接口规范（快速参考）

## 核心接口

### 1. 会话管理

| 方法   | 路径                     | 说明                       |
| ------ | ------------------------ | -------------------------- |
| POST   | `/api/conversations`     | 创建会话                   |
| GET    | `/api/conversations`     | 获取会话列表               |
| GET    | `/api/conversations/:id` | 获取会话详情（含消息历史） |
| PUT    | `/api/conversations/:id` | 更新会话标题               |
| DELETE | `/api/conversations/:id` | 删除会话                   |

### 2. 消息发送

| 方法 | 路径                                                | 说明                      |
| ---- | --------------------------------------------------- | ------------------------- |
| POST | `/api/conversations/:id/messages`                   | 发送消息（支持 SSE 流式） |
| POST | `/api/conversations/:id/messages/:msgId/abort`      | 中止消息生成              |
| POST | `/api/conversations/:id/messages/:msgId/regenerate` | 重新生成消息              |

## 关键数据结构

### 消息响应（SSE 格式）

```json
// 内容片段
{"type":"chunk","content":"内容","messageId":"msg_001"}

// 引用来源
{"type":"sources","sources":[{"key":1,"title":"标题","url":"https://..."}],"messageId":"msg_001"}

// 完成
{"type":"done","messageId":"msg_001","status":"success"}
```

### 引用来源格式

消息内容中使用 `<sup>1</sup>` 标注，后端返回对应的 sources：

```json
{
  "content": "文本内容<sup>1</sup>更多内容<sup>2</sup>",
  "sources": [
    { "key": 1, "title": "来源1", "url": "https://..." },
    { "key": 2, "title": "来源2", "url": "https://..." }
  ]
}
```

## 必需功能

1. ✅ **流式响应**：使用 SSE 协议
2. ✅ **引用来源**：在消息完成后发送 sources 数组
3. ✅ **消息状态**：支持 loading/updating/success/error/abort
4. ✅ **会话隔离**：每个会话独立管理消息

## 注意事项

- 所有接口需要认证（Bearer Token）
- 流式响应使用 `text/event-stream` Content-Type
- 消息内容支持 Markdown + `<sup>` 标签
- sources 的 key 必须与 `<sup>` 标签中的数字对应
