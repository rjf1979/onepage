<script setup lang="ts">
import { computed } from "vue";
import AppIcon from "@/components/AppIcon.vue";

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ "update:modelValue": [string] }>();

/** 是否含量化信号 —— 数字是经历说服力的分水岭 */
const quantified = computed(() =>
  props.modelValue
    .split("\n")
    .filter((b) => b.trim())
    .some((b) => /\d/.test(b))
);
</script>

<template>
  <div>
    <div class="mb-1.5 flex flex-wrap items-center justify-between gap-1">
      <span class="text-[12px] text-ink-weak sm:text-[12.5px]">
        工作内容 · 一行一条，会原样进入简历
      </span>
      <span
        v-if="quantified"
        class="flex items-center gap-1.5 text-[12px] font-semibold text-success"
      >
        <AppIcon name="check-circle" class="h-4 w-4" />
        含量化数据
      </span>
      <span
        v-else
        class="flex items-center gap-1.5 text-[12px] font-semibold text-vermilion-deep"
      >
        <AppIcon name="sparkle" class="h-3.5 w-3.5" />
        建议加数字：提升幅度 / 体量 / 周期
      </span>
    </div>
    <textarea
      :value="modelValue"
      rows="4"
      placeholder="从 0 搭建 A/B 实验体系，支撑 12 条业务线的增长实验&#10;主导新用户引导改版，次周留存率 41% 提升至 52%"
      class="w-full resize-none rounded-[11px] border border-line bg-[#fbf7ef] px-3.5 py-3 text-[13.5px] leading-6 text-[#3a342b] outline-none transition focus:border-vermilion"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </div>
</template>
