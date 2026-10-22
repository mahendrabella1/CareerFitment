/**
 * "Download report" as one self-contained HTML file - used by every class's
 * report (FullReport, Class6Report, Class7Report).
 *
 * A saved file has no website behind it, and on an iPhone it opens in the
 * Files / Quick Look viewer, which runs no JavaScript and loads nothing from
 * the internet. So the file must carry everything itself:
 *  - every image (img, SVG <image>, CSS backgrounds) embedded as a data: URI,
 *    resized to at most MAX_SIDE px so the file stays a few MB;
 *  - the page-wide stylesheets the report relies on (globals.css etc.), not
 *    only the report's own <style> tag - only the rules that match something
 *    in the report are kept;
 *  - absolute links, and nothing that needs JavaScript to become visible.
 * An image that can't be fetched keeps its original URL (it still shows in a
 * normal browser with internet).
 */

const MAX_SIDE = 1200;
const JPEG_QUALITY = 0.8;
const KEEP_AS_IS_BYTES = 80_000;
const PARALLEL = 6;
const URL_RE = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;

// Selectors for states a static file never has, removed before matching.
const STATE_PSEUDO = /::?(?:before|after|first-line|first-letter|selection|placeholder|marker|backdrop|-webkit-[\w-]+|-moz-[\w-]+|hover|focus|focus-visible|focus-within|active|visited|link|target|checked|disabled|enabled|placeholder-shown|autofill)(?![\w-])/g;

export interface ExportOptions {
  /** Extra CSS for the file only (e.g. show content that animates in on screen). */
  extraCss?: string;
  /** Elements to leave out of the file (buttons that do nothing offline). */
  omit?: string;
}

const absolute = (u: string, base: string) => { try { return new URL(u, base).href; } catch { return u; } };
const isEmbeddable = (u: string) => /^https?:/i.test(u);

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

async function decode(blob: Blob): Promise<CanvasImageSource & { width: number; height: number }> {
  if (typeof createImageBitmap === "function") {
    try { return await createImageBitmap(blob); } catch { /* fall back to <img> */ }
  }
  const src = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.src = src;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(src);
  }
}

/** One image URL -> a data: URI, resized when large. Throws if it can't be fetched. */
async function toDataUri(url: string): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  try {
    const sameOrigin = new URL(url).origin === location.origin;
    const res = await fetch(url, { mode: sameOrigin ? "same-origin" : "cors", credentials: "omit", signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const type = blob.type || "";
    if (/svg|gif/.test(type)) return readAsDataUrl(blob); // vectors and animations as they are
    const img = await decode(blob);
    const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
    if (scale === 1 && blob.size <= KEEP_AS_IS_BYTES && /^image\//.test(type)) return readAsDataUrl(blob);
    const w = Math.max(1, Math.round(img.width * scale)), h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return readAsDataUrl(blob);
    ctx.drawImage(img, 0, 0, w, h);
    // Keep transparency (logos, cut-outs) as PNG; photos become JPEG.
    let transparent = false;
    if (!/jpe?g/.test(type)) {
      const px = ctx.getImageData(0, 0, w, h).data;
      for (let i = 3; i < px.length; i += 16) if (px[i] < 250) { transparent = true; break; }
    }
    return canvas.toDataURL(transparent ? "image/png" : "image/jpeg", JPEG_QUALITY);
  } finally {
    clearTimeout(timer);
  }
}

/** Runs fn over items, PARALLEL at a time. */
async function pool<T>(items: T[], fn: (t: T) => Promise<void>) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(PARALLEL, items.length) }, async () => {
    while (next < items.length) await fn(items[next++]);
  }));
}

function selectorMatters(root: Element, selector: string): boolean {
  for (const part of selector.split(",")) {
    const s = part.replace(STATE_PSEUDO, "").replace(/[>+~\s]+$/, "").trim() || "*";
    try {
      if (root.matches(s) || root.querySelector(s) || document.documentElement.matches(s) || document.body.matches(s)) return true;
    } catch {
      return true; // a selector the browser can't test here - keep it to be safe
    }
  }
  return false;
}

/** The page-wide CSS rules that apply to the report, with url()s made absolute. */
function collectPageCss(root: Element): string {
  const out: string[] = [];
  const walk = (rules: CSSRuleList, base: string): string => {
    const kept: string[] = [];
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        if (selectorMatters(root, rule.selectorText)) kept.push(rule.cssText);
      } else if (rule instanceof CSSMediaRule) {
        const inner = walk(rule.cssRules, base);
        if (inner) kept.push(`@media ${rule.conditionText}{${inner}}`);
      } else if (typeof CSSSupportsRule !== "undefined" && rule instanceof CSSSupportsRule) {
        const inner = walk(rule.cssRules, base);
        if (inner) kept.push(`@supports ${rule.conditionText}{${inner}}`);
      } else if (rule instanceof CSSImportRule) {
        continue;
      } else {
        kept.push(rule.cssText); // @keyframes, @font-face and the rest
      }
    }
    return kept.join("\n").replace(URL_RE, (m, q, u) => (u.startsWith("data:") ? m : `url("${absolute(u, base)}")`));
  };
  for (const sheet of Array.from(document.styleSheets)) {
    if (sheet.ownerNode && root.contains(sheet.ownerNode)) continue; // travels inside the markup already
    let rules: CSSRuleList;
    try { rules = sheet.cssRules; } catch { continue; } // another site's stylesheet (fonts) - not readable
    const css = walk(rules, sheet.href || location.href);
    if (css) out.push(css);
  }
  return out.join("\n");
}

/** The page's Google Fonts (Latin subset) with the font files embedded, so the
 *  file's text is the same width - and wraps the same - as on the site. */
async function embeddedFontCss(): Promise<string> {
  const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href*="fonts.googleapis.com"]'));
  const blocks: string[] = [];
  for (const link of links) {
    try {
      const css = await (await fetch(link.href, { mode: "cors", credentials: "omit" })).text();
      // Google's CSS labels each @font-face with its subset: "/* latin */ @font-face{...}".
      for (const m of css.matchAll(/\/\*\s*latin\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)) blocks.push(m[1]);
    } catch { /* fonts are a nicety - the report falls back to system fonts */ }
  }
  const files = new Map<string, string>();
  const urls = [...new Set(blocks.flatMap((b) => [...b.matchAll(URL_RE)].map((m) => m[2])))];
  await pool(urls, async (u) => {
    try { files.set(u, await readAsDataUrl(await (await fetch(u, { mode: "cors", credentials: "omit" })).blob())); } catch { /* skip */ }
  });
  return blocks
    .filter((b) => [...b.matchAll(URL_RE)].every((m) => files.has(m[2])))
    .map((b) => b.replace(URL_RE, (_m, _q, u) => `url("${files.get(u)}")`))
    .join("\n");
}

/** The whole report as one self-contained HTML document. */
export async function buildReportHtml(root: Element, title: string, opts: ExportOptions = {}): Promise<string> {
  const fontCss = embeddedFontCss();
  const clone = root.cloneNode(true) as HTMLElement;

  // Images as the browser actually chose them (srcset / picture), by position.
  const liveImgs = Array.from(root.querySelectorAll("img"));
  Array.from(clone.querySelectorAll("img")).forEach((img, i) => {
    const live = liveImgs[i];
    const src = live?.currentSrc || live?.src || img.getAttribute("src") || "";
    if (src) img.setAttribute("src", absolute(src, location.href));
    ["srcset", "sizes", "loading", "decoding", "fetchpriority"].forEach((a) => img.removeAttribute(a));
  });
  clone.querySelectorAll("picture source").forEach((s) => s.remove());
  clone.querySelectorAll(["script", "noscript", opts.omit].filter(Boolean).join(",")).forEach((el) => el.remove());
  clone.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (!href.startsWith("#") && !/^(mailto|tel):/i.test(href)) a.setAttribute("href", absolute(href, location.href));
  });

  const pageCss = collectPageCss(root);

  // Every image URL in the markup, inline styles and CSS.
  const urls = new Set<string>();
  const addFromCss = (css: string, base: string) => { for (const m of css.matchAll(URL_RE)) { const u = absolute(m[2], base); if (isEmbeddable(u)) urls.add(u); } };
  clone.querySelectorAll("img[src]").forEach((img) => { const u = img.getAttribute("src")!; if (isEmbeddable(u)) urls.add(u); });
  const svgImages = Array.from(clone.querySelectorAll("image"));
  svgImages.forEach((im) => {
    const raw = im.getAttribute("href") || im.getAttribute("xlink:href") || "";
    const u = absolute(raw, location.href);
    if (raw && isEmbeddable(u)) { urls.add(u); im.setAttribute("href", u); im.removeAttribute("xlink:href"); }
  });
  const styled = Array.from(clone.querySelectorAll<HTMLElement>("[style*='url(']"));
  styled.forEach((el) => addFromCss(el.getAttribute("style") || "", location.href));
  const styleTags = Array.from(clone.querySelectorAll("style"));
  styleTags.forEach((s) => addFromCss(s.textContent || "", location.href));
  addFromCss(pageCss, location.href);

  const data = new Map<string, string>();
  await pool([...urls], async (u) => { try { data.set(u, await toDataUri(u)); } catch { /* keep the URL */ } });
  const swap = (u: string) => data.get(u) ?? u;
  const swapCss = (css: string, base: string) => css.replace(URL_RE, (m, q, u) => (u.startsWith("data:") ? m : `url("${swap(absolute(u, base))}")`));

  clone.querySelectorAll("img[src]").forEach((img) => img.setAttribute("src", swap(img.getAttribute("src")!)));
  svgImages.forEach((im) => { const u = im.getAttribute("href"); if (u) im.setAttribute("href", swap(u)); });
  styled.forEach((el) => el.setAttribute("style", swapCss(el.getAttribute("style") || "", location.href)));
  styleTags.forEach((s) => { s.textContent = swapCss(s.textContent || "", location.href); });

  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const base = "html{-webkit-text-size-adjust:100%;text-size-adjust:100%}body{margin:0;background:#f7f7f8}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title>`
    + `<style>${await fontCss}</style><style>${base}</style><style>${swapCss(pageCss, location.href)}</style>${opts.extraCss ? `<style>${opts.extraCss}</style>` : ""}`
    + `</head><body>${clone.outerHTML}</body></html>`;
}

/** Builds the file and saves it as <filename>.html. */
export async function downloadReportHtml(root: Element, filename: string, opts: ExportOptions = {}): Promise<void> {
  const html = await buildReportHtml(root, filename, opts);
  const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.html`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // iPhone Safari reads the file after click() returns - revoking at once cancels the download.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
