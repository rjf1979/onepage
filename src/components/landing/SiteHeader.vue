<script setup lang="ts">
import { ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import AppIcon from "@/components/AppIcon.vue";

const open = ref(false);
const route = useRoute();

/**
 * 导航项与设计稿一致：模板库 / ATS 自检 / 写作范文 / 常见问题。
 * 后两项的内容页还没做，按设计稿保持同样的字号与位置，
 * 但渲染成不可点（hover 提示「即将上线」），不做 href="#" 的假链接。
 * 设计稿里的「登录」按钮没有实现：本项目定位是免注册，
 * 且没有账号后端，加了就是自相矛盾。
 */
const navs = [
  { label: "模板库", to: "/", hash: "#templates", ready: true },
  { label: "ATS 自检", to: "/ats", hash: "", ready: true },
  { label: "写作范文", to: "/", hash: "", ready: false },
  { label: "常见问题", to: "/", hash: "", ready: false },
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
      <template v-for="n in navs" :key="n.label">
        <RouterLink
          v-if="n.ready"
          :to="go(n.to, n.hash)"
          class="text-[15px] font-medium text-[#4a4238] transition hover:text-vermilion"
        >
          {{ n.label }}
        </RouterLink>
        <span
          v-else
          class="cursor-not-allowed text-[15px] font-medium text-[#a89c88]"
          title="即将上线"
        >
          {{ n.label }}
        </span>
      </template>
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
      <template v-for="n in navs" :key="n.label">
        <RouterLink
          v-if="n.ready"
          :to="go(n.to, n.hash)"
          class="block py-2.5 text-[15px] font-medium text-[#4a4238]"
        >
          {{ n.label }}
        </RouterLink>
        <span
          v-else
          class="flex items-center gap-2 py-2.5 text-[15px] font-medium text-[#a89c88]"
        >
          {{ n.label }}
          <span class="rounded-full bg-[#f0e9db] px-2 py-0.5 text-[11px] text-[#8a8175]">
            即将上线
          </span>
        </span>
      </template>
    </div>
  </header>
</template>
