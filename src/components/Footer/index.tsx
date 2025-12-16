import React from "react";
import { SyncOutlined } from "@ant-design/icons";
import { Actions } from "@ant-design/x";
import { ChatContext } from "../../contexts/ChatContext";
import locale from "../../_utils/local";

interface FooterProps {
  id?: string;
  content: string;
  status?: string;
}

export const Footer: React.FC<FooterProps> = ({ id, content, status }) => {
  const context = React.useContext(ChatContext);
  const Items = [
    {
      key: "retry",
      label: locale.retry,
      icon: <SyncOutlined />,
      onItemClick: () => {
        if (id) {
          context?.onReload?.(id, {
            userAction: "retry",
          });
        }
      },
    },
    {
      key: "copy",
      actionRender: <Actions.Copy text={content} />,
    },
  ];
  return status !== "updating" && status !== "loading" ? (
    <div style={{ display: "flex" }}>{id && <Actions items={Items} />}</div>
  ) : null;
};
