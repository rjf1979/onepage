<script setup lang="ts">
defineProps<{
  label: string;
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{ "update:modelValue": [string] }>();
</script>

<template>
  <label
    class="flex min-w-0 flex-1 items-center gap-2.5 rounded-[10px] border border-line bg-white px-3.5 py-2.5 transition focus-within:border-vermilion"
  >
    <span class="w-[34px] shrink-0 text-[12.5px] text-ink-weak">
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
