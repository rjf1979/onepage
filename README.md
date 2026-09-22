# 一页 OnePage · 免费在线简历网站

纯前端、零后端成本的免费在线简历制作工具。**核心差异化：真免费 + 免注册 + 导出不设限，以及 ATS 兼容自检。**

## 设计交付物

- 设计基线就是 `design/` 下的三张 @2x PNG，改完设计重新导出覆盖同名文件即可。
- 原始设计源文件放在内部工具里，不随仓库公开；需要改设计时找维护者索取。

## 目录结构

```
onepage-resume/
├── design/                 # 设计交付物（1440 宽，@2x PNG）
│   ├── 01-落地页.png
│   ├── 02-编辑器.png
│   └── 03-ATS自检报告.png
├── public/                 # 静态资源
│   ├── favicon.svg         # 朱砂印章图标
│   ├── og-image.png        # 分享卡片（1200×630）
│   └── fonts/              # 自托管中文字体分片（202 个 woff2）
├── scripts/                # 一次性资源生成，产物入库
│   ├── fetch-fonts.mjs     # 拉取 Noto Sans/Serif SC 可变字体分片
│   └── make-og-image.py    # 生成分享卡片
├── src/
│   ├── components/           # 可复用组件（AppIcon / ResumePaper / PrintLayer / landing / ats / editor）
│   ├── composables/          # 业务逻辑钩子（useFitScale 等比缩放 A4 预览）
│   ├── lib/                  # ATS 分析与模板元数据（单一数据源）
│   ├── router/               # vue-router 路由配置
│   ├── stores/               # Pinia 状态管理（简历数据 + localStorage 持久化）
│   ├── styles/               # Tailwind v4 CSS-first 主题、字体、打印样式
│   ├── types/                # TypeScript 类型与工厂函数
│   └── views/                # Landing / Editor / ATS 三大页面
├── index.html                # Vite 入口
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 技术栈

- **Vue 3.5** + **Vite 7** + **TypeScript**
- **vue-router 4** 客户端路由
- **Pinia 3** 状态管理 + `localStorage` 自动持久化
- **Tailwind CSS v4** CSS-first `@theme` token 系统
- **无后端**：数据仅存浏览器本地，可导出 JSON 备份
- **PDF 导出**：浏览器 `window.print()` + `@media print` 打印到 PDF

## 产品定位：为什么这么做

在线简历是红海（超级简历、五百丁、Canva）。拼模板数量和「部分免费」必死，差异化钉死在两条：

| 差异化 | 用户痛点 |
|---|---|
| **真免费 + 免注册 + 导出不设限** | 竞品套路：「免费写到一半，导出收费」。这是最强获客钩子 |
| **ATS 兼容自检** | 大厂校招/外企全走 ATS 机器筛简历，分栏/文本框/图标/进度条会导致解析失败，用户根本不知道自己死在哪 |

辅助卖点：数据默认存本地浏览器（隐私）、AI 按 STAR 改写经历并补量化数据。

## 设计系统 Token

视觉方向：**纸感 Editorial** —— 不用科技蓝紫，简历品类本就讲「纸和字」，朱砂红暗含「敲定/认可」。

| 用途 | Hex |
|---|---|
| 纸底 / 页面背景 | `#FBF9F5` |
| 卡片白 | `#FFFFFF` |
| 墨黑 / 主文字 | `#17150F` |
| 次级文字 | `#6E6558` |
| 弱文字 / 占位 | `#8A8175` |
| 朱砂红 / 主强调色 | `#D6401F` |
| 成功绿（ATS 通过） | `#1F6B4A` |
| 警示琥珀 | `#D9A13B` |
| 描边 / 分隔线 | `#E3DCD0` |
| 装饰纸 / 预览区底 | `#EFE9DC` |
| 深色区块底色 | `#17150F` |

字体：
- 中文标题：`Noto Serif SC` Bold / SemiBold
- 中文正文：`Noto Sans SC` Regular / Medium / SemiBold
- 数字与英文：`Inter`（标题点缀用 `Playfair Display` Bold Italic）

圆角：按钮 10–12，卡片 16–20，纸/模板预览 3–6。

## 页面清单

1. **落地页** — Header / Hero（文案 + 简历纸视觉 + ATS 徽章浮层）/ 信任条 / 三大价值卡 / 三步流程 / 模板墙（路线图 4 套，已上线 1 套）/ 深色 CTA / Footer
2. **编辑器** — 顶栏（自动保存状态 / 换模板 / ATS 自检 / 导出 PDF）+ 左表单填空 + 右 A4 实时预览 + 量化提醒（本地正则检测，非 AI）
3. **ATS 自检报告** — 兼容分 + 逐项检查（通过/建议）+ 右侧解析高亮预览，明确指出机器能读哪些区块

> 文案纪律：页面上写的每一项能力都必须真的存在。已上线的模板只有「经典单栏」，
> 导出目前只有 PDF（Word / PNG 见「下一步」），AI 改写尚未实现。
> 模板清单的唯一数据源是 `src/lib/templates.ts`，落地页与编辑器共用。

## 本地运行

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 输出 dist/
npm run typecheck
```

字体分片与分享图已经入库，克隆后即可直接运行；只有需要**更新**它们时才跑脚本：

```bash
node scripts/fetch-fonts.mjs              # 重新拉取 Noto Sans/Serif SC 分片（约 10 MB）
python scripts/make-og-image.py           # 重新生成 public/og-image.png
```

## 字体：为什么自托管

`src/styles/fonts.css` + `public/fonts/*.woff2` 是自托管的 **Noto Sans SC / Noto Serif SC**，
用可变字体（`wght@100..900`）覆盖全部字重，共 202 个 `unicode-range` 分片，浏览器只下载用到的分片。

不走 Google Fonts CDN 的原因有两个：一是国内访问不稳定，首屏会回退到宋体；
二是本站卖点是「数据不出浏览器」，为字体把访客 IP 送给第三方 CDN 自相矛盾。

## 主要功能

- **免注册**：打开即用，自动加载示例数据，所有编辑实时保存到本地浏览器。
- **编辑器**：左侧表单 / 右侧 A4 实时预览；支持移动端表单/预览 Tab 切换。
- **ATS 自检**：8 项机器解析检查，给出兼容性分数与可落地建议。
- **导出 JSON 备份**：通过编辑器「更多」菜单导入/导出完整简历数据。
- **导出 PDF / 打印**：简历数据通过 Teleport 挂到 body 的专用打印层，打印样式只保留 A4 内容。

## 下一步

- [ ] **M2 模板系统**：`templateId` 进数据模型与持久化，`ResumePaper` 拆出版式变体，换模板真正可切换
- [ ] **M3 导出补齐**：PNG（canvas 渲染）与 Word（`.doc`），PDF 改为直接生成文件以摆脱浏览器打印设置差异
- [ ] **M4 模块扩展**：自我评价 / 证书 / 语言 / 获奖 + 条目排序 + 多份简历管理
- [ ] **M5 本地规则改写**：按 STAR 句式给改写建议（零后端、零密钥，数据不出浏览器）
- [ ] **M6 上线**：部署、`og:image` 改绝对地址、sitemap/robots、隐私说明页、前端漏斗埋点
- [ ] **变现**：流量跑通后挂「简历代改服务」或求职内容分销
