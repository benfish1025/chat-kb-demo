import React, { useEffect, useRef } from "react";
import { Sender } from "@ant-design/x";
import { Flex, type GetRef } from "antd";
import locale from "../../_utils/local";

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
      placeholder={locale.placeholder}
      footer={(actionNode) => {
        return (
          <Flex justify="flex-end" align="center">
            <Flex align="center">{actionNode}</Flex>
          </Flex>
        );
      }}
      autoSize={{ minRows: 3, maxRows: 6 }}
    />
  );
};
