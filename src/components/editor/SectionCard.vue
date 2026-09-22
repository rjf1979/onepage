<script setup lang="ts">
import AppIcon from "@/components/AppIcon.vue";

/**
 * 可折叠区块卡 —— 对应设计稿「区块即卡片」的编辑器结构：
 * 卡片标题（工作经历 · 1 段）+ 右侧 chevron；折叠时标题下方显示摘要行
 * （教育背景 · 已填好 / 同济大学 · 工业设计 硕士 · 2017 — 2020）。
 *
 * 设计稿里展开态是 chevron-down、折叠态是 chevron-up，与常见约定相反，此处照设计稿。
 */
const props = defineProps<{
  title: string;
  /** 折叠时显示的摘要；为空则折叠后只剩标题 */
  summary?: string;
  collapsed: boolean;
}>();

const emit = defineEmits<{ "update:collapsed": [boolean] }>();

const toggle = () => emit("update:collapsed", !props.collapsed);
</script>

<template>
  <section
    class="rounded-[16px] border border-[#ece5d9] bg-white px-4 py-4 shadow-[0_8px_24px_-12px_rgba(23,21,15,0.1)] sm:px-5"
  >
    <div class="flex items-start justify-between gap-2">
      <button type="button" class="min-w-0 flex-1 text-left" @click="toggle">
        <h3 class="text-[15.5px] font-bold text-ink">{{ title }}</h3>
        <p
          v-if="collapsed && summary"
          class="mt-1 truncate text-[13.5px] text-ink-weak"
        >
          {{ summary }}
        </p>
      </button>
      <div class="flex shrink-0 items-center gap-1">
        <slot name="action" />
        <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-lg text-ink-weak transition hover:bg-paper"
          :aria-expanded="!collapsed"
          :aria-label="collapsed ? '展开' : '收起'"
          @click="toggle"
        >
          <AppIcon :name="collapsed ? 'chevron-up' : 'chevron-down'" class="h-4.5 w-4.5" />
        </button>
      </div>
    </div>

    <div v-if="!collapsed" class="mt-3.5">
      <slot />
    </div>
  </section>
</template>
