"""生成 og:image（1200×630）—— 分享出去不能是白块。

用系统里的 Noto Serif SC / Noto Sans SC 变量字体渲染，和站点视觉一致。
字体名在 Windows 上通常是 NotoSerifSC-VF.ttf / NotoSansSC-VF.ttf；
换机器时可用 --serif / --sans 指定，或退回宋体/黑体。

用法：python scripts/make-og-image.py
产物：public/og-image.png
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# Windows 控制台默认 GBK，直接 print 中文/符号会 UnicodeEncodeError
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og-image.png"

W, H = 1200, 630
PAPER = (251, 249, 245)
INK = (23, 21, 15)
INK_SOFT = (110, 101, 88)
VERMILION = (214, 64, 31)
CARD = (255, 255, 255)
LINE = (227, 220, 208)

FONT_DIR = Path("C:/Windows/Fonts")
SERIF_CANDIDATES = ["NotoSerifSC-VF.ttf", "simsun.ttc", "msyh.ttc"]
SANS_CANDIDATES = ["NotoSansSC-VF.ttf", "msyh.ttc", "simhei.ttf"]


def pick(candidates: list[str], override: str | None) -> Path:
    if override:
        path = Path(override)
        if not path.exists():
            raise SystemExit(f"字体不存在：{path}")
        return path
    for name in candidates:
        path = FONT_DIR / name
        if path.exists():
            return path
    raise SystemExit(f"没找到可用字体，试过：{candidates}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--serif", help="标题字体路径")
    parser.add_argument("--sans", help="正文字体路径")
    args = parser.parse_args()

    serif = pick(SERIF_CANDIDATES, args.serif)
    sans = pick(SANS_CANDIDATES, args.sans)

    title = ImageFont.truetype(str(serif), 92)
    latin = ImageFont.truetype(str(serif), 92)
    sub = ImageFont.truetype(str(sans), 34)
    tag = ImageFont.truetype(str(sans), 26)
    small = ImageFont.truetype(str(sans), 24)

    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)

    # 右上装饰纸块 + 朱砂印章，呼应落地页 Hero 的构图
    d.rounded_rectangle([(880, 96), (1120, 420)], radius=10, fill=(239, 233, 220))
    for i, y in enumerate((188, 232, 276)):
        d.rounded_rectangle([(934, y), (934 + (150 if i else 120), y + 12)], radius=6, fill=(225, 216, 198))
    d.rounded_rectangle([(1010, 330), (1078, 398)], radius=6, fill=VERMILION)

    # 左侧文案
    d.text((80, 96), "一页 OnePage", font=tag, fill=VERMILION)

    d.text((80, 168), "写好一页简历", font=title, fill=INK)
    d.text((80, 286), "拿到想要的 Offer", font=title, fill=INK)

    d.rounded_rectangle([(80, 424), (200, 430)], radius=3, fill=VERMILION)

    d.text((80, 466), "免费 · 免注册 · 导出不设限", font=sub, fill=INK_SOFT)
    d.text((80, 520), "ATS 友好排版，机器读得懂、HR 看得清", font=small, fill=(138, 129, 117))

    # 右下 ATS 徽章
    d.rounded_rectangle([(80, 566), (420, 606)], radius=10, fill=CARD, outline=LINE, width=2)
    d.text((98, 572), "ATS 解析通过 · 无解析陷阱", font=small, fill=(31, 107, 74))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PNG", optimize=True)
    print(f"✓ {OUT.relative_to(ROOT)}  {OUT.stat().st_size / 1024:.1f} KB  (serif={serif.name}, sans={sans.name})")


if __name__ == "__main__":
    main()
