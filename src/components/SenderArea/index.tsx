import React, { useEffect, useRef } from "react";
import { OpenAIOutlined } from "@ant-design/icons";
import { Sender } from "@ant-design/x";
import { Flex, type GetRef } from "antd";
import { slotConfig } from "../../config/sender";
import locale from "../../_utils/local";

interface SenderAreaProps {
  curConversation: string;
  isRequesting: boolean;
  onRequest: (val: string) => void;
  onCancel: () => void;
  deepThink: boolean;
  onDeepThinkChange: (checked: boolean) => void;
}

export const SenderArea: React.FC<SenderAreaProps> = ({
  curConversation,
  isRequesting,
  onRequest,
  onCancel,
  deepThink,
  onDeepThinkChange,
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
      slotConfig={slotConfig}
      loading={isRequesting}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      placeholder={locale.placeholder}
      footer={(actionNode) => {
        return (
          <Flex justify="space-between" align="center">
            <Flex gap="small" align="center">
              <Sender.Switch
                value={deepThink}
                onChange={onDeepThinkChange}
                icon={<OpenAIOutlined />}
              >
                {locale.deepThink}
              </Sender.Switch>
            </Flex>
            <Flex align="center">{actionNode}</Flex>
          </Flex>
        );
      }}
      autoSize={{ minRows: 3, maxRows: 6 }}
    />
  );
};
