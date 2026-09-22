/**
 * 模板的类型定义（只有类型，清单数据在 lib/templates.ts）。
 *
 * 放在 types/ 是因为 templateId 是简历文档的一部分：它跟着 JSON 备份走，
 * 换台设备打开同一份备份，版式应当保持一致。
 */

export type TemplateId = "classic" | "compact" | "academic" | "portfolio";

/**
 * 版式家族 —— 决定 ATS 自检怎么给「排版解析风险」定性。
 *
 * single-column：DOM 与视觉都是单栏，解析顺序无歧义，风险低。
 * two-column-dom-safe：视觉分栏（CSS grid），但 DOM 顺序仍是单栏线性，
 *   机器读得到的文本顺序与单栏一致，风险中 —— 不谎称低。
 */
export type TemplateLayout = "single-column" | "two-column-dom-safe";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  tag: string;
  /** 缩略图骨架版本，与 TemplateThumb.vue 的 variant 对应 */
  variant: TemplateId;
  /** 是否已上线：true 才会出现在编辑器里可选 */
  available: boolean;
  layout: TemplateLayout;
  /** 导出的 PDF 页数预计会超过一页（学术 CV 现实就是 2–4 页） */
  expectsMultiPage: boolean;
}

export const DEFAULT_TEMPLATE: TemplateId = "classic";
