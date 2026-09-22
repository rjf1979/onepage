<script setup lang="ts">
import { computed, ref } from "vue";
import type { CSSProperties } from "vue";
import { RouterLink } from "vue-router";
import AppIcon from "@/components/AppIcon.vue";
import ResumePaper from "@/components/ResumePaper.vue";
import TextField from "@/components/editor/TextField.vue";
import BulletField from "@/components/editor/BulletField.vue";
import FormSection from "@/components/editor/FormSection.vue";
import { useResumeStore } from "@/stores/resume";
import { analyzeResume } from "@/lib/ats";
import { LIVE_TEMPLATES, PENDING_TEMPLATES } from "@/lib/templates";
import { useFitScale } from "@/composables/useFitScale";

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
  () => ({ width: `${paperW.value}px`, height: `${paperH.value}px` }),
);
/** 内层套用 transform 缩放 */
const editorPreviewInnerStyle = computed<CSSProperties>(
  () => ({ transform: `scale(${scale.value})` }),
);

const mobileTab = ref<"form" | "preview">("form");
const templateOpen = ref(false);
const menuOpen = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

/** 模板清单与落地页模板墙同源，见 lib/templates.ts */
const templates = [...LIVE_TEMPLATES, ...PENDING_TEMPLATES];

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
      <!-- ---------- 左：表单 ---------- -->
      <aside
        class="scroll-slim w-full shrink-0 overflow-y-auto bg-paper px-5 py-6 md:block md:w-[440px] md:px-7 xl:w-[500px]"
        :class="mobileTab === 'form' ? 'block' : 'hidden'"
      >
        <div class="space-y-5.5">
          <!-- 基本信息 -->
          <FormSection title="基本信息" hint="会显示在简历最上方">
            <div class="flex flex-col gap-2.5 sm:flex-row">
              <TextField
                label="姓名"
                :model-value="store.data.basics.name"
                placeholder="李思远"
                @update:model-value="(v) => store.updateBasics({ name: v })"
              />
              <TextField
                label="意向"
                :model-value="store.data.basics.title"
                placeholder="高级产品经理"
                @update:model-value="(v) => store.updateBasics({ title: v })"
              />
            </div>
            <div class="flex flex-col gap-2.5 sm:flex-row">
              <TextField
                label="城市"
                :model-value="store.data.basics.city"
                placeholder="上海"
                @update:model-value="(v) => store.updateBasics({ city: v })"
              />
              <TextField
                label="手机"
                :model-value="store.data.basics.phone"
                placeholder="138 0000 0000"
                @update:model-value="(v) => store.updateBasics({ phone: v })"
              />
            </div>
            <TextField
              label="邮箱"
              :model-value="store.data.basics.email"
              placeholder="name@example.com"
              @update:model-value="(v) => store.updateBasics({ email: v })"
            />
          </FormSection>

          <!-- 工作经历 -->
          <FormSection :title="`工作经历 · ${store.data.experience.length} 段`">
            <template #action>
              <button
                type="button"
                class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-vermilion transition hover:bg-vermilion-soft"
                @click="store.addItem('experience')"
              >
                <AppIcon name="plus" class="h-3.5 w-3.5" />
                添加经历
              </button>
            </template>

            <p
              v-if="store.data.experience.length === 0"
              class="rounded-xl border border-dashed border-[#d9d1c3] px-4 py-5 text-center text-[13px] text-ink-weak"
            >
              还没有填工作经历，这是简历里最重要的一块。
            </p>

            <div
              v-for="item in store.data.experience"
              :key="item.id"
              class="space-y-2.5 rounded-2xl border border-[#e8e1d5] bg-white p-4 shadow-[0_6px_18px_-4px_rgba(23,21,15,0.05)]"
            >
              <div class="flex flex-col gap-2.5 sm:flex-row">
                <TextField
                  label="公司"
                  :model-value="item.company"
                  placeholder="字节跳动"
                  @update:model-value="(v) => store.updateItem('experience', item.id, { company: v })"
                />
                <TextField
                  label="职位"
                  :model-value="item.role"
                  placeholder="高级产品经理"
                  @update:model-value="(v) => store.updateItem('experience', item.id, { role: v })"
                />
              </div>
              <div class="flex flex-col gap-2.5 sm:flex-row">
                <TextField
                  label="开始"
                  :model-value="item.start"
                  placeholder="2021.03"
                  @update:model-value="(v) => store.updateItem('experience', item.id, { start: v })"
                />
                <TextField
                  label="结束"
                  :model-value="item.end"
                  placeholder="至今"
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
          </FormSection>

          <!-- 项目经验 -->
          <FormSection :title="`项目经验 · ${store.data.projects.length} 个`">
            <template #action>
              <button
                type="button"
                class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-vermilion transition hover:bg-vermilion-soft"
                @click="store.addItem('projects')"
              >
                <AppIcon name="plus" class="h-3.5 w-3.5" />
                添加项目
              </button>
            </template>

            <p
              v-if="store.data.projects.length === 0"
              class="rounded-xl border border-dashed border-[#d9d1c3] px-4 py-5 text-center text-[13px] text-ink-weak"
            >
              有拿得出手的项目就写一条，能补上经历之外的能力证明。
            </p>

            <div
              v-for="item in store.data.projects"
              :key="item.id"
              class="space-y-2.5 rounded-2xl border border-[#e8e1d5] bg-white p-4 shadow-[0_6px_18px_-4px_rgba(23,21,15,0.05)]"
            >
              <div class="flex flex-col gap-2.5 sm:flex-row">
                <TextField
                  label="项目"
                  :model-value="item.name"
                  placeholder="用户增长中台"
                  @update:model-value="(v) => store.updateItem('projects', item.id, { name: v })"
                />
                <TextField
                  label="角色"
                  :model-value="item.role"
                  placeholder="核心成员"
                  @update:model-value="(v) => store.updateItem('projects', item.id, { role: v })"
                />
              </div>
              <div class="flex flex-col gap-2.5 sm:flex-row">
                <TextField
                  label="开始"
                  :model-value="item.start"
                  placeholder="2022.06"
                  @update:model-value="(v) => store.updateItem('projects', item.id, { start: v })"
                />
                <TextField
                  label="结束"
                  :model-value="item.end"
                  placeholder="2023.04"
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
          </FormSection>

          <!-- 教育背景 -->
          <FormSection :title="`教育背景 · ${store.data.education.length} 条`">
            <template #action>
              <button
                type="button"
                class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-vermilion transition hover:bg-vermilion-soft"
                @click="store.addItem('education')"
              >
                <AppIcon name="plus" class="h-3.5 w-3.5" />
                添加学历
              </button>
            </template>

            <p
              v-if="store.data.education.length === 0"
              class="rounded-xl border border-dashed border-[#d9d1c3] px-4 py-5 text-center text-[13px] text-ink-weak"
            >
              至少写一条学历，校招和社招都会看。
            </p>

            <div
              v-for="item in store.data.education"
              :key="item.id"
              class="space-y-2.5 rounded-2xl border border-[#e8e1d5] bg-white p-4 shadow-[0_6px_18px_-4px_rgba(23,21,15,0.05)]"
            >
              <TextField
                label="学校"
                :model-value="item.school"
                placeholder="同济大学"
                @update:model-value="(v) => store.updateItem('education', item.id, { school: v })"
              />
              <div class="flex flex-col gap-2.5 sm:flex-row">
                <TextField
                  label="专业"
                  :model-value="item.major"
                  placeholder="工业设计"
                  @update:model-value="(v) => store.updateItem('education', item.id, { major: v })"
                />
                <TextField
                  label="学历"
                  :model-value="item.degree"
                  placeholder="硕士"
                  @update:model-value="(v) => store.updateItem('education', item.id, { degree: v })"
                />
              </div>
              <div class="flex flex-col gap-2.5 sm:flex-row">
                <TextField
                  label="入学"
                  :model-value="item.start"
                  placeholder="2017.09"
                  @update:model-value="(v) => store.updateItem('education', item.id, { start: v })"
                />
                <TextField
                  label="毕业"
                  :model-value="item.end"
                  placeholder="2020.06"
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
          </FormSection>

          <!-- 技能 -->
          <FormSection title="技能与工具" hint="用「·」分隔，ATS 按关键词检索">
            <textarea
              :value="store.data.skills"
              rows="3"
              placeholder="产品策略 · 数据分析 · A/B 测试 · SQL · Figma"
              class="w-full resize-none rounded-[11px] border border-line bg-white px-3.5 py-3 text-[14px] leading-6 text-ink outline-none transition focus:border-vermilion"
              @input="store.updateSkills(($event.target as HTMLTextAreaElement).value)"
            />
          </FormSection>

          <!-- 添加模块 -->
          <div class="rounded-[14px] border border-dashed border-[#d9d1c3] p-4">
            <p class="text-[13px] font-semibold text-ink-soft">添加模块</p>
            <div class="mt-2.5 flex flex-wrap gap-2">
              <button
                v-for="m in [
                  { key: 'experience', label: '＋ 工作经历' },
                  { key: 'projects', label: '＋ 项目经验' },
                  { key: 'education', label: '＋ 教育背景' },
                ]"
                :key="m.key"
                type="button"
                class="rounded-lg bg-white px-3 py-1.5 text-[13px] font-medium text-[#4a4238] shadow-[0_2px_6px_-2px_rgba(23,21,15,0.1)] transition hover:text-vermilion"
                @click="store.addItem(m.key as 'experience' | 'projects' | 'education')"
              >
                {{ m.label }}
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
