<script setup lang="ts">
import type { ResumeData } from "@/types/resume";

/**
 * 作品集双栏 —— 视觉分栏，DOM 顺序保持线性。
 *
 * 关键约束（M2.5 拍板方案）：**不用表格 / 浮动 / 绝对定位做分栏**，
 * 只用 CSS 栅格摆放两个普通流式区块；且 DOM 里「正文（项目 + 经历）在前、
 * 侧栏（技能 + 教育）在后」，靠 order 把侧栏摆到视觉左侧。
 * 这样机器按文档顺序取文本时，拿到的是一段完整连贯的简历，
 * 而不是被栅格切碎、按行交替的碎片。
 *
 * 代价要说清楚：少数按「坐标」而非「文档顺序」取词的解析器仍可能打乱顺序，
 * 所以 ATS 自检把该模板的排版风险如实标为「中」，不谎称低。
 */
defineProps<{ data: ResumeData }>();

const join = (parts: string[], sep = " · ") =>
  parts.filter((s) => s && s.trim()).join(sep);

const skillList = (data: ResumeData) =>
  data.skills
    .split(/[·、,，/|]/)
    .map((s) => s.trim())
    .filter(Boolean);
</script>

<template>
  <div class="resume-pad">
    <!-- 抬头：左姓名右联系方式，横跨两栏 -->
    <header class="flex items-start justify-between gap-[8mm]">
      <div class="min-w-0">
        <h1 class="font-serif-cn text-[24pt] leading-[1.18] font-bold text-ink">
          {{ data.basics.name || "你的姓名" }}
        </h1>
        <p v-if="data.basics.title" class="mt-[1.5mm] text-[11pt] text-[#4a4238]">
          {{ data.basics.title }}
        </p>
      </div>
      <div
        v-if="join([data.basics.city, data.basics.phone, data.basics.email])"
        class="shrink-0 text-right text-[9.5pt] leading-[1.7] text-[#92897c]"
      >
        <p v-if="data.basics.city">{{ data.basics.city }}</p>
        <p v-if="data.basics.phone">{{ data.basics.phone }}</p>
        <p v-if="data.basics.email">{{ data.basics.email }}</p>
      </div>
    </header>

    <div class="mt-[3mm] h-[1.5px] w-full bg-vermilion" />

    <div class="portfolio-grid mt-[6mm]">
      <!-- DOM 在前：正文。视觉上被 order 推到右栏 -->
      <div class="portfolio-main">
        <section v-if="data.projects.length > 0" class="resume-section">
          <h2 class="text-[11pt] font-bold tracking-[2.2px] text-ink">项目经验</h2>
          <div class="mt-[2.5mm] space-y-[3.5mm]">
            <div v-for="item in data.projects" :key="item.id" class="resume-item">
              <div class="flex items-baseline justify-between gap-4">
                <span class="text-[10.5pt] font-semibold text-[#221f19]">
                  {{ join([item.name, item.role]) }}
                </span>
                <span class="shrink-0 text-[9pt] text-[#a79e90]">
                  {{ join([item.start, item.end], " — ") }}
                </span>
              </div>
              <ul
                v-if="item.bullets.filter((b) => b.trim()).length > 0"
                class="mt-[1.2mm] list-disc space-y-[0.8mm] pl-[5mm] marker:text-[#a79e90]"
              >
                <li
                  v-for="(bullet, i) in item.bullets.filter((b) => b.trim())"
                  :key="i"
                  class="text-[10pt] leading-[1.65] text-[#4a4238]"
                >
                  {{ bullet }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          v-if="data.experience.length > 0"
          class="resume-section"
          :class="data.projects.length > 0 ? 'mt-[6mm]' : ''"
        >
          <h2 class="text-[11pt] font-bold tracking-[2.2px] text-ink">工作经历</h2>
          <div class="mt-[2.5mm] space-y-[3.5mm]">
            <div v-for="item in data.experience" :key="item.id" class="resume-item">
              <div class="flex items-baseline justify-between gap-4">
                <span class="text-[10.5pt] font-semibold text-[#221f19]">
                  {{ join([item.company, item.role]) }}
                </span>
                <span class="shrink-0 text-[9pt] text-[#a79e90]">
                  {{ join([item.start, item.end], " — ") }}
                </span>
              </div>
              <ul
                v-if="item.bullets.filter((b) => b.trim()).length > 0"
                class="mt-[1.2mm] list-disc space-y-[0.8mm] pl-[5mm] marker:text-[#a79e90]"
              >
                <li
                  v-for="(bullet, i) in item.bullets.filter((b) => b.trim())"
                  :key="i"
                  class="text-[10pt] leading-[1.65] text-[#4a4238]"
                >
                  {{ bullet }}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <!-- DOM 在后：侧栏。视觉上 order:1 落在左栏 -->
      <aside class="portfolio-side">
        <section v-if="skillList(data).length > 0" class="resume-section">
          <h2 class="text-[10.5pt] font-bold tracking-[1.8px] text-ink">技能与工具</h2>
          <div class="mt-[2mm] flex flex-wrap gap-[1.5mm]">
            <span
              v-for="s in skillList(data)"
              :key="s"
              class="rounded-[3px] bg-[#f0e9db] px-[2.2mm] py-[0.8mm] text-[9pt] text-[#3a342b]"
            >
              {{ s }}
            </span>
          </div>
        </section>

        <section
          v-if="data.education.length > 0"
          class="resume-section"
          :class="skillList(data).length > 0 ? 'mt-[6mm]' : ''"
        >
          <h2 class="text-[10.5pt] font-bold tracking-[1.8px] text-ink">教育背景</h2>
          <div class="mt-[2mm] space-y-[2.5mm]">
            <div v-for="item in data.education" :key="item.id" class="resume-item">
              <p class="text-[10pt] font-semibold text-[#221f19]">
                {{ item.school }}
              </p>
              <p class="mt-[0.5mm] text-[9.5pt] text-[#4a4238]">
                {{ join([item.major, item.degree]) }}
              </p>
              <p class="mt-[0.5mm] text-[8.5pt] text-[#a79e90]">
                {{ join([item.start, item.end], " — ") }}
              </p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>
