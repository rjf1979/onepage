import type { ResumeData } from "@/types/resume";
import { findTemplate } from "@/lib/templates";

export interface AtsCheck {
  id: string;
  label: string;
  status: "pass" | "warn";
  hint?: string;
}

export interface AtsReport {
  score: number;
  checks: AtsCheck[];
  metrics: {
    completeness: number;
    risk: string;
    keywordLevel: string;
  };
}

const PHONE_RE = /^1[3-9]\d{9}$/;
const EMAIL_RE = /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/;
const DATE_RE = /^\d{4}[.\-/]\d{1,2}$|^\d{4}$|^至今$|^(19|20)\d{2}$/;
/** 量化信号：百分比、金额、倍数、整数增量 */
const QUANT_RE = /\d+\s*(%|％|倍|万|亿|元|人|条|张|次|k|K|w|W)?/;

const hasText = (v: string): boolean => v.trim().length > 0;

/**
 * 纯本地静态分析 —— 不上传任何数据。
 *
 * 排版维度**不再恒为低风险**：它取决于当前模板。
 * 单栏模板 DOM 与视觉都是单栏，解析顺序无歧义 → 低；
 * 视觉分栏（DOM 顺序仍为单栏线性）会被部分机器解析器按位置取词 → 中，如实标注。
 */
export function analyzeResume(data: ResumeData): AtsReport {
  const { basics, experience, education, projects, skills } = data;
  const template = findTemplate(data.templateId);
  const twoColumn = template?.layout === "two-column-dom-safe";

  const allBullets = [
    ...experience.flatMap((e) => e.bullets),
    ...projects.flatMap((p) => p.bullets),
  ].filter(hasText);

  const checks: AtsCheck[] = [];

  // 1. 排版结构 —— 由当前模板决定，不再写死「通过」
  checks.push({
    id: "layout",
    label: twoColumn
      ? `「${template?.name}」为视觉分栏，文本顺序仍按单栏线性输出`
      : "单栏排版，解析顺序正确",
    status: twoColumn ? "warn" : "pass",
    hint: twoColumn
      ? "分栏本身不丢内容，但少数按坐标取词的解析器可能打乱顺序，投大厂建议用单栏模板"
      : undefined,
  });
  checks.push({
    id: "plaintext",
    label: "纯文本结构，无文本框与图形陷阱",
    status: "pass",
    hint: twoColumn ? "分栏只由 CSS 栅格实现，不是表格或文本框" : undefined,
  });
  if (template?.expectsMultiPage) {
    checks.push({
      id: "pagination",
      label: "该模板按多页排版，导出时自动分页",
      status: "pass",
      hint: "学术 CV 超过一页不影响机器解析，页边距会逐页保留",
    });
  }

  // 2. 姓名 / 求职意向
  checks.push({
    id: "name",
    label: hasText(basics.name) ? "姓名可被正确提取" : "缺少姓名",
    status: hasText(basics.name) ? "pass" : "warn",
    hint: hasText(basics.name) ? undefined : "机器靠姓名建立候选人档案，必填",
  });
  checks.push({
    id: "title",
    label: hasText(basics.title) ? "求职意向明确，便于匹配岗位" : "缺少求职意向",
    status: hasText(basics.title) ? "pass" : "warn",
    hint: hasText(basics.title) ? undefined : "写清楚目标岗位，命中率更高",
  });

  // 3. 联系方式可解析
  const phoneClean = basics.phone.replace(/[\s-]/g, "");
  const phoneOk = PHONE_RE.test(phoneClean);
  checks.push({
    id: "phone",
    label: phoneOk ? "手机号格式可自动识别" : "手机号格式不规范",
    status: phoneOk ? "pass" : "warn",
    hint: phoneOk ? undefined : "建议写成 11 位中国大陆号码",
  });
  const emailOk = EMAIL_RE.test(basics.email.trim());
  checks.push({
    id: "email",
    label: emailOk ? "邮箱格式可自动识别" : "邮箱格式不规范",
    status: emailOk ? "pass" : "warn",
    hint: emailOk ? undefined : "避免使用中文或含空格的地址",
  });

  // 4. 时间格式统一（YYYY.MM）
  const allDates = [
    ...experience.flatMap((e) => [e.start, e.end]),
    ...education.flatMap((e) => [e.start, e.end]),
  ].filter(hasText);
  const badDates = allDates.filter((d) => !DATE_RE.test(d.trim()));
  checks.push({
    id: "dates",
    label:
      badDates.length === 0
        ? "时间格式统一，机器可读"
        : `${badDates.length} 处时间格式建议写成 2021.03`,
    status: badDates.length === 0 ? "pass" : "warn",
    hint: badDates.length === 0 ? undefined : "统一用「年.月」格式最稳",
  });

  // 5. 经历与描述
  checks.push({
    id: "experience",
    label:
      experience.length > 0
        ? `工作经历已填写 ${experience.length} 段`
        : "尚未填写工作经历",
    status: experience.length > 0 ? "pass" : "warn",
    hint: experience.length > 0 ? undefined : "至少写一段经历，简历才有抓手",
  });

  const emptyBulletSections = experience.filter(
    (e) => e.bullets.filter(hasText).length === 0
  ).length;
  checks.push({
    id: "bullets",
    label:
      emptyBulletSections === 0
        ? "每段经历都有具体描述"
        : `${emptyBulletSections} 段经历缺少描述`,
    status: emptyBulletSections === 0 ? "pass" : "warn",
    hint: emptyBulletSections === 0 ? undefined : "填空：做了什么 → 结果如何",
  });

  // 6. 量化成果 —— 最容易拉开差距的一项
  const quantified = allBullets.filter((b) => QUANT_RE.test(b)).length;
  const quantRatio = allBullets.length ? quantified / allBullets.length : 0;
  checks.push({
    id: "quantified",
    label:
      quantRatio >= 0.6
        ? "多数描述含量化结果，说服力充足"
        : "建议补充更多量化结果",
    status: quantRatio >= 0.6 ? "pass" : "warn",
    hint:
      quantRatio >= 0.6
        ? undefined
        : `目前 ${quantified}/${allBullets.length} 条含量化数据，建议超过 60%`,
  });

  // 7. 描述长度合理
  const tooShort = allBullets.filter((b) => b.trim().length < 15).length;
  checks.push({
    id: "length",
    label: tooShort === 0 ? "描述长度适中" : `${tooShort} 条描述过短`,
    status: tooShort === 0 ? "pass" : "warn",
    hint: tooShort === 0 ? undefined : "每条至少写清「动作 + 对象 + 结果」",
  });

  // 8. 技能关键词
  const skillCount = skills
    .split(/[·、,，/|]/)
    .map((s) => s.trim())
    .filter(Boolean).length;
  checks.push({
    id: "skills",
    label:
      skillCount >= 4
        ? `技能关键词 ${skillCount} 个，覆盖良好`
        : "技能关键词偏少",
    status: skillCount >= 4 ? "pass" : "warn",
    hint: skillCount >= 4 ? undefined : "至少写 4 个岗位强相关关键词",
  });

  // 计分
  const warnCount = checks.filter((c) => c.status === "warn").length;
  const score = Math.max(0, 100 - warnCount * 7);

  // 必填完整度
  const required = [
    basics.name,
    basics.title,
    basics.phone,
    basics.email,
    skills,
  ].filter(hasText).length;
  const completeness = Math.round((required / 5) * 100);

  const totalText = [...allBullets, skills, basics.title].join(" ");
  const keywordHit = (totalText.match(/[A-Za-z]+/g) || []).length;
  const keywordLevel =
    keywordHit >= 6 ? "良好" : keywordHit >= 3 ? "一般" : "偏少";

  return {
    score,
    checks,
    metrics: {
      completeness,
      risk: twoColumn ? "中" : "低",
      keywordLevel,
    },
  };
}
