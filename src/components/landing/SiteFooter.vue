<script setup lang="ts">
import { RouterLink } from "vue-router";
import FooterCol from "./FooterCol.vue";
import type { FooterColumn } from "@/types/nav";

/**
 * 只放真实存在的入口。没做的页面标 soon，渲染成不可点的灰字，
 * 不再出现一堆 href="#" 的假链接。
 */
const cols: FooterColumn[] = [
  {
    title: "产品",
    links: [
      { label: "写简历", to: "/editor" },
      { label: "ATS 自检", to: "/ats" },
      { label: "隐私说明", soon: true },
    ],
  },
  {
    title: "资源",
    links: [
      { label: "经历范文", soon: true },
      { label: "行业关键词", soon: true },
      { label: "求职博客", soon: true },
    ],
  },
  {
    title: "关于",
    links: [
      { label: "关于我们", soon: true },
      { label: "意见反馈", soon: true },
    ],
  },
];
</script>

<template>
  <footer class="bg-ink px-5 pt-12 pb-9 sm:px-8 lg:px-16 lg:pt-16">
    <div class="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
      <div class="max-w-[340px]">
        <RouterLink
          to="/"
          class="font-serif-cn text-[22px] font-bold text-[#f7f3eb]"
        >
          一页 OnePage
        </RouterLink>
        <p class="mt-3 text-[14.5px] leading-[26px] text-[#83786a]">
          免费的在线简历工具，数据只存在你自己的浏览器里。
        </p>
      </div>
      <div class="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:flex lg:gap-19">
        <FooterCol v-for="c in cols" :key="c.title" :title="c.title" :links="c.links" />
      </div>
    </div>

    <div
      class="mt-12 border-t border-[#2c2620] pt-6 lg:mt-14"
    >
      <p class="text-[13px] text-[#6b6355] lg:text-[13.5px]">
        2026 一页 OnePage · 永久免费 · 保留所有权利
      </p>
    </div>
  </footer>
</template>
