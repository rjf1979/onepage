<script setup lang="ts">
import type { ResumeData } from "@/types/resume";

/**
 * 应届紧凑版 —— 深色抬头条 + 更密的行距，把校招/实习/项目塞进一页。
 * 教育背景提到最前（应届生 HR 先看学校）。
 * 技能用胶囊展示：胶囊是行内真实文本，不是文本框，ATS 照样读得到。
 */
const props = defineProps<{ data: ResumeData }>();

const join = (parts: string[], sep = " · ") =>
  parts.filter((s) => s && s.trim()).join(sep);

/** 技能按分隔符拆成胶囊 */
const skillList = () =>
  props.data.skills
    .split(/[·、,，/|]/)
    .map((s) => s.trim())
    .filter(Boolean);
</script>

<template>
  <div>
    <!-- 深色抬头条：贴纸边，故不套 .resume-pad -->
    <header class="resume-bar bg-ink">
      <div class="flex items-baseline justify-between gap-4">
        <h1 class="font-serif-cn text-[21pt] leading-[1.15] font-bold text-[#f7f3eb]">
          {{ data.basics.name || "你的姓名" }}
        </h1>
        <p v-if="data.basics.title" class="text-[10.5pt] font-medium text-[#cfc6b6]">
          {{ data.basics.title }}
        </p>
      </div>
      <p
        v-if="join([data.basics.city, data.basics.phone, data.basics.email])"
        class="mt-[1.5mm] text-[9pt] text-[#9b9284]"
      >
        {{ join([data.basics.city, data.basics.phone, data.basics.email]) }}
      </p>
    </header>

    <div class="resume-pad pt-[5mm]">
      <section v-if="data.education.length > 0" class="resume-section">
        <h2 class="text-[10.5pt] font-bold tracking-[1.8px] text-ink">教育背景</h2>
        <div class="mt-[2mm] space-y-[1.5mm]">
          <div
            v-for="item in data.education"
            :key="item.id"
            class="resume-item flex items-baseline justify-between gap-4"
          >
            <span class="text-[10pt] font-semibold text-[#221f19]">
              {{ join([item.school, item.major, item.degree]) }}
            </span>
            <span class="shrink-0 text-[8.5pt] text-[#a79e90]">
              {{ join([item.start, item.end], " — ") }}
            </span>
          </div>
        </div>
      </section>

      <section v-if="data.experience.length > 0" class="resume-section mt-[4mm]">
        <h2 class="text-[10.5pt] font-bold tracking-[1.8px] text-ink">实习与工作经历</h2>
        <div class="mt-[2mm] space-y-[2.5mm]">
          <div v-for="item in data.experience" :key="item.id" class="resume-item">
            <div class="flex items-baseline justify-between gap-4">
              <span class="text-[10pt] font-semibold text-[#221f19]">
                {{ join([item.company, item.role]) }}
              </span>
              <span class="shrink-0 text-[8.5pt] text-[#a79e90]">
                {{ join([item.start, item.end], " — ") }}
              </span>
            </div>
            <ul
              v-if="item.bullets.filter((b) => b.trim()).length > 0"
              class="mt-[1mm] list-disc space-y-[0.6mm] pl-[4.5mm] marker:text-[#a79e90]"
            >
              <li
                v-for="(bullet, i) in item.bullets.filter((b) => b.trim())"
                :key="i"
                class="text-[9.5pt] leading-[1.6] text-[#4a4238]"
              >
                {{ bullet }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section v-if="data.projects.length > 0" class="resume-section mt-[4mm]">
        <h2 class="text-[10.5pt] font-bold tracking-[1.8px] text-ink">项目经验</h2>
        <div class="mt-[2mm] space-y-[2.5mm]">
          <div v-for="item in data.projects" :key="item.id" class="resume-item">
            <div class="flex items-baseline justify-between gap-4">
              <span class="text-[10pt] font-semibold text-[#221f19]">
                {{ join([item.name, item.role]) }}
              </span>
              <span class="shrink-0 text-[8.5pt] text-[#a79e90]">
                {{ join([item.start, item.end], " — ") }}
              </span>
            </div>
            <ul
              v-if="item.bullets.filter((b) => b.trim()).length > 0"
              class="mt-[1mm] list-disc space-y-[0.6mm] pl-[4.5mm] marker:text-[#a79e90]"
            >
              <li
                v-for="(bullet, i) in item.bullets.filter((b) => b.trim())"
                :key="i"
                class="text-[9.5pt] leading-[1.6] text-[#4a4238]"
              >
                {{ bullet }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section v-if="skillList().length > 0" class="resume-section mt-[4mm]">
        <h2 class="text-[10.5pt] font-bold tracking-[1.8px] text-ink">技能与工具</h2>
        <div class="mt-[2mm] flex flex-wrap gap-[1.5mm]">
          <span
            v-for="s in skillList()"
            :key="s"
            class="rounded-[3px] bg-[#f2ece0] px-[2.5mm] py-[0.8mm] text-[9.5pt] text-[#3a342b]"
          >
            {{ s }}
          </span>
        </div>
      </section>
    </div>
  </div>
</template>
