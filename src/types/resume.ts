/** 简历数据模型 —— 单栏结构，天然可被 ATS 解析 */

export interface Basics {
  name: string;
  title: string;
  city: string;
  phone: string;
  email: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  major: string;
  degree: string;
  start: string;
  end: string;
}

export interface ResumeData {
  basics: Basics;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  skills: string;
}

export type ListSection = "experience" | "projects" | "education";
export type BulletSection = "experience" | "projects";

export const emptyResume = (): ResumeData => ({
  basics: { name: "", title: "", city: "", phone: "", email: "" },
  experience: [],
  projects: [],
  education: [],
  skills: "",
});

/** 演示数据 —— 与 Ardot 设计稿保持一致 */
export const demoResume = (): ResumeData => ({
  basics: {
    name: "李思远",
    title: "高级产品经理 · 增长方向",
    city: "上海",
    phone: "138 0000 0000",
    email: "siyuan@example.com",
  },
  experience: [
    {
      id: "exp-1",
      company: "字节跳动",
      role: "高级产品经理",
      start: "2021.03",
      end: "至今",
      bullets: [
        "从 0 搭建 A/B 实验体系与渠道归因模型，支撑 12 条业务线的增长实验",
        "主导新用户引导流程改版，次周留存率 41% 提升至 52%，方案推广至 3 条产品线",
      ],
    },
  ],
  projects: [
    {
      id: "prj-1",
      name: "用户增长中台",
      role: "核心成员",
      start: "2022.06",
      end: "2023.04",
      bullets: ["统一实验平台与埋点规范，实验迭代周期从 2 周缩短至 4 天"],
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "同济大学",
      major: "工业设计",
      degree: "硕士",
      start: "2017.09",
      end: "2020.06",
    },
  ],
  skills: "产品策略 · 数据分析 · A/B 测试 · SQL · Figma · 用户研究",
});

export const uid = (): string => Math.random().toString(36).slice(2, 10);
