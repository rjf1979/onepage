<script setup lang="ts">
defineProps<{ title: string; hint?: string }>();
</script>

<template>
  <section>
    <div class="mb-3.5 flex items-center justify-between gap-2">
      <div class="min-w-0">
        <h3 class="text-[15px] font-bold text-ink sm:text-[15.5px]">
          {{ title }}
        </h3>
        <p v-if="hint" class="mt-0.5 text-[12px] text-ink-weak">{{ hint }}</p>
      </div>
      <slot name="action" />
    </div>
    <div class="space-y-2.5">
      <slot />
    </div>
  </section>
</template>
