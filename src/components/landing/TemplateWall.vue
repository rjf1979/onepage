<script setup lang="ts">
import { RouterLink } from "vue-router";
import TemplateThumb from "./TemplateThumb.vue";
import AppIcon from "@/components/AppIcon.vue";
import { LIVE_TEMPLATES, PENDING_TEMPLATES, TEMPLATES } from "@/lib/templates";

/** 已上线的排前面，每个模板的可用状态只有 lib/templates.ts 一个来源 */
const ordered = [...LIVE_TEMPLATES, ...PENDING_TEMPLATES];
</script>

<template>
  <section id="templates" class="px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
    <div class="mb-10 flex flex-wrap items-end justify-between gap-4 lg:mb-12">
      <div>
        <p class="text-[13px] font-semibold tracking-[3px] text-vermilion">
          模板
        </p>
        <h2
          class="font-serif-cn mt-3.5 text-[30px] leading-[42px] font-bold text-ink lg:text-[40px] lg:leading-[54px]"
        >
          模板先做精，再做多
        </h2>
        <p
          class="mt-3.5 max-w-[620px] text-[15px] leading-[27px] text-ink-soft lg:text-[16px]"
        >
          已上线 {{ LIVE_TEMPLATES.length }} 套，还有 {{ PENDING_TEMPLATES.length }} 套在打磨。
          每一套都要先过 ATS 解析这一关：不用文本框、图标、表格这类机器读不到的结构；
          分栏模板只用 CSS 栅格做视觉分层，文本顺序仍按单栏线性输出，
          自检里会如实标成「中等风险」，而不是闭眼说低。
        </p>
      </div>
      <RouterLink
        to="/editor"
        class="flex items-center gap-1.5 text-[14px] font-semibold text-vermilion transition hover:text-vermilion-deep"
      >
        去编辑器挑模板
        <AppIcon name="arrow-right" class="h-4 w-4" />
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <component
        :is="t.available ? RouterLink : 'div'"
        v-for="t in ordered"
        :key="t.id"
        v-bind="t.available ? { to: '/editor' } : {}"
        class="group block"
        :class="t.available ? '' : 'opacity-80'"
      >
        <div
          class="relative h-[260px] w-full overflow-hidden rounded-[5px] bg-white shadow-[0_12px_26px_-6px_rgba(23,21,15,0.13)] lg:h-[300px]"
        >
          <TemplateThumb :variant="t.variant" />
          <div
            v-if="!t.available"
            class="absolute inset-0 flex items-center justify-center bg-white/72"
          >
            <span
              class="rounded-full bg-[#f0e9db] px-3.5 py-1.5 text-[12.5px] font-semibold text-[#8a8175]"
            >
              打磨中
            </span>
          </div>
        </div>
        <p class="font-serif-cn mt-3.5 text-[17px] font-semibold text-ink">
          {{ t.name }}
        </p>
        <p class="mt-1 text-[13px] text-ink-weak">{{ t.tag }}</p>
      </component>
    </div>

    <p class="mt-6 text-[13px] text-ink-weak">
      共 {{ TEMPLATES.length }} 套在路线图上 · 全部免费，不锁导出。
    </p>
  </section>
</template>
