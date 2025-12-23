import type { SourceItem } from "@/modules/sources/types/source";

/**
 * 从消息内容中提取所有出现过的 <sup>数字</sup> 引用 key
 * @param content 消息内容字符串
 * @returns 提取到的数字数组（去重后）
 */
export const extractUsedSourceKeys = (content: string): number[] => {
  if (!content) return [];
  const regex = /<sup>(\d+)<\/sup>/g;
  const set = new Set<number>();
  let match: RegExpExecArray | null;

  // 遍历所有匹配，收集数字
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(content)) !== null) {
    const index = Number(match[1]);
    if (!Number.isNaN(index)) {
      set.add(index);
    }
  }

  return Array.from(set);
};

/**
 * 根据消息内容中使用的源键过滤源列表
 * @param sources 原始源列表
 * @param content 消息内容字符串
 * @returns 过滤后的源列表（如果内容中有使用的源键，则只返回使用的源；否则返回所有源）
 */
export const filterSourcesByContent = (
  sources: SourceItem[] | undefined,
  content: string
): SourceItem[] => {
  const rawSources = sources || [];
  const usedKeys = extractUsedSourceKeys(content);
  return usedKeys.length > 0
    ? rawSources.filter((item) => usedKeys.includes(item.key))
    : rawSources;
};

