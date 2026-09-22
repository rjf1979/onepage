<script setup lang="ts">
import ResumePaper from "./ResumePaper.vue";
import { useResumeStore } from "@/stores/resume";

/**
 * 全局打印层 —— Teleport 到 body 直下，屏幕上不可见，打印时是唯一可见内容。
 *
 * 为什么要单独一层：
 * 编辑器/ATS 页里那份预览带着缩放、阴影、滚动容器，直接 window.print()
 * 会把页面外壳一起打出来（ATS 页尤其明显：打出来的是报告卡而不是简历）。
 */
const store = useResumeStore();
</script>

<template>
  <Teleport to="body">
    <div class="print-root" aria-hidden="true">
      <ResumePaper :data="store.data" />
    </div>
  </Teleport>
</template>
