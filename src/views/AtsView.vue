<script setup lang="ts">
import { RouterLink } from "vue-router";
import { computed } from "vue";
import AppIcon from "@/components/AppIcon.vue";
import ParseDiagram from "@/components/ats/ParseDiagram.vue";
import { useResumeStore } from "@/stores/resume";
import { analyzeResume } from "@/lib/ats";

const store = useResumeStore();
const report = computed(() => analyzeResume(store.data));
</script>

<template>
  <div class="min-h-screen bg-paper">
    <!-- 顶栏 -->
    <header
      class="no-print flex items-center justify-between border-b border-line bg-white px-5 py-3.5 sm:px-7 sm:py-4"
    >
      <div class="flex items-center gap-3.5">
        <RouterLink
          to="/editor"
          class="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-[#f4efe6] text-ink-soft transition hover:bg-[#ece4d7]"
          aria-label="返回编辑器"
        >
          <AppIcon name="arrow-left" class="h-4.5 w-4.5" />
        </RouterLink>
        <span class="text-[15px] font-semibold text-ink">ATS 自检报告</span>
      </div>
      <RouterLink
        to="/editor"
        class="text-[14px] font-medium text-ink-weak transition hover:text-ink"
      >
        返回编辑器
      </RouterLink>
    </header>

    <div
      class="mx-auto flex max-w-[1264px] flex-col items-center gap-10 px-5 py-9 sm:px-8 xl:flex-row xl:items-start xl:justify-center xl:gap-13 xl:px-22 xl:py-11"
    >
      <!-- ---------- 报告卡 ---------- -->
      <div
        class="w-full max-w-[600px] rounded-[22px] border border-[#e8e1d5] bg-white p-6 shadow-[0_12px_32px_-8px_rgba(23,21,15,0.07)] sm:p-8"
      >
        <p class="text-[13px] font-semibold tracking-[1.8px] text-success">
          自检完成 · 本地分析，不上传任何数据
        </p>
        <h1
          class="font-serif-cn mt-2.5 text-[23px] leading-[34px] font-bold text-ink sm:text-[27px] sm:leading-[38px]"
        >
          这份简历，机器读得很顺
        </h1>

        <!-- 分数 -->
        <div class="mt-6 flex items-center gap-6 sm:gap-6.5">
          <div
            class="flex h-[92px] w-[92px] shrink-0 flex-col items-center justify-center rounded-full bg-success-soft sm:h-[104px] sm:w-[104px]"
          >
            <span
              class="font-[family-name:Georgia,serif] text-[36px] font-bold leading-none text-success sm:text-[40px]"
            >
              {{ report.score }}
            </span>
            <span class="mt-1 text-[11px] font-medium text-[#4e7a63] sm:text-[11.5px]">
              兼容分
            </span>
          </div>
          <div class="flex-1 space-y-2.75">
            <div class="flex items-center justify-between">
              <span class="text-[13px] text-ink-soft sm:text-[13.5px]">解析完整度</span>
              <span class="text-[13px] font-semibold text-ink sm:text-[13.5px]">
                {{ report.metrics.completeness }} / 100
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[13px] text-ink-soft sm:text-[13.5px]">排版解析风险</span>
              <span class="text-[13px] font-semibold text-ink sm:text-[13.5px]">
                {{ report.metrics.risk }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[13px] text-ink-soft sm:text-[13.5px]">岗位关键词覆盖</span>
              <span class="text-[13px] font-semibold text-ink sm:text-[13.5px]">
                {{ report.metrics.keywordLevel }}
              </span>
            </div>
          </div>
        </div>

        <!-- 检查项 -->
        <div class="mt-6 space-y-2.25">
          <div
            v-for="c in report.checks"
            :key="c.id"
            class="flex items-center gap-2.5 rounded-[11px] bg-paper px-3.5 py-2.75"
          >
            <AppIcon
              :name="c.status === 'pass' ? 'check-circle' : 'warn-circle'"
              class="h-4 w-4 shrink-0 sm:h-4.25 sm:w-4.25"
            />
            <span class="flex-1 text-[13px] text-[#4a4238] sm:text-[13.5px]">
              {{ c.label }}
              <span v-if="c.hint" class="ml-1.5 text-[12px] text-ink-weak sm:text-[12.5px]">
                · {{ c.hint }}
              </span>
            </span>
            <span
              class="text-[12px] font-semibold"
              :class="c.status === 'pass' ? 'text-success' : 'text-warn-text'"
            >
              {{ c.status === 'pass' ? '通过' : '建议' }}
            </span>
          </div>
        </div>

        <!-- CTA -->
        <div class="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-vermilion py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#c3381a]"
            @click="() => $router.push('/editor')"
          >
            <AppIcon name="arrow-left" class="h-4 w-4" />
            回去继续改
          </button>
          <RouterLink
            to="/editor"
            class="flex flex-1 items-center justify-center rounded-xl border border-[#dcd4c6] py-3.5 text-[15px] font-medium text-[#4a4238] transition hover:border-[#c8bda9]"
          >
            预览与导出
          </RouterLink>
        </div>
      </div>

      <!-- ---------- 解析示意 ---------- -->
      <div class="flex w-full max-w-[420px] flex-col items-center xl:items-start">
        <ParseDiagram />
      </div>
    </div>
  </div>
</template>
