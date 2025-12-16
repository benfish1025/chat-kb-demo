import XMarkdown from "@ant-design/x-markdown";
import type { BubbleListProps } from "@ant-design/x";
import { Footer } from "../components/Footer";
import { SourcesComponent } from "../components/SourcesComponent";

export const getRole = (className: string): BubbleListProps["role"] => ({
  assistant: {
    placement: "start",
    footer: (content, { status, key }) => (
      <Footer content={content} status={status} id={key as string} />
    ),
    contentRender: (content: string, { status }) => {
      const newContent = content.replace(/\n\n/g, "<br/><br/>");
      return (
        <XMarkdown
          paragraphTag="div"
          className={className}
          streaming={{
            hasNextChunk: status === "updating",
            enableAnimation: true,
          }}
          components={{
            sup: SourcesComponent,
          }}
        >
          {newContent}
        </XMarkdown>
      );
    },
  },
  user: { placement: "end" },
});
