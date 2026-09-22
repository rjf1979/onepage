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
    <p class="mb-1.5 text-[12px] text-ink-weak sm:text-[12.5px]">
      工作内容 · 一行一条，会原样进入简历
    </p>
    <textarea
      :value="modelValue"
      rows="4"
      placeholder="从 0 搭建 A/B 实验体系，支撑 12 条业务线的增长实验&#10;主导新用户引导改版，次周留存率 41% 提升至 52%"
      class="w-full resize-none rounded-[11px] border border-[#ece5d9] bg-[#fbf7ef] px-3.5 py-3 text-[13.5px] leading-6 text-[#3a342b] outline-none transition focus:border-vermilion"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />

    <!-- 提示 pill 按设计稿放在文本域下方。文案只写代码真实具备的能力，不写「已按 STAR 改写」 -->
    <p
      v-if="quantified"
      class="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1.5 text-[12.5px] font-semibold text-success"
    >
      <AppIcon name="sparkle" class="h-3.5 w-3.5" />
      已含量化数据
    </p>
    <p
      v-else
      class="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-vermilion-soft px-3 py-1.5 text-[12.5px] font-semibold text-vermilion-deep"
    >
      <AppIcon name="sparkle" class="h-3.5 w-3.5" />
      建议加数字：提升幅度 / 体量 / 周期
    </p>
  </div>
</template>
