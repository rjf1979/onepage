<script setup lang="ts">
import { computed, ref } from "vue";
import type { CSSProperties } from "vue";
import { RouterLink } from "vue-router";
import AppIcon from "@/components/AppIcon.vue";
import ResumePaper from "@/components/ResumePaper.vue";
import TextField from "@/components/editor/TextField.vue";
import BulletField from "@/components/editor/BulletField.vue";
import FormSection from "@/components/editor/FormSection.vue";
import SectionCard from "@/components/editor/SectionCard.vue";
import { useResumeStore } from "@/stores/resume";
import { analyzeResume } from "@/lib/ats";
import { LIVE_TEMPLATES, PENDING_TEMPLATES } from "@/lib/templates";
import { useFitScale } from "@/composables/useFitScale";
import type { ListSection } from "@/types/resume";

const A4_WIDTH_PX = 793.7;
const A4_HEIGHT_PX = 1122.5;

const store = useResumeStore();
const report = computed(() => analyzeResume(store.data));

/** 预览缩放：默认自适应，手动调过后按手动值 */
const { hostRef, fit } = useFitScale({ paddingPx: 48, min: 0.3, max: 1 });
const manualScale = ref<number | null>(null);
const scale = computed(() => manualScale.value ?? fit.value);
const paperW = computed(() => A4_WIDTH_PX * scale.value);
const paperH = computed(() => A4_HEIGHT_PX * scale.value);

/** 预览框：按缩放后的像素尺寸裁切 */
const editorPreviewBoxStyle = computed<CSSProperties>(
  () => ({ width: `${paperW.value}px`, height: `${paperH.value}px` })
);
/** 内层套用 transform 缩放 */
const editorPreviewInnerStyle = computed<CSSProperties>(
  () => ({ transform: `scale(${scale.value})` })
);

const mobileTab = ref<"form" | "preview">("form");
const templateOpen = ref(false);
const menuOpen = ref(false);
const addModuleOpen = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

/** 模板清单与落地页模板墙同源，见 lib/templates.ts */
const templates = [...LIVE_TEMPLATES, ...PENDING_TEMPLATES];

/**
 * 折叠状态 —— 对齐设计稿：「工作经历」展开、「教育背景」折叠成摘要行。
 * 「项目经验」设计稿没画到，同样按折叠处理，靠摘要行保证内容可见。
 */
const collapsed = ref<Record<ListSection, boolean>>({
  experience: false,
  projects: true,
  education: true,
});

/** 设计稿折叠态显示摘要行，这里由真实数据拼出来 */
const expSummary = computed(() => {
  const list = store.data.experience;
  if (list.length === 0) return "还没填写，这是简历里最重要的一块";
  const head = [list[0].company, list[0].role].filter(Boolean).join(" · ") || "未命名经历";
  return list.length > 1 ? `${head} 等 ${list.length} 段` : head;
});

const prjSummary = computed(() => {
  const list = store.data.projects;
  if (list.length === 0) return "还没填写，有拿得出手的项目可以补一条";
  const head = [list[0].name, list[0].role].filter(Boolean).join(" · ") || "未命名项目";
  return list.length > 1 ? `${head} 等 ${list.length} 个` : head;
});

const eduSummary = computed(() => {
  const list = store.data.education;
  if (list.length === 0) return "至少写一条学历，校招和社招都会看";
  const first = list[0];
  const school = [first.school, [first.major, first.degree].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(" · ");
  const span = [first.start, first.end].filter(Boolean).join(" — ");
  return [school, span].filter(Boolean).join(" · ") || "未命名学历";
});

/**
 * 添加模块 —— 设计稿是单个虚线按钮，模块清单在展开的菜单里。
 * 「校园经历 / 证书」设计稿里有，但数据模型还没支持，标为即将上线而不是假装能加。
 */
const moduleOptions: { key: string; label: string; ready: boolean }[] = [
  { key: "experience", label: "工作经历", ready: true },
  { key: "projects", label: "项目经验", ready: true },
  { key: "education", label: "教育背景", ready: true },
  { key: "campus", label: "校园经历", ready: false },
  { key: "certificate", label: "证书", ready: false },
];

function addModule(option: { key: string; ready: boolean }) {
  if (!option.ready) return;
  const section = option.key as ListSection;
  store.addItem(section);
  collapsed.value[section] = false;
  addModuleOpen.value = false;
}

function zoom(delta: number) {
  manualScale.value = Math.min(1.5, Math.max(0.3, scale.value + delta));
}

function fitPage() {
  manualScale.value = null;
}

function handleExport() {
  if (!store.data.basics.name.trim()) {
    alert("先填上姓名再导出吧，不然 HR 不知道这是谁的简历。");
    return;
  }
  window.print();
}

function exportJson() {
  const blob = new Blob([JSON.stringify(store.data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${store.fileName}-备份.json`;
  a.click();
  URL.revokeObjectURL(url);
  menuOpen.value = false;
}

function pickBackup() {
  fileInput.value?.click();
  menuOpen.value = false;
}

function onPickFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const ok = store.importData(JSON.parse(String(reader.result)));
      if (!ok) alert("这份备份读不出来，换一个文件试试。");
    } catch {
      alert("文件不是有效的 JSON。");
    }
  };
  reader.readAsText(file);
  input.value = "";
}

function loadDemo() {
  store.loadDemo();
  menuOpen.value = false;
}

function clearAll() {
  if (confirm("清空后无法恢复，确定要全部重写吗？")) {
    store.clearAll();
  }
  menuOpen.value = false;
}
</script>

<template>
  <div class="flex h-[100dvh] flex-col bg-white">
    <!-- ================= 顶栏 ================= -->
    <header
      class="flex shrink-0 items-center justify-between gap-2 border-b border-line px-4 py-3 sm:px-6"
    >
      <div class="flex min-w-0 items-center gap-3">
        <RouterLink
          to="/"
          class="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-[#f4efe6] text-ink-soft transition hover:bg-[#ece4d7]"
          aria-label="返回首页"
        >
          <AppIcon name="arrow-left" class="h-4.5 w-4.5" />
        </RouterLink>
        <span class="truncate text-[14px] font-semibold text-ink sm:text-[15px]">
          {{ store.fileName }}
        </span>
        <span class="hidden items-center gap-1.5 text-[12.5px] text-ink-weak sm:flex">
          <span class="h-1.5 w-1.5 rounded-full bg-success" />
          {{ store.loaded ? "已自动保存到本地" : "加载中" }}
        </span>
      </div>

      <div class="flex shrink-0 items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          class="hidden items-center gap-1.5 rounded-[10px] border border-line px-3 py-2 text-[13.5px] font-medium text-[#4a4238] transition hover:border-[#c8bda9] md:flex"
          @click="templateOpen = true"
        >
          换模板
        </button>

        <RouterLink
          to="/ats"
          class="flex items-center gap-1.5 rounded-[10px] bg-success-soft px-3 py-2.5 text-[13px] font-semibold text-success transition hover:bg-[#dfeae2] sm:px-4 sm:text-[14px]"
        >
          <AppIcon name="scan" class="h-4 w-4" />
          <span class="hidden sm:inline">ATS 自检</span>
          <span class="text-[12.5px] font-normal opacity-70">{{ report.score }}</span>
        </RouterLink>

        <button
          type="button"
          class="flex items-center gap-2 rounded-[10px] bg-vermilion px-3.5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#c3381a] sm:px-5 sm:text-[14px]"
          @click="handleExport"
        >
          <AppIcon name="download" class="h-4 w-4" />
          导出 PDF
        </button>

        <!-- 更多 -->
        <div class="relative">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line text-ink-soft transition hover:bg-paper"
            aria-label="更多操作"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <AppIcon name="more" class="h-4.5 w-4.5" />
          </button>
          <div
            v-if="menuOpen"
            class="absolute top-full right-0 z-50 mt-2 w-[200px] overflow-hidden rounded-[12px] border border-line bg-white py-1 shadow-[0_16px_36px_-10px_rgba(23,21,15,0.22)]"
          >
            <button
              type="button"
              class="block w-full px-4 py-2.5 text-left text-[13.5px] text-[#4a4238] transition hover:bg-paper"
              @click="exportJson"
            >
              导出 JSON 备份
            </button>
            <button
              type="button"
              class="block w-full px-4 py-2.5 text-left text-[13.5px] text-[#4a4238] transition hover:bg-paper"
              @click="pickBackup"
            >
              导入备份文件
            </button>
            <button
              type="button"
              class="block w-full px-4 py-2.5 text-left text-[13.5px] text-[#4a4238] transition hover:bg-paper"
              @click="loadDemo"
            >
              载入示例简历
            </button>
            <button
              type="button"
              class="block w-full px-4 py-2.5 text-left text-[13.5px] text-vermilion transition hover:bg-vermilion-soft"
              @click="clearAll"
            >
              清空全部内容
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- ================= 移动端 Tab ================= -->
    <div class="flex shrink-0 gap-1 border-b border-line bg-paper px-4 py-2 md:hidden">
      <button
        type="button"
        class="flex-1 rounded-lg py-2 text-[13.5px] font-semibold transition"
        :class="mobileTab === 'form' ? 'bg-white text-ink shadow-sm' : 'text-ink-weak'"
        @click="mobileTab = 'form'"
      >
        填写内容
      </button>
      <button
        type="button"
        class="flex-1 rounded-lg py-2 text-[13.5px] font-semibold transition"
        :class="mobileTab === 'preview' ? 'bg-white text-ink shadow-sm' : 'text-ink-weak'"
        @click="mobileTab = 'preview'"
      >
        预览
      </button>
    </div>

    <!-- ================= 主体 ================= -->
    <div class="flex min-h-0 flex-1">
      <!-- ---------- 左：表单（宽度按设计稿 486px） ---------- -->
      <aside
        class="scroll-slim w-full shrink-0 overflow-y-auto bg-paper px-5 py-6 md:block md:w-[440px] md:px-7 xl:w-[486px]"
        :class="mobileTab === 'form' ? 'block' : 'hidden'"
      >
        <div class="space-y-4">
          <!-- 基本信息：设计稿是三个通栏 pill -->
          <FormSection title="基本信息" hint="会显示在简历最上方">
            <TextField
              label="姓名"
              wide-label
              :model-value="store.data.basics.name"
              placeholder="李思远"
              @update:model-value="(v) => store.updateBasics({ name: v })"
            />
            <TextField
              label="求职意向"
              wide-label
              :model-value="store.data.basics.title"
              placeholder="高级产品经理（增长方向）"
              @update:model-value="(v) => store.updateBasics({ title: v })"
            />

            <!-- 联系方式：设计稿是一个 pill 内以「·」分隔。
                 仍保留三个独立字段 —— 合并成一个自由文本会让 ATS 的手机号/邮箱格式校验失效 -->
            <div
              class="flex flex-wrap items-center gap-1.5 rounded-[10px] border border-line bg-white px-3.5 py-2.5 transition focus-within:border-vermilion"
            >
              <span class="w-[56px] shrink-0 text-[12.5px] text-ink-weak">联系方式</span>
              <input
                :value="store.data.basics.city"
                placeholder="上海"
                class="w-[44px] min-w-0 shrink-0 bg-transparent text-[14px] text-ink outline-none placeholder:text-[#c3baaa]"
                @input="store.updateBasics({ city: ($event.target as HTMLInputElement).value })"
              />
              <span class="shrink-0 text-[13px] text-[#d9d1c3]">·</span>
              <input
                :value="store.data.basics.phone"
                placeholder="138 0000 0000"
                class="w-[100px] min-w-0 shrink-0 bg-transparent text-[14px] text-ink outline-none placeholder:text-[#c3baaa]"
                @input="store.updateBasics({ phone: ($event.target as HTMLInputElement).value })"
              />
              <span class="shrink-0 text-[13px] text-[#d9d1c3]">·</span>
              <input
                :value="store.data.basics.email"
                placeholder="name@example.com"
                class="min-w-[118px] flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-[#c3baaa]"
                @input="store.updateBasics({ email: ($event.target as HTMLInputElement).value })"
              />
            </div>
          </FormSection>

          <!-- 工作经历 -->
          <SectionCard
            v-model:collapsed="collapsed.experience"
            :title="`工作经历 · ${store.data.experience.length} 段`"
            :summary="expSummary"
          >
            <div
              v-for="(item, i) in store.data.experience"
              :key="item.id"
              class="space-y-2.5"
              :class="i > 0 ? 'mt-4 border-t border-[#f0e9dd] pt-4' : ''"
            >
              <div class="flex flex-col gap-2.5 sm:flex-row">
                <TextField
                  tone="cream"
                  :model-value="item.company"
                  placeholder="字节跳动"
                  @update:model-value="(v) => store.updateItem('experience', item.id, { company: v })"
                />
                <TextField
                  tone="cream"
                  :model-value="item.role"
                  placeholder="高级产品经理"
                  @update:model-value="(v) => store.updateItem('experience', item.id, { role: v })"
                />
              </div>
              <div class="flex flex-col gap-2.5 sm:flex-row">
                <TextField
                  tone="cream"
                  :model-value="item.start"
                  placeholder="开始 2021.03"
                  @update:model-value="(v) => store.updateItem('experience', item.id, { start: v })"
                />
                <TextField
                  tone="cream"
                  :model-value="item.end"
                  placeholder="结束 至今"
                  @update:model-value="(v) => store.updateItem('experience', item.id, { end: v })"
                />
              </div>
              <BulletField
                :model-value="item.bullets.join('\n')"
                @update:model-value="(v) => store.setBullets('experience', item.id, v)"
              />
              <button
                type="button"
                class="flex items-center gap-1.5 text-[12.5px] text-ink-weak transition hover:text-vermilion"
                @click="store.removeItem('experience', item.id)"
              >
                <AppIcon name="trash" class="h-3.5 w-3.5" />
                删除这一段
              </button>
            </div>
          </SectionCard>

          <!-- 项目经验 -->
          <SectionCard
            v-model:collapsed="collapsed.projects"
            :title="`项目经验 · ${store.data.projects.length} 个`"
            :summary="prjSummary"
          >
            <div
              v-for="(item, i) in store.data.projects"
              :key="item.id"
              class="space-y-2.5"
              :class="i > 0 ? 'mt-4 border-t border-[#f0e9dd] pt-4' : ''"
            >
              <div class="flex flex-col gap-2.5 sm:flex-row">
                <TextField
                  tone="cream"
                  :model-value="item.name"
                  placeholder="用户增长中台"
                  @update:model-value="(v) => store.updateItem('projects', item.id, { name: v })"
                />
                <TextField
                  tone="cream"
                  :model-value="item.role"
                  placeholder="核心成员"
                  @update:model-value="(v) => store.updateItem('projects', item.id, { role: v })"
                />
              </div>
              <div class="flex flex-col gap-2.5 sm:flex-row">
                <TextField
                  tone="cream"
                  :model-value="item.start"
                  placeholder="开始 2022.06"
                  @update:model-value="(v) => store.updateItem('projects', item.id, { start: v })"
                />
                <TextField
                  tone="cream"
                  :model-value="item.end"
                  placeholder="结束 2023.04"
                  @update:model-value="(v) => store.updateItem('projects', item.id, { end: v })"
                />
              </div>
              <BulletField
                :model-value="item.bullets.join('\n')"
                @update:model-value="(v) => store.setBullets('projects', item.id, v)"
              />
              <button
                type="button"
                class="flex items-center gap-1.5 text-[12.5px] text-ink-weak transition hover:text-vermilion"
                @click="store.removeItem('projects', item.id)"
              >
                <AppIcon name="trash" class="h-3.5 w-3.5" />
                删除这一段
              </button>
            </div>
          </SectionCard>

          <!-- 教育背景（设计稿里折叠成「教育背景 · 已填好」+ 摘要行） -->
          <SectionCard
            v-model:collapsed="collapsed.education"
            :title="`教育背景 · ${store.data.education.length > 0 ? '已填好' : '待填写'}`"
            :summary="eduSummary"
          >
            <div
              v-for="(item, i) in store.data.education"
              :key="item.id"
              class="space-y-2.5"
              :class="i > 0 ? 'mt-4 border-t border-[#f0e9dd] pt-4' : ''"
            >
              <TextField
                tone="cream"
                :model-value="item.school"
                placeholder="同济大学"
                @update:model-value="(v) => store.updateItem('education', item.id, { school: v })"
              />
              <div class="flex flex-col gap-2.5 sm:flex-row">
                <TextField
                  tone="cream"
                  :model-value="item.major"
                  placeholder="工业设计"
                  @update:model-value="(v) => store.updateItem('education', item.id, { major: v })"
                />
                <TextField
                  tone="cream"
                  :model-value="item.degree"
                  placeholder="硕士"
                  @update:model-value="(v) => store.updateItem('education', item.id, { degree: v })"
                />
              </div>
              <div class="flex flex-col gap-2.5 sm:flex-row">
                <TextField
                  tone="cream"
                  :model-value="item.start"
                  placeholder="入学 2017.09"
                  @update:model-value="(v) => store.updateItem('education', item.id, { start: v })"
                />
                <TextField
                  tone="cream"
                  :model-value="item.end"
                  placeholder="毕业 2020.06"
                  @update:model-value="(v) => store.updateItem('education', item.id, { end: v })"
                />
              </div>
              <button
                type="button"
                class="flex items-center gap-1.5 text-[12.5px] text-ink-weak transition hover:text-vermilion"
                @click="store.removeItem('education', item.id)"
              >
                <AppIcon name="trash" class="h-3.5 w-3.5" />
                删除这一段
              </button>
            </div>
          </SectionCard>

          <!-- 技能 -->
          <FormSection title="技能与工具" hint="用「·」分隔，ATS 按关键词检索">
            <textarea
              :value="store.data.skills"
              rows="3"
              placeholder="产品策略 · 数据分析 · A/B 测试 · SQL · Figma"
              class="w-full resize-none rounded-[11px] border border-[#ece5d9] bg-[#fbf7ef] px-3.5 py-3 text-[14px] leading-6 text-ink outline-none transition focus:border-vermilion"
              @input="store.updateSkills(($event.target as HTMLTextAreaElement).value)"
            />
          </FormSection>

          <!-- 添加模块：设计稿是单个虚线按钮，展开后选类型 -->
          <div>
            <button
              type="button"
              class="flex w-full items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-[#d9d1c3] px-4 py-3.5 text-[13.5px] font-medium text-ink-soft transition hover:border-vermilion hover:text-vermilion"
              :aria-expanded="addModuleOpen"
              @click="addModuleOpen = !addModuleOpen"
            >
              <AppIcon name="plus" class="h-4 w-4" />
              添加模块：工作经历 / 项目经验 / 教育背景
            </button>
            <div
              v-if="addModuleOpen"
              class="mt-2.5 flex flex-wrap gap-2 rounded-[12px] border border-line bg-white p-3"
            >
              <button
                v-for="m in moduleOptions"
                :key="m.key"
                type="button"
                class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition"
                :class="
                  m.ready
                    ? 'bg-paper text-[#4a4238] hover:text-vermilion'
                    : 'cursor-not-allowed bg-paper/60 text-[#b0a695]'
                "
                :disabled="!m.ready"
                :title="m.ready ? undefined : '即将上线'"
                @click="addModule(m)"
              >
                {{ m.label }}
                <span v-if="!m.ready" class="text-[11px]">即将上线</span>
              </button>
            </div>
          </div>

          <!-- 隐私提示 -->
          <div class="flex gap-2.5 rounded-[14px] bg-[#f6f1e6] p-4">
            <AppIcon name="lock" class="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#5b4c33]" />
            <p class="text-[12.5px] leading-5 text-[#5b4c33]">
              数据只存在你这台设备的浏览器里，不上传服务器。清空浏览器数据会一并清掉，重要的话记得用「导出
              JSON 备份」存一份。
            </p>
          </div>
        </div>
      </aside>

      <!-- ---------- 右：预览 ---------- -->
      <main
        ref="hostRef"
        class="min-w-0 flex-1 flex-col overflow-auto bg-deco px-4 py-6 md:flex md:px-6 md:py-8"
        :class="mobileTab === 'preview' ? 'flex' : 'hidden'"
      >
        <div class="flex-1">
          <div
            class="mx-auto"
            :style="editorPreviewBoxStyle"
          >
            <div
              class="paper-frame"
              :style="editorPreviewInnerStyle"
            >
              <ResumePaper
                :data="store.data"
                class="shadow-[0_18px_44px_-10px_rgba(23,21,15,0.18)]"
              />
            </div>
          </div>
        </div>

        <!-- 缩放控制 -->
        <div class="mt-4 flex justify-center">
          <div
            class="flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 shadow-[0_8px_22px_-8px_rgba(23,21,15,0.2)]"
          >
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft transition hover:bg-paper"
              aria-label="缩小"
              @click="zoom(-0.1)"
            >
              <AppIcon name="minus" class="h-4 w-4" />
            </button>
            <span class="w-[52px] text-center text-[12.5px] font-semibold text-ink">
              {{ Math.round(scale * 100) }}%
            </span>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft transition hover:bg-paper"
              aria-label="放大"
              @click="zoom(0.1)"
            >
              <AppIcon name="plus" class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="ml-1 rounded-full px-2.5 py-1 text-[12px] font-medium text-ink-soft transition hover:bg-paper"
              @click="fitPage"
            >
              适应页面
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- ================= 换模板弹层 ================= -->
    <div
      v-if="templateOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-5"
      @click.self="templateOpen = false"
    >
      <div class="w-full max-w-[680px] rounded-[18px] bg-white p-6 shadow-2xl">
        <div class="flex items-center justify-between">
          <h3 class="font-serif-cn text-[20px] font-bold text-ink">选择模板</h3>
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition hover:bg-paper"
            aria-label="关闭"
            @click="templateOpen = false"
          >
            <AppIcon name="close" class="h-4.5 w-4.5" />
          </button>
        </div>
        <p class="mt-1.5 text-[13px] text-ink-weak">
          已上线的模板都是单栏纯文本结构，ATS 可完整解析。
        </p>
        <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            v-for="t in templates"
            :key="t.id"
            class="rounded-[14px] border p-4"
            :class="
              t.available
                ? 'border-vermilion bg-vermilion-soft/40'
                : 'border-line bg-paper opacity-70'
            "
          >
            <div class="flex items-center justify-between">
              <p class="font-serif-cn text-[16px] font-semibold text-ink">
                {{ t.name }}
              </p>
              <span
                v-if="t.available"
                class="rounded-full bg-vermilion px-2.5 py-0.5 text-[11px] font-semibold text-white"
              >
                使用中
              </span>
              <span
                v-else
                class="rounded-full bg-[#efe9dc] px-2.5 py-0.5 text-[11px] font-semibold text-[#8a8175]"
              >
                打磨中
              </span>
            </div>
            <p class="mt-1.5 text-[12.5px] text-ink-weak">{{ t.tag }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 菜单遮罩（点击别处关闭） -->
    <div v-if="menuOpen" class="fixed inset-0 z-40" @click="menuOpen = false" />

    <input
      ref="fileInput"
      type="file"
      accept="application/json,.json"
      class="hidden"
      @change="onPickFile"
    />
  </div>
</template>
