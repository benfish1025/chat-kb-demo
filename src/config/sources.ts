export interface SourceItem {
  /**
   * 引用序号，对应 Markdown 中的 <sup>数字</sup>
   */
  key: number;
  /**
   * 来源标题
   */
  title: string;
  /**
   * 文件地址，对应后端返回的 file 字段
   */
  url: string;
  /**
   * 片段文本或摘要
   */
  description?: string;
  /**
   * 后端返回的 chunk_id（可选，用于后续扩展）
   */
  chunkId?: string;
  /**
   * 后端返回的 file_id（可选，用于后续扩展）
   */
  fileId?: string;
}

// 测试用的静态数据（仅作为占位示例，不再作为真实数据源）
export const DEFAULT_SOURCES: SourceItem[] = [
  {
    title: "东南亚及拉美市场：CKD 模式下的关税成本优化分析",
    key: 1,
    url: "https://x.ant.design/components/文件名称",
    description:
      "在东南亚市场，CKD（全散件组装）模式已成为规避高额整车进口关税的核心手段。以泰国为例，整车（CBU）进口关税通常在 80% 以上，而通过 CKD 形式并在当地达到 40% 以上的增值比例后，可享受东盟成员国间的零关税优惠。然而，CKD 模式对当地供应链的完整性要求极高，企业需投入约 5-10 亿元人民币用于涂装与总装产线的建设。",
  },
  {
    title: "SKD 与 CKD 模式的技术成熟度与投资回报对比",
    key: 2,
    url: "https://x.ant.design/components/文件名称",
    description:
      "SKD（半散件组装）通常被视为进入新兴市场的‘敲门砖’。相比 CKD 需要的深度本地化焊接和涂装工艺，SKD 仅需在当地进行简单的内饰安装、底盘合装与轮胎装配。SKD 的海外工厂初期投资通常控制在 5000 万至 1 亿元之间，投产周期短（约 6-12 个月），适合在目标市场政策尚不明朗或基础设施薄弱时作为过渡方案。",
  },
  {
    title: "从 CBU 到 CKD：产品质量控制与物流成本权衡",
    key: 3,
    url: "https://x.ant.design/components/文件名称",
    description:
      "虽然 CBU（完全组装整车）出口在物流环节最为直接，且能最大程度保证出厂质量的一致性，但随之而来的高昂国际海运成本和港口装卸损耗是其痛点。在转向 CKD 模式后，集装箱装载效率可提升 3-4 倍，单车物流成本平均下降 30%。但随之面临的挑战是：如何确保本地工人在组装精度上达到国内母工厂的同等标准。",
  },
  {
    title: "关键出口市场的准入门槛：KD 件定义与差异化税率",
    key: 4,
    url: "https://x.ant.design/components/文件名称",
    description:
      "各国海关对于 CKD 和 SKD 的定义存在细微差异。例如，巴西市场规定，若车身已完成涂装则必须归类为 SKD 申报，其税率明显高于未涂装的 CKD 件。企业在规划海外产能时，必须精准识别目标国关于‘实质性加工’的法律界定，以防止因申报模式不当导致的反倾销调查或补税风险。",
  },
];
