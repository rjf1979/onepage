/**
 * 模板元数据 —— 落地页模板墙与编辑器「换模板」的唯一数据源。
 *
 * 之前两边各写一份数组，结果落地页写「12 套模板」，编辑器里只有 4 套且 3 套不可用。
 * 数量、名称、简介从此只在这里改一处。
 */

export type TemplateVariant = "classic" | "academic" | "portfolio" | "compact";

export interface TemplateMeta {
  id: TemplateVariant;
  name: string;
  tag: string;
  /** 缩略图骨架版本，与 TemplateThumb.vue 的 variant 对应 */
  variant: TemplateVariant;
  /** 是否已上线：true 才会出现在编辑器里可选 */
  available: boolean;
}

export const TEMPLATES: readonly TemplateMeta[] = [
  {
    id: "classic",
    name: "经典单栏",
    tag: "互联网 · 金融 · 校招",
    variant: "classic",
    available: true,
  },
  {
    id: "academic",
    name: "学术 CV",
    tag: "考研 · 博士 · 科研岗",
    variant: "academic",
    available: false,
  },
  {
    id: "portfolio",
    name: "作品集双栏",
    tag: "设计 · 摄影 · 建筑",
    variant: "portfolio",
    available: false,
  },
  {
    id: "compact",
    name: "应届紧凑版",
    tag: "一页装下 · 经验不多也撑得满",
    variant: "compact",
    available: false,
  },
] as const;

export const LIVE_TEMPLATES = TEMPLATES.filter((t) => t.available);
export const PENDING_TEMPLATES = TEMPLATES.filter((t) => !t.available);
