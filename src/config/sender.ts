import type { SenderProps } from "@ant-design/x";
import locale from "../_utils/local";

export const slotConfig: SenderProps["slotConfig"] = [
  { type: "text", value: locale.slotTextStart },
  {
    type: "select",
    key: "destination",
    props: {
      defaultValue: "X SDK",
      options: ["X SDK", "X Markdown", "Bubble"],
    },
  },
  { type: "text", value: locale.slotTextEnd },
];
