/**
 * 清理和修复 Markdown 表格格式
 */
export function sanitizeMarkdownTables(input: string): string {
  const lines = input.split("\n");
  const isSeparatorLine = (line: string) => /^(\s*\|?\s*[-:]+\s*\|)+\s*[-:]+\s*\|?\s*$/.test(line);
  const countColumns = (line: string) => line.split("|").length - 1;
  const normalizeSeparator = (line: string) => {
    const trimmed = line.trimStart();
    return trimmed.startsWith("|") ? line : `|${trimmed}`;
  };
  const buildEmptyHeader = (pipeCount: number) => `| ${" |".repeat(Math.max(pipeCount - 1, 0))}`;

  for (let i = 0; i < lines.length; i += 1) {
    if (!isSeparatorLine(lines[i])) {
      continue;
    }

    lines[i] = normalizeSeparator(lines[i]);
    const separatorColumns = countColumns(lines[i]);

    const headerIndex = i - 1;
    if (headerIndex < 0) {
      lines.splice(i, 0, buildEmptyHeader(separatorColumns));
      i += 1;
      continue;
    }

    const header = lines[headerIndex].trimEnd();
    if (header.length === 0 || isSeparatorLine(header)) {
      lines[headerIndex] = buildEmptyHeader(separatorColumns);
    }

    const fixedHeaderStart = lines[headerIndex].trimEnd();
    const fixedHeaderColumns = countColumns(fixedHeaderStart);
    if (!fixedHeaderStart.trimStart().startsWith("|") && fixedHeaderColumns > 0) {
      lines[headerIndex] = `| ${fixedHeaderStart}`;
    }

    const fixedHeader = lines[headerIndex];
    const fixedHeaderPipeCount = countColumns(fixedHeader);
    if (separatorColumns > fixedHeaderPipeCount && fixedHeaderPipeCount > 0) {
      const missing = separatorColumns - fixedHeaderPipeCount;
      lines[headerIndex] = `${fixedHeader}${" |".repeat(missing)}`;
    }

    if (header.length === 0 || isSeparatorLine(header)) {
      continue;
    }
  }

  return lines.join("\n");
}

