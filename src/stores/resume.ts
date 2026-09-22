import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import {
  demoResume,
  emptyResume,
  uid,
  type Basics,
  type BulletSection,
  type EducationItem,
  type ExperienceItem,
  type ListSection,
  type ProjectItem,
  type ResumeData,
} from "@/types/resume";

const STORAGE_KEY = "onepage-resume:v1";

/**
 * 简历数据 —— 默认只落在浏览器本地，不上传服务器。
 * 这是「隐私在你手里」这条卖点的技术底座。
 */
export const useResumeStore = defineStore("resume", () => {
  const data = ref<ResumeData>(demoResume());
  const loaded = ref(false);

  // 读取本地存档（客户端启动时执行一次）
  function hydrate() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ResumeData>;
        if (parsed && typeof parsed === "object" && parsed.basics) {
          data.value = {
            ...emptyResume(),
            ...parsed,
            basics: { ...emptyResume().basics, ...parsed.basics },
          } as ResumeData;
        }
      }
    } catch {
      // 本地数据损坏时回落到演示数据
    }
    loaded.value = true;
  }

  // 变更后防抖落盘
  let timer: ReturnType<typeof setTimeout> | undefined;
  watch(
    data,
    (value) => {
      if (!loaded.value) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        } catch {
          // 隐私模式下可能不可写，忽略
        }
      }, 400);
    },
    { deep: true }
  );

  function updateBasics(patch: Partial<Basics>) {
    data.value.basics = { ...data.value.basics, ...patch };
  }

  function updateSkills(value: string) {
    data.value.skills = value;
  }

  function updateItem<T extends ListSection>(
    section: T,
    id: string,
    patch: Record<string, unknown>
  ) {
    const list = data.value[section] as unknown as Array<Record<string, unknown>>;
    data.value[section] = list.map((item) =>
      item.id === id ? { ...item, ...patch } : item
    ) as never;
  }

  function addItem(section: ListSection) {
    const id = uid();
    if (section === "experience") {
      const item: ExperienceItem = {
        id,
        company: "",
        role: "",
        start: "",
        end: "",
        bullets: [""],
      };
      data.value.experience = [...data.value.experience, item];
      return;
    }
    if (section === "projects") {
      const item: ProjectItem = {
        id,
        name: "",
        role: "",
        start: "",
        end: "",
        bullets: [""],
      };
      data.value.projects = [...data.value.projects, item];
      return;
    }
    const item: EducationItem = {
      id,
      school: "",
      major: "",
      degree: "",
      start: "",
      end: "",
    };
    data.value.education = [...data.value.education, item];
  }

  function removeItem(section: ListSection, id: string) {
    const list = data.value[section] as unknown as Array<{ id: string }>;
    data.value[section] = list.filter((i) => i.id !== id) as never;
  }

  function setBullets(section: BulletSection, id: string, text: string) {
    const bullets = text.split("\n");
    const list = data.value[section] as Array<{ id: string; bullets: string[] }>;
    data.value[section] = list.map((item) =>
      item.id === id ? { ...item, bullets } : item
    ) as never;
  }

  /** 导入备份 JSON —— 做最小结构校验，坏数据不落库 */
  function importData(input: unknown): boolean {
    if (!input || typeof input !== "object") return false;
    const parsed = input as Partial<ResumeData>;
    if (!parsed.basics || typeof parsed.basics !== "object") return false;
    data.value = {
      ...emptyResume(),
      ...parsed,
      basics: { ...emptyResume().basics, ...parsed.basics },
      experience: Array.isArray(parsed.experience) ? parsed.experience : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      education: Array.isArray(parsed.education) ? parsed.education : [],
      skills: typeof parsed.skills === "string" ? parsed.skills : "",
    } as ResumeData;
    return true;
  }

  function loadDemo() {
    data.value = demoResume();
  }

  function clearAll() {
    data.value = emptyResume();
  }

  const fileName = computed(() =>
    data.value.basics.name
      ? `${data.value.basics.name}-${data.value.basics.title || "简历"}`
      : "未命名简历"
  );

  return {
    data,
    loaded,
    fileName,
    hydrate,
    updateBasics,
    updateSkills,
    updateItem,
    addItem,
    removeItem,
    setBullets,
    importData,
    loadDemo,
    clearAll,
  };
});
