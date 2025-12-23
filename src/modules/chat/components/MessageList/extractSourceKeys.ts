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

