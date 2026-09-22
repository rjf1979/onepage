<script setup lang="ts">
import { computed } from "vue";
import type { ResumeData } from "@/types/resume";
import ClassicTemplate from "./resume/ClassicTemplate.vue";
import CompactTemplate from "./resume/CompactTemplate.vue";
import AcademicTemplate from "./resume/AcademicTemplate.vue";
import PortfolioTemplate from "./resume/PortfolioTemplate.vue";

/**
 * A4 简历外壳 —— 编辑器预览、打印导出、落地页 Hero 三处共用。
 *
 * 这里只负责「A4 纸」本身与版式分发，具体排版在 components/resume/ 下各模板里。
 * 未上线或未知的 templateId 一律回退到经典单栏：宁可版式不符，也不能渲染成空白。
 */
const props = defineProps<{ data: ResumeData }>();

const RENDERERS = {
  classic: ClassicTemplate,
  compact: CompactTemplate,
  academic: AcademicTemplate,
  portfolio: PortfolioTemplate,
} as const;

const renderer = computed(
  () => RENDERERS[props.data.templateId as keyof typeof RENDERERS] ?? ClassicTemplate
);
</script>

<template>
  <article class="resume-paper">
    <component :is="renderer" :data="data" />
  </article>
</template>
