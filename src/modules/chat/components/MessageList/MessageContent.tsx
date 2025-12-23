import React from "react";
import XMarkdown from "@ant-design/x-markdown";
import { SourcesComponent } from "@/modules/sources/components/SourcesComponent";
import type { SourceItem } from "@/modules/sources/types/source";
import { extractUsedSourceKeys } from "@/modules/chat/components/MessageList/bubbleRole";

interface MessageContentProps {
  content: string;
  className: string;
  info?: {
    status?: string;
    key?: string | number;
    extraInfo?: {
      sources?: SourceItem[];
    };
  };
}

export const MessageContent: React.FC<MessageContentProps> = ({ content, className, info }) => {
  const { status, extraInfo, key } = info || {};
  const rawSources = (extraInfo?.sources as SourceItem[]) || [];
  const usedKeys = extractUsedSourceKeys(content);
  const filteredSources =
    usedKeys.length > 0
      ? rawSources.filter((item) => usedKeys.includes(item.key))
      : rawSources;

  const text = content.trim().length > 0 ? content : "思考中...";

  return (
    <XMarkdown
      paragraphTag="p"
      className={className}
      streaming={{
        hasNextChunk: status === "updating",
        enableAnimation: true,
      }}
      components={{
        sup: (props) => {
          return (
            <SourcesComponent
              children={props.children}
              sources={filteredSources}
              messageId={key as string}
              domNode={props.domNode}
              streamStatus={props.streamStatus}
            />
          );
        },
      }}
    >
      {text}
    </XMarkdown>
  );
};

