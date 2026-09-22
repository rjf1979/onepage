<script setup lang="ts">
import SiteHeader from "@/components/landing/SiteHeader.vue";
import SiteFooter from "@/components/landing/SiteFooter.vue";
import HeroSection from "@/components/landing/HeroSection.vue";
import TemplateWall from "@/components/landing/TemplateWall.vue";
import AppIcon from "@/components/AppIcon.vue";
import { RouterLink } from "vue-router";

const values = [
  {
    icon: "download" as const,
    bg: "bg-[#fbede7]",
    color: "text-vermilion",
    title: "导出不设限",
    desc: "PDF 免费下载，不限次数、不加水印。不注册、不买会员，也能把简历完整带走。",
    tag: "别人截图都收费，我们全给你",
    tagColor: "text-vermilion-deep",
  },
  {
    icon: "scan" as const,
    bg: "bg-success-soft",
    color: "text-success",
    title: "ATS 友好排版",
    desc: "自动避开分栏、文本框、进度条这些解析陷阱，机器能读全你的每一段经历。",
    tag: "投大厂、投外企都稳",
    tagColor: "text-success",
  },
  {
    icon: "lock" as const,
    bg: "bg-[#efe9dc]",
    color: "text-[#5b4c33]",
    title: "隐私在你手里",
    desc: "数据默认只存在你的浏览器里，不上传服务器，手机号不会被拿去推销课程。",
    tag: "随时一键导出 JSON 备份",
    tagColor: "text-[#5b4c33]",
  },
];

const steps = [
  {
    n: "01",
    t: "选一个模板",
    d: "ATS 友好模板全部免费。按行业挑，不用纠结版式。",
  },
  {
    n: "02",
    t: "填空式写经历",
    d: "把「负责用户增长」写成「搭建 A/B 体系，DAU 提升 23%」。",
  },
  {
    n: "03",
    t: "自检然后导出",
    d: "跑一遍 ATS 体检，看到全绿再下载 PDF。不带隐患投递。",
  },
];

const companies = ["TECHNOVA", "云海科技", "BridgeLab", "NEXUS HR", "明远咨询"];
</script>

<template>
  <div class="relative min-h-screen bg-paper">
    <SiteHeader />

    <HeroSection />

    <!-- ================= 信任条 ================= -->
    <div
      class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-[#e6dfd3] px-5 py-6 sm:px-8 lg:justify-between lg:px-16 lg:py-7.5"
    >
      <span class="text-[12.5px] font-medium tracking-[1px] text-ink-weak lg:text-[13px]">
        候选人已入职
      </span>
      <div class="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 lg:gap-11">
        <span
          v-for="name in companies"
          :key="name"
          class="text-[13px] font-bold tracking-[1.6px] text-[#b0a695] lg:text-[15px]"
        >
          {{ name }}
        </span>
      </div>
    </div>

    <!-- ================= 三大价值 ================= -->
    <section id="why" class="px-5 py-16 sm:px-8 lg:px-16 lg:py-[100px]">
      <div class="mb-10 lg:mb-14">
        <p class="text-[13px] font-semibold tracking-[3px] text-vermilion">
          为什么是一页
        </p>
        <h2
          class="font-serif-cn mt-4 text-[30px] leading-[42px] font-bold text-ink lg:text-[44px] lg:leading-[58px]"
        >
          别的网站免费到一半，
          <br class="hidden sm:block" />
          我们免费到你拿到 Offer
        </h2>
        <p
          class="mt-4 max-w-[720px] text-[15.5px] leading-[28px] text-ink-soft lg:text-[17px] lg:leading-[30px]"
        >
          不用注册、不卖会员、导出不设次数。我们只做一件事：把你写下来的经历，变成
          HR 和机器都读得懂的一页简历。
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div
          v-for="v in values"
          :key="v.title"
          class="rounded-[20px] border border-[#ede6d9] bg-white p-6 shadow-[0_10px_30px_-6px_rgba(23,21,15,0.06)] lg:p-7"
        >
          <span
            class="mb-4 flex h-[46px] w-[46px] items-center justify-center rounded-[14px]"
            :class="v.bg"
          >
            <AppIcon :name="v.icon" :class="['h-5 w-5', v.color]" />
          </span>
          <h3 class="font-serif-cn text-[21px] font-bold text-ink lg:text-[23px]">
            {{ v.title }}
          </h3>
          <p class="mt-3.5 text-[14.5px] leading-[26px] text-ink-soft lg:text-[15px]">
            {{ v.desc }}
          </p>
          <p class="mt-4 text-[13px] font-semibold" :class="v.tagColor">
            {{ v.tag }}
          </p>
        </div>
      </div>
    </section>

    <!-- ================= 三步流程 ================= -->
    <section class="bg-white px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
      <div class="mb-10 lg:mb-13">
        <p class="text-[13px] font-semibold tracking-[3px] text-vermilion">
          怎么用
        </p>
        <h2
          class="font-serif-cn mt-3.5 text-[28px] leading-[40px] font-bold text-ink lg:text-[40px] lg:leading-[54px]"
        >
          三步写完，五分钟交付
        </h2>
      </div>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div
          v-for="s in steps"
          :key="s.n"
          class="rounded-[20px] border border-[#ede6d9] bg-paper p-6 lg:p-7"
        >
          <span
            class="font-[family-name:Georgia,serif] text-[32px] font-bold text-vermilion lg:text-[36px]"
          >
            {{ s.n }}
          </span>
          <h3 class="font-serif-cn mt-2.5 text-[19px] font-bold text-ink lg:text-[20px]">
            {{ s.t }}
          </h3>
          <p class="mt-2.5 text-[14px] leading-[25px] text-ink-soft lg:text-[14.5px]">
            {{ s.d }}
          </p>
        </div>
      </div>
    </section>

    <!-- ================= 模板墙 ================= -->
    <TemplateWall />

    <!-- ================= 最终 CTA ================= -->
    <section
      class="flex flex-col items-center bg-ink px-5 pt-16 pb-18 text-center sm:px-8 lg:px-16 lg:pt-[104px] lg:pb-[112px]"
    >
      <p class="text-[13px] font-semibold tracking-[3.4px] text-[#e8835f]">
        开始写
      </p>
      <h2
        class="font-serif-cn mt-6 text-[30px] leading-[44px] font-bold text-[#f7f3eb] lg:text-[46px] lg:leading-[62px]"
      >
        五分钟后，你就有一份能投出去的简历
      </h2>
      <p
        class="mt-6 max-w-[640px] text-[15.5px] leading-[28px] text-[#a79e90] lg:text-[17.5px] lg:leading-[30px]"
      >
        不用注册，不留手机号，也不用先填一堆资料。直接开始写，写完就下载。
      </p>
      <RouterLink
        to="/editor"
        class="mt-8 flex items-center gap-2.5 rounded-[14px] bg-vermilion px-7 py-3.5 text-[16.5px] font-semibold text-white shadow-[0_10px_32px_-6px_rgba(214,64,31,0.36)] transition hover:bg-[#c3381a] lg:px-9.5 lg:py-4.75 lg:text-[18px]"
      >
        免费开始写简历
        <AppIcon name="arrow-right" class="h-5 w-5" />
      </RouterLink>
      <p class="mt-6 text-[13.5px] font-medium tracking-[0.6px] text-[#6f6759] lg:text-[14px]">
        完全免费 · 无需信用卡 · 无需注册
      </p>
    </section>

    <SiteFooter />
  </div>
</template>
