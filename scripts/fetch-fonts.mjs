/**
 * 自托管中文字体 —— 一次性拉取，产物入库，运行时零外链。
 *
 * 为什么不用 Google Fonts CDN：
 *   1. 国内访问 fonts.googleapis.com 不稳定，首屏会抖动或干脆回退到宋体；
 *   2. 本站卖点是「数据不出浏览器」，为字体把访客 IP 送给第三方 CDN 自相矛盾。
 *
 * 为什么用可变字体（wght@100..900）：
 *   静态字重方案要按 400/500/600/700 各拉 100+ 个子集，体积翻几倍；
 *   可变字体一套子集覆盖全部字重，浏览器按 unicode-range 只下载用到的分片。
 *
 * 用法：node scripts/fetch-fonts.mjs
 * 产物：public/fonts/*.woff2 + src/styles/fonts.css
 */
import { createHash } from "node:crypto";
import { mkdir, writeFile, rm, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_FONT_DIR = resolve(ROOT, "public/fonts");
const OUT_CSS = resolve(ROOT, "src/styles/fonts.css");

const CSS_URL =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&family=Noto+Serif+SC:wght@200..900&display=swap";

// Google 只在现代 UA 下返回 woff2 分片，缺这个头会拿到 ttf 整包（几十 MB）
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const CONCURRENCY = 8;

/** 同一子集在两个家族下可能是同一文件，去重后再下载 */
async function fetchCss() {
  const res = await fetch(CSS_URL, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`CSS ${res.status} ${res.statusText}`);
  return res.text();
}

function fileNameFor(url) {
  return `${createHash("sha1").update(url).digest("hex").slice(0, 16)}.woff2`;
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        results[index] = await worker(items[index], index);
      }
    })
  );
  return results;
}

async function main() {
  console.log("→ 拉取 Google Fonts 分片 CSS…");
  const css = await fetchCss();

  const urls = [...new Set([...css.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)].map((m) => m[1]))];
  const faces = [...css.matchAll(/@font-face/g)].length;
  console.log(`  @font-face ${faces} 条，去重后 ${urls.length} 个分片`);

  // 重跑时清掉旧分片，避免 hash 变化后留下孤儿文件
  await rm(OUT_FONT_DIR, { recursive: true, force: true });
  await mkdir(OUT_FONT_DIR, { recursive: true });

  let bytes = 0;
  let done = 0;
  await mapLimit(urls, CONCURRENCY, async (url) => {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    bytes += buf.length;
    await writeFile(resolve(OUT_FONT_DIR, fileNameFor(url)), buf);
    done += 1;
    if (done % 25 === 0 || done === urls.length) {
      console.log(`  下载 ${done}/${urls.length}`);
    }
  });

  // URL 重写成本地路径，其余声明（font-weight 区间 / unicode-range）原样保留
  const local = new Map(urls.map((u) => [u, `/fonts/${fileNameFor(u)}`]));
  const localized = css.replace(/url\((https:\/\/[^)]+\.woff2)\)/g, (_, u) => `url(${local.get(u)})`);

  const banner = `/* 由 scripts/fetch-fonts.mjs 生成，请勿手改。\n   数据来源：Google Fonts（Noto Sans SC / Noto Serif SC，SIL OFL 1.1）\n   共 ${urls.length} 个 woff2 分片，浏览器按 unicode-range 按需加载。 */\n\n`;

  await writeFile(OUT_CSS, banner + localized, "utf8");

  const files = await readdir(OUT_FONT_DIR);
  console.log(`✓ 完成：${files.length} 个分片，合计 ${(bytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  产物：public/fonts/ 与 src/styles/fonts.css`);
}

main().catch((error) => {
  console.error("✗ 字体拉取失败：", error.message);
  process.exit(1);
});
