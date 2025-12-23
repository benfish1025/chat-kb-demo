import React from "react";
import { Flex } from "antd";

interface SenderFooterProps {
  actionNode: React.ReactNode;
}

export const SenderFooter: React.FC<SenderFooterProps> = ({ actionNode }) => {
  return (
    <Flex justify="flex-end" align="center">
      <Flex align="center">{actionNode}</Flex>
    </Flex>
  );
};

