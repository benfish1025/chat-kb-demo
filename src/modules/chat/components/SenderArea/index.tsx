import React, { useEffect, useRef } from "react";
import { Sender } from "@ant-design/x";
import type { GetRef } from "antd";
import { useAppStyles } from "@/common/styles/useAppStyles";
import { useChatContext } from "@/modules/chat/contexts/ChatContext";
import { SenderFooter } from "@/modules/chat/components/SenderArea/SenderFooter";

const senderStyles = {
  root: {
    display: "flex",
    width: "100%",
    maxWidth: 896,
    minHeight: 138,
    padding: 12,
    flexDirection: "column" as const,
    alignItems: "stretch" as const,
    borderRadius: 20,
    border: "1px solid rgba(18, 31, 43, 0.16)",
    background: "#FFF",
    transition: "all 0.2s ease",
  },
};

export const SenderArea: React.FC = () => {
  // 设置：定义状态和使用钩子
  const { curConversation, isRequesting, onRequest, onCancel } = useChatContext();
  const { styles } = useAppStyles();
  const senderRef = useRef<GetRef<typeof Sender>>(null);

  // 逻辑：处理组件的数据，为渲染做准备
  useEffect(() => {
    senderRef.current?.focus?.({
      cursor: "end",
    });
  }, [curConversation]);

  const handleSubmit = (val: string) => {
    if (!val) return;
    onRequest(val);
    senderRef.current?.clear?.();
  };

  // 标记：组件正常情况下的 JSX 渲染结果
  return (
    <Sender
      suffix={false}
      ref={senderRef}
      key={curConversation}
      loading={isRequesting}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      placeholder="有问题，尽管问"
      rootClassName={styles.senderRoot}
      styles={senderStyles}
      footer={(actionNode) => <SenderFooter actionNode={actionNode} />}
      autoSize={{ minRows: 2, maxRows: 7 }}
    />
  );
};

