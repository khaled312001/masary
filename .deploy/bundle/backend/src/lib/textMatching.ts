export function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .replace(/[إأٱآا]/g, "ا")
    .replace(/[ىیي]/g, "ي")
    .replace(/[كک]/g, "ك")
    .replace(/[ةۀ]/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ء/g, "")
    .replace(/[ًٌٍَُِّْٰـ]/g, "")
    .replace(/[ﻻﻷﻹﻵ]/g, "لا")
    .replace(/[^\p{L}\p{N}\s+#.]/gu, " ")
    .replace(/\s+/g, " ");
}

export function splitList(value: string) {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const item of value.split(/[,،؛;\n|]/g)) {
    const text = item.trim();
    const normalized = normalizeText(text);
    if (text.length < 2 || text.length > 120 || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(text);
  }

  return out;
}

export function similarity(a: string, b: string) {
  const x = normalizeText(a);
  const y = normalizeText(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  if (x.includes(y) || y.includes(x)) return Math.min(0.95, Math.min(x.length, y.length) / Math.max(x.length, y.length) + 0.2);

  const distance = levenshtein(x, y);
  return Math.max(0, 1 - distance / Math.max(x.length, y.length));
}

export function closest<T>(items: T[], query: string, getNames: (item: T) => (string | null | undefined)[], minScore = 0.78) {
  let best: { item: T; score: number } | null = null;
  for (const item of items) {
    const names = getNames(item).filter(Boolean) as string[];
    if (names.length === 0) continue;
    const score = names.reduce((acc, name) => Math.max(acc, similarity(query, name)), 0);
    if (!best || score > best.score) best = { item, score };
  }
  return best && best.score >= minScore ? best : null;
}

export function sameNormalized(a: string, b: string) {
  return normalizeText(a) === normalizeText(b);
}

function levenshtein(a: string, b: string) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const curr = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }

  return prev[b.length];
}
