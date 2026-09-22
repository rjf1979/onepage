<script setup lang="ts">
import { computed } from "vue";
import type { CSSProperties } from "vue";
import { RouterLink } from "vue-router";
import ResumePaper from "@/components/ResumePaper.vue";
import AppIcon from "@/components/AppIcon.vue";
import { demoResume } from "@/types/resume";
import { analyzeResume } from "@/lib/ats";
import { useFitScale } from "@/composables/useFitScale";

const A4_W = 793.7;
const A4_H = 1122.5;

/** Hero 里的简历缩略：桌面按设计稿 0.52，窄屏自动再缩 */
const { hostRef, fit } = useFitScale({ max: 0.52, paddingPx: 0 });
const scale = computed(() => fit.value);
const paperW = computed(() => Math.round(A4_W * scale.value));
const paperH = computed(() => Math.round(A4_H * scale.value));

const demo = demoResume();

/** 徽章分数取自真实分析结果，不写死 —— 否则与 ATS 页展示的分数会对不上 */
const demoScore = analyzeResume(demo).score;

/** 还没上线，先把能兑现的三条摆出来；用户量数字等有真实数据再加 */
const proofPoints = ["免注册，打开即写", "导出不限次数", "资料只存本地浏览器"];

/** 右栏宿主高度 = 缩放后纸张高度 + 上下留白 */
const heroBoxStyle = computed<CSSProperties>(
  () => ({ height: `${paperH.value + 20}px` }),
);

/** 真实简历预览框：按缩放后的像素尺寸裁切 */
const previewBoxStyle = computed<CSSProperties>(
  () => ({ width: `${paperW.value}px`, height: `${paperH.value}px`, overflow: "hidden" }),
);

/** 内层套用 transform 缩放，原点在左上 */
const previewInnerStyle = computed<CSSProperties>(
  () => ({ transform: `scale(${scale.value})`, transformOrigin: "top left" }),
);
</script>

<template>
  <section
    class="relative overflow-hidden px-5 pt-10 pb-16 sm:px-8 lg:px-16 lg:pt-16 lg:pb-24"
  >
    <div class="flex flex-col items-center gap-10 lg:flex-row lg:gap-14">
      <!-- ---------- 左：文案 ---------- -->
      <div class="min-w-0 w-full lg:flex-1">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-vermilion-soft px-3.5 py-1.5"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-vermilion" />
          <span class="text-[12.5px] font-semibold tracking-[0.3px] text-[#a03a19] lg:text-[13.5px]">
            完全免费 · 不需注册 · 不限导出次数
          </span>
        </span>

        <h1
          class="font-serif-cn mt-6 text-[38px] leading-[1.18] font-bold text-ink sm:text-[48px] lg:mt-6.5 lg:text-[60px] lg:leading-[74px]"
        >
          写好一页简历，
          <span class="flex items-center">
            拿到想要的
            <span
              class="ml-2 font-[family-name:Georgia,serif] text-[42px] font-bold italic text-vermilion sm:text-[52px] lg:text-[62px]"
            >
              Offer
            </span>
          </span>
        </h1>

        <p
          class="mt-5 max-w-[600px] text-[15.5px] leading-[28px] text-ink-soft lg:mt-6.5 lg:text-[17.5px] lg:leading-[29px]"
        >
          不用注册账号，导出不设次数。自动按 ATS
          规范排版，让机器读得懂、HR 看得清。
        </p>

        <div class="mt-6 flex flex-wrap items-center gap-3.5">
          <RouterLink
            to="/editor"
            class="flex items-center gap-2.5 rounded-xl bg-vermilion px-6 py-3.5 text-[15.5px] font-semibold text-white shadow-[0_8px_20px_-4px_rgba(214,64,31,0.32)] transition hover:bg-[#c3381a] lg:px-8 lg:py-4.5 lg:text-[16.5px]"
          >
            立即免费写简历
            <AppIcon name="arrow-right" class="h-4.5 w-4.5" />
          </RouterLink>
          <RouterLink
            to="/"
            :hash="'#templates'"
            class="rounded-xl border-[1.5px] border-[#dcd4c6] px-6 py-3 text-[15px] font-medium text-[#4a4238] transition hover:border-[#c8bda9] lg:px-7 lg:py-4 lg:text-[16px]"
          >
            先看看模板
          </RouterLink>
        </div>

        <div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span
            v-for="p in proofPoints"
            :key="p"
            class="flex items-center gap-1.5 text-[13px] font-medium text-ink-weak lg:text-[14px]"
          >
            <AppIcon name="check-circle" class="h-4 w-4 shrink-0" />
            {{ p }}
          </span>
        </div>
      </div>

      <!-- ---------- 右：产品视觉 ---------- -->
      <div
        ref="hostRef"
        class="relative w-full shrink-0 lg:w-[473px]"
        :style="heroBoxStyle"
      >
        <!-- 装饰纸（窄屏不显示，避免挤压） -->
        <div
          class="absolute top-[9%] left-[44%] hidden h-[48%] w-[46%] rounded-lg bg-deco lg:block"
        >
          <div
            class="absolute top-[70px] left-[44px] h-2.5 w-[76%] rounded-[5px] bg-[#e1d8c6]"
          />
          <div
            class="absolute top-[96px] left-[44px] h-2.5 w-[56%] rounded-[5px] bg-[#e1d8c6]"
          />
          <!-- 朱红印章 -->
          <div
            class="absolute bottom-[46px] left-[26%] h-[68px] w-[68px] rounded-[6px] bg-vermilion/90"
          />
        </div>

        <!-- 真实简历预览 -->
        <div class="absolute top-4 left-1/2 -translate-x-1/2 lg:left-5 lg:translate-x-0">
          <div :style="previewBoxStyle">
            <div :style="previewInnerStyle">
              <ResumePaper
                :data="demo"
                class="shadow-[0_24px_56px_-12px_rgba(23,21,15,0.16)]"
              />
            </div>
          </div>
        </div>

        <!-- ATS 徽章浮层 -->
        <div
          class="absolute bottom-[10%] left-0 hidden items-center gap-3 rounded-2xl bg-white px-4.5 py-3.5 shadow-[0_14px_36px_-8px_rgba(23,21,15,0.14)] sm:flex"
        >
          <AppIcon name="check-circle" class="h-8 w-8 shrink-0 lg:h-8.5 lg:w-8.5" />
          <div>
            <p class="text-[13px] font-semibold text-ink lg:text-[14px]">
              ATS 解析通过
            </p>
            <p class="mt-0.5 text-[11px] text-[#7c7466] lg:text-[11.5px]">
              {{ demoScore }} 分 · 无解析陷阱
            </p>
          </div>
        </div>

        <!-- 本地量化提醒浮层（能力见 BulletField.vue，纯本地检测，不调任何模型） -->
        <div
          class="absolute top-[42%] right-0 hidden items-center gap-2.5 rounded-xl bg-white px-4 py-3.5 shadow-[0_14px_36px_-8px_rgba(23,21,15,0.14)] sm:flex"
        >
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#fcefe9] text-vermilion"
          >
            <AppIcon name="sparkle" class="h-4 w-4" />
          </span>
          <div>
            <p class="text-[12.5px] font-semibold text-ink lg:text-[13px]">
              描述里缺数字，当场提醒你
            </p>
            <p class="mt-0.5 text-[11px] text-[#7c7466] lg:text-[11.5px]">
              本地检测 · 数据不出浏览器
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
