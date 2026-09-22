<script setup lang="ts">
import type { ResumeData } from "@/types/resume";

/**
 * 学术 CV —— 居中抬头 + 细分隔线，教育背景在前（学术场景的阅读顺序）。
 * 学术 CV 现实里就是 2–4 页，所以不压缩行距、不做「一页」优化；
 * 分页交给打印样式（@page 提供页边距，条目级 break-inside: avoid 防止拦腰截断）。
 */
defineProps<{ data: ResumeData }>();

const join = (parts: string[], sep = " · ") =>
  parts.filter((s) => s && s.trim()).join(sep);
</script>

<template>
  <div class="resume-pad">
    <header class="text-center">
      <h1 class="font-serif-cn text-[24pt] leading-[1.2] font-bold tracking-[1px] text-ink">
        {{ data.basics.name || "你的姓名" }}
      </h1>
      <p v-if="data.basics.title" class="mt-[1.5mm] text-[11pt] text-[#3a342b]">
        {{ data.basics.title }}
      </p>
      <p
        v-if="join([data.basics.city, data.basics.phone, data.basics.email])"
        class="mt-[1mm] text-[9.5pt] text-[#92897c]"
      >
        {{ join([data.basics.city, data.basics.phone, data.basics.email]) }}
      </p>
    </header>

    <div class="mt-[4mm] h-px w-full bg-[#d9d1c3]" />

    <section v-if="data.education.length > 0" class="resume-section mt-[5mm]">
      <h2
        class="border-b border-[#e3dcd0] pb-[1mm] text-[10.5pt] font-bold tracking-[2px] text-ink"
      >
        教育背景
      </h2>
      <div class="mt-[2.5mm] space-y-[2mm]">
        <div v-for="item in data.education" :key="item.id" class="resume-item">
          <div class="flex items-baseline justify-between gap-4">
            <span class="text-[10.5pt] font-semibold text-[#221f19]">
              {{ join([item.school, [item.major, item.degree].filter(Boolean).join(" ")]) }}
            </span>
            <span class="shrink-0 text-[9pt] text-[#a79e90]">
              {{ join([item.start, item.end], " — ") }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section v-if="data.experience.length > 0" class="resume-section mt-[6mm]">
      <h2
        class="border-b border-[#e3dcd0] pb-[1mm] text-[10.5pt] font-bold tracking-[2px] text-ink"
      >
        工作与研究经历
      </h2>
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
              class="text-[10pt] leading-[1.7] text-[#4a4238]"
            >
              {{ bullet }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="data.projects.length > 0" class="resume-section mt-[6mm]">
      <h2
        class="border-b border-[#e3dcd0] pb-[1mm] text-[10.5pt] font-bold tracking-[2px] text-ink"
      >
        科研与项目
      </h2>
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
              class="text-[10pt] leading-[1.7] text-[#4a4238]"
            >
              {{ bullet }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="data.skills.trim()" class="resume-section mt-[6mm]">
      <h2
        class="border-b border-[#e3dcd0] pb-[1mm] text-[10.5pt] font-bold tracking-[2px] text-ink"
      >
        技能与工具
      </h2>
      <p class="mt-[2mm] text-[10pt] leading-[1.7] text-[#4a4238]">
        {{ data.skills }}
      </p>
    </section>
  </div>
</template>
