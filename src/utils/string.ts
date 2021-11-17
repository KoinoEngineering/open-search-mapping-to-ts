/**
 * ケバブやスネークをパスカルに変換
 * @param key
 * @returns
 */
export function toPascal(key: string): string {
  return key
    .split(/-|_/)
    .map((s) => s && s[0].toUpperCase() + s.slice(1).toLowerCase())
    .join("");
}
