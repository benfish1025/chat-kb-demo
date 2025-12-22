import React, { useEffect, useRef } from "react";
import { Sender } from "@ant-design/x";
import { Flex, type GetRef } from "antd";
import { useAppStyles } from "@/styles/useAppStyles";

interface SenderAreaProps {
  curConversation: string;
  isRequesting: boolean;
  onRequest: (val: string) => void;
  onCancel: () => void;
}

export const SenderArea: React.FC<SenderAreaProps> = ({
  curConversation,
  isRequesting,
  onRequest,
  onCancel,
}) => {
  const { styles } = useAppStyles();
  const senderRef = useRef<GetRef<typeof Sender>>(null);

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

  return (
    <Sender
      suffix={false}
      ref={senderRef}
      key={curConversation}
      loading={isRequesting}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      placeholder={"有问题，尽管问"}
      rootClassName={styles.senderRoot}
      styles={{
        root: {
          display: "flex",
          width: "100%",
          maxWidth: 896,
          minHeight: 138,
          padding: 12,
          flexDirection: "column",
          alignItems: "stretch",
          borderRadius: 20,
          border: "border: 1px solid rgba(18, 31, 43, 0.16)",
          background: "#FFF",
          transition: "all 0.2s ease",
        },
      }}
      footer={(actionNode) => {
        return (
          <Flex justify="flex-end" align="center">
            <Flex align="center">{actionNode}</Flex>
          </Flex>
        );
      }}
      autoSize={{ minRows: 2, maxRows: 7 }}
    />

  );
};
