<script setup lang="ts">
import { ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import AppIcon from "@/components/AppIcon.vue";

const open = ref(false);
const route = useRoute();

const navs = [
  { label: "模板库", to: "/", hash: "#templates" },
  { label: "ATS 自检", to: "/ats", hash: "" },
  { label: "为什么是一页", to: "/", hash: "#why" },
];

// 路由变化后收起移动端菜单
watch(() => route.fullPath, () => (open.value = false));

const go = (to: string, hash: string) => ({ path: to, hash: hash || undefined });
</script>

<template>
  <header
    class="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-16"
  >
    <RouterLink to="/" class="flex items-center gap-2.5">
      <span class="font-serif-cn text-[24px] font-bold text-ink lg:text-[26px]">
        一页
      </span>
      <span class="hidden h-4.5 w-px bg-[#ddd5c7] sm:block" />
      <span
        class="hidden text-[12px] font-semibold tracking-[2px] text-[#a89c88] sm:block"
      >
        ONEPAGE
      </span>
    </RouterLink>

    <!-- 桌面导航 -->
    <nav class="hidden items-center gap-9 lg:flex">
      <RouterLink
        v-for="n in navs"
        :key="n.label"
        :to="go(n.to, n.hash)"
        class="text-[15px] font-medium text-[#4a4238] transition hover:text-vermilion"
      >
        {{ n.label }}
      </RouterLink>
    </nav>

    <div class="flex items-center gap-2">
      <RouterLink
        to="/editor"
        class="rounded-full bg-vermilion px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#c3381a] lg:px-6 lg:text-[15px]"
      >
        免费开始
      </RouterLink>
      <button
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
        :aria-expanded="open"
        aria-label="展开导航"
        @click="open = !open"
      >
        <AppIcon :name="open ? 'close' : 'more'" class="h-4.5 w-4.5" />
      </button>
    </div>

    <!-- 移动端下拉 -->
    <div
      v-if="open"
      class="absolute inset-x-0 top-[68px] z-40 border-b border-line bg-paper px-5 py-3 lg:hidden"
    >
      <RouterLink
        v-for="n in navs"
        :key="n.label"
        :to="go(n.to, n.hash)"
        class="block py-2.5 text-[15px] font-medium text-[#4a4238]"
      >
        {{ n.label }}
      </RouterLink>
    </div>
  </header>
</template>
