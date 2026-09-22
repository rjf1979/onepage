<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { FooterLink } from "@/types/nav";

defineProps<{ title: string; links: FooterLink[] }>();
</script>

<template>
  <div>
    <p class="text-[13.5px] font-semibold tracking-[1.6px] text-[#f7f3eb]">
      {{ title }}
    </p>
    <ul class="mt-3.5 space-y-3.5">
      <li v-for="l in links" :key="l.label" class="flex items-center gap-2">
        <RouterLink
          v-if="l.to && !l.soon"
          :to="l.to"
          class="text-[14.5px] text-[#8b8271] transition hover:text-[#cfc6b6]"
        >
          {{ l.label }}
        </RouterLink>
        <template v-else>
          <span class="text-[14.5px] text-[#6b6355]">{{ l.label }}</span>
          <span
            class="rounded-full bg-[#2c2620] px-2 py-0.5 text-[11px] font-medium text-[#8b8271]"
          >
            即将上线
          </span>
        </template>
      </li>
    </ul>
  </div>
</template>
