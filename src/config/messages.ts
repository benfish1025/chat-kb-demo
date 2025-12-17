import type { DefaultMessageInfo, XModelMessage } from "@ant-design/x-sdk";

export const HISTORY_MESSAGES: {
  [key: string]: DefaultMessageInfo<XModelMessage>[];
} = {
  "default-2": [
    {
      message: { role: "user", content: "帮我分析一下汽车出海模式的不同点" },
      status: "success",
    },
    {
      message: {
        role: "assistant",
        content: `CBU、CKD、SKD是汽车出海的三种主要模式，它们在整车出口、本地化生产和供应链管理等方面存在显著差异。<sup>1</sup><sup>3</sup>

## 三种模式的定义

**CBU（Complete Built Unit，完全组装整车）**：整车完全在出口国生产并组装完毕，直接运往目标市场销售。这是最简单直接的出口方式。

**CKD（Complete Knock Down，全散件组装）**：将车辆完全拆解成散件，出口至目标市场后再组装成整车。散件包括所有零部件（发动机、底盘、车身等），需要本地工厂进行焊接、喷漆和组装等完整的生产流程。

**SKD（Semi Knock Down，半散件组装）**：车辆以部分组装模块形式出口，在目标市场完成最终组装。主要部件如发动机、底盘、驾驶室等以总成形式出口，在进口国只需进行简单的组装工作，如安装轮胎、内饰等。<sup>1</sup><sup>3</sup>

## 核心区别对比

| 维度         | CBU        | CKD        | SKD           |
| ---------- | ---------- | ---------- | ------------- |
| **组装程度**​  | 100%整车出口   | 全散件，需完全组装  | 半组装模块，部分工序    |
| **关税成本**​  | 最高（整车税率）   | 最低（散件税率低）  | 中等（介于两者之间）    |
| **本地化要求**​ | 无          | 高（需完整生产线）  | 中（需基础组装能力）    |
| **投资规模**​  | 无本地投资      | 大（工厂+供应链）  | 较小（组装线即可）     |
| **典型市场**​  | 高端市场、小规模市场 | 政策强推本地化的国家 | 政策温和或供应链初级的国家 |

## 具体差异分析

**组装复杂度**：SKD与CKD的最大区别在于，SKD的驾驶室（或车身）和/或货厢是已焊接或经涂装后的总成状态，而CKD状态的驾驶室（或车身）和/或货厢是未经涂装加工的分总成状态。<sup>1</sup><sup>3</sup>

**投资回报**：SKD模式海外组装厂投资约5000万-1亿元，投产周期6-12个月，静态回收期3-5年；CKD模式投资5-10亿元，投产周期12-24个月，静态回收期5-8年，但关税减免幅度比SKD高20%-30%。<sup>1</sup><sup>3</sup>

**适用场景**：CBU适合快速进入新市场并确保产品质量，SKD适合试水本地化过渡，CKD适合长期扎根降本增效。企业会根据目标市场的关税政策、本地化要求、工业基础等因素选择最合适的模式。`,
      },
      status: "success",
    },
  ],
};

export const historyMessageFactory = (
  conversationKey: string
): DefaultMessageInfo<XModelMessage>[] => {
  return HISTORY_MESSAGES[conversationKey] || [];
};
