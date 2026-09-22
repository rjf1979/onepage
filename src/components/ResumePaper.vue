<script setup lang="ts">
import type { ResumeData } from "@/types/resume";

/**
 * A4 简历 —— 编辑器预览、导出 PDF 共用这一个组件。
 * 结构上强制单栏 + 纯文本：这是 ATS 可解析的前提。
 */
const props = defineProps<{ data: ResumeData }>();

const join = (parts: string[], sep = " · ") =>
  parts.filter((s) => s && s.trim()).join(sep);
</script>

<template>
  <article class="resume-paper">
    <header>
      <h1
        class="font-serif-cn text-[22pt] leading-[1.2] font-bold text-ink"
      >
        {{ props.data.basics.name || "你的姓名" }}
      </h1>
      <p
        v-if="props.data.basics.title"
        class="mt-[2mm] text-[11pt] font-medium text-[#4a4238]"
      >
        {{ props.data.basics.title }}
      </p>
      <p
        v-if="join([data.basics.city, data.basics.phone, data.basics.email])"
        class="mt-[1mm] text-[9.5pt] text-[#92897c]"
      >
        {{ join([data.basics.city, data.basics.phone, data.basics.email]) }}
      </p>
    </header>

    <div class="mt-[4mm] h-[1.5px] w-full bg-vermilion" />

    <section
      v-if="data.experience.length > 0"
      class="resume-section mt-[5mm]"
    >
      <h2 class="text-[11pt] font-bold tracking-[2.2px] text-ink">工作经历</h2>
      <div class="mt-[2.5mm] space-y-[3mm]">
        <div v-for="item in data.experience" :key="item.id">
          <div class="flex items-baseline justify-between gap-4">
            <span class="text-[10.5pt] font-semibold text-[#221f19]">
              {{ join([item.company, item.role]) }}
            </span>
            <span
              class="shrink-0 text-[9pt] font-normal tracking-normal text-[#a79e90]"
            >
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

    <section v-if="data.projects.length > 0" class="resume-section mt-[5mm]">
      <h2 class="text-[11pt] font-bold tracking-[2.2px] text-ink">项目经验</h2>
      <div class="mt-[2.5mm] space-y-[3mm]">
        <div v-for="item in data.projects" :key="item.id">
          <div class="flex items-baseline justify-between gap-4">
            <span class="text-[10.5pt] font-semibold text-[#221f19]">
              {{ join([item.name, item.role]) }}
            </span>
            <span
              class="shrink-0 text-[9pt] font-normal tracking-normal text-[#a79e90]"
            >
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

    <section v-if="data.education.length > 0" class="resume-section mt-[5mm]">
      <h2 class="text-[11pt] font-bold tracking-[2.2px] text-ink">教育背景</h2>
      <div class="mt-[2.5mm] space-y-[1.5mm]">
        <div
          v-for="item in data.education"
          :key="item.id"
          class="flex items-baseline justify-between gap-4"
        >
          <span class="text-[10.5pt] font-semibold text-[#221f19]">
            {{ join([item.school, item.major, item.degree]) }}
          </span>
          <span
            class="shrink-0 text-[9pt] font-normal tracking-normal text-[#a79e90]"
          >
            {{ join([item.start, item.end], " — ") }}
          </span>
        </div>
      </div>
    </section>

    <section v-if="data.skills.trim()" class="resume-section mt-[5mm]">
      <h2 class="text-[11pt] font-bold tracking-[2.2px] text-ink">技能与工具</h2>
      <p class="mt-[2mm] text-[10pt] leading-[1.65] text-[#4a4238]">
        {{ data.skills }}
      </p>
    </section>
  </article>
</template>
