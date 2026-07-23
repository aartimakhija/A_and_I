// Small, dependency-free CSV parser — handles quoted fields (so product
// names/stories containing commas work), which is the one thing a naive
// `line.split(",")` would get wrong. Good enough for admin-authored CSVs;
// not meant to handle every edge case of the full CSV spec.
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const pushField = () => { row.push(field); field = ""; };
  const pushRow = () => { pushField(); rows.push(row); row = []; };

  // Normalize line endings, strip a UTF-8 BOM if present (common from Excel exports)
  const clean = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") pushField();
      else if (ch === "\n") pushRow();
      else field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) pushRow();
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/** Rows as an array of header-keyed objects, e.g. [{name: "...", slug: "..."}] */
export function csvToObjects(text: string): Record<string, string>[] {
  const rows = parseCSV(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? "").trim()])));
}
