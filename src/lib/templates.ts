/**
 * 模板清单 —— 落地页模板墙、编辑器「换模板」、ATS 自检的唯一数据源。
 *
 * 数量、名称、可用状态、版式家族只在这里改一处：
 * 之前落地页与编辑器各写一份数组，才会出现「落地页写 12 套、编辑器只有 4 套」的矛盾。
 */
import {
  DEFAULT_TEMPLATE,
  type TemplateId,
  type TemplateMeta,
} from "@/types/template";

export type { TemplateId, TemplateLayout, TemplateMeta } from "@/types/template";
export { DEFAULT_TEMPLATE } from "@/types/template";

export const TEMPLATES: readonly TemplateMeta[] = [
  {
    id: "classic",
    name: "经典单栏",
    tag: "互联网 · 金融 · 校招",
    variant: "classic",
    available: true,
    layout: "single-column",
    expectsMultiPage: false,
  },
  {
    id: "compact",
    name: "应届紧凑版",
    tag: "一页装下 · 经历不多也撑得满",
    variant: "compact",
    available: true,
    layout: "single-column",
    expectsMultiPage: false,
  },
  {
    id: "academic",
    name: "学术 CV",
    tag: "考研 · 博士 · 科研岗",
    variant: "academic",
    available: true,
    layout: "single-column",
    expectsMultiPage: true,
  },
  {
    id: "portfolio",
    name: "作品集双栏",
    tag: "设计 · 摄影 · 建筑",
    variant: "portfolio",
    available: true,
    layout: "two-column-dom-safe",
    expectsMultiPage: false,
  },
] as const;

export const LIVE_TEMPLATES = TEMPLATES.filter((t) => t.available);
export const PENDING_TEMPLATES = TEMPLATES.filter((t) => !t.available);

/** 取某个模板的元数据；不存在的 id 返回 null（调用方自行决定回退策略） */
export function findTemplate(id: unknown): TemplateMeta | null {
  if (typeof id !== "string") return null;
  return TEMPLATES.find((t) => t.id === id) ?? null;
}

/**
 * 把任意来源的值收敛成「当前可用」的模板 id。
 * 本地存档与导入的 JSON 备份都可能带着已下线/不存在的模板 id，
 * 直接信任会让预览渲染成空白，所以一律回退到默认模板。
 */
export function resolveTemplateId(value: unknown): TemplateId {
  const meta = findTemplate(value);
  return meta && meta.available ? meta.id : DEFAULT_TEMPLATE;
}
