<script setup lang="ts">
/**
 * 单行输入 —— 设计稿里有两种形态：
 *   plain：白底描边，用于「基本信息」的三个通栏 pill
 *   cream：米底描边，用于经历/教育卡片内部的字段
 * 卡片内字段按设计稿不带行内标签，靠 placeholder 说明含义。
 */
withDefaults(
  defineProps<{
    label?: string;
    modelValue: string;
    placeholder?: string;
    /** 标签列宽：基本信息的四字标签（求职意向/联系方式）需要更宽的一列 */
    wideLabel?: boolean;
    tone?: "plain" | "cream";
  }>(),
  { tone: "plain" }
);

const emit = defineEmits<{ "update:modelValue": [string] }>();
</script>

<template>
  <label
    class="flex min-w-0 flex-1 items-center gap-2.5 rounded-[10px] border px-3.5 py-2.5 transition focus-within:border-vermilion"
    :class="tone === 'cream' ? 'border-[#ece5d9] bg-[#fbf7ef]' : 'border-line bg-white'"
  >
    <span
      v-if="label"
      class="shrink-0 text-[12.5px] text-ink-weak"
      :class="wideLabel ? 'w-[62px]' : 'w-[34px]'"
    >
      {{ label }}
    </span>
    <input
      :value="modelValue"
      :placeholder="placeholder"
      class="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-[#c3baaa]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>
