<script setup lang="ts">
/**
 * ATS 报告右侧的示意：抽象简历骨架 + 绿色虚线框。
 * 用虚线框而不是真实内容，是为了说清一件事 ——
 * 机器读到的是「区块」，而不是排版。
 */

const blocks = [
  { label: "基本信息", lines: ["name", "meta"] },
  { label: "工作经历", lines: ["title", "row", "row", "row"] },
  { label: "教育背景", lines: ["title", "row"] },
  { label: "技能关键词", lines: ["row"] },
];

/** 区块内每行的宽度交替，模拟真实排版的不规则行宽（字符串形式，StyleValue 直接接受） */
function rowStyle(i: number): string {
  return i % 2 === 0 ? "width: 92%" : "width: 76%";
}
</script>

<template>
  <div>
    <div class="relative w-full max-w-[420px] rounded-[6px] bg-white p-6 shadow-[0_18px_44px_-10px_rgba(23,21,15,0.16)]">
      <!-- 头部区块 -->
      <div class="rounded-[6px] border-[1.5px] border-dashed border-success/70 bg-success-soft/40 p-3">
        <div class="flex items-start justify-between">
          <div class="space-y-2">
            <div class="h-3 w-[112px] rounded-[4px] bg-ink" />
            <div class="h-1.5 w-[150px] rounded-[3px] bg-[#c9c0b1]" />
            <div class="h-1.5 w-[128px] rounded-[3px] bg-[#ded6c8]" />
          </div>
          <span
            class="rounded-full bg-success px-2 py-0.5 text-[10px] font-semibold text-white"
          >
            基本信息
          </span>
        </div>
      </div>

      <div class="my-3 h-[1.5px] w-[46px] bg-vermilion" />

      <!-- 正文区块 -->
      <div class="space-y-3">
        <div
          v-for="b in blocks.slice(1)"
          :key="b.label"
          class="rounded-[6px] border-[1.5px] border-dashed border-success/70 bg-success-soft/40 p-3"
        >
          <div class="flex items-start justify-between">
            <div class="space-y-2">
              <div class="h-2 w-[84px] rounded-[4px] bg-ink" />
              <div
                v-for="(_, i) in b.lines.slice(1)"
                :key="i"
                class="h-1.5 rounded-[3px] bg-[#ded6c8]"
                :style="rowStyle(i)"
              />
            </div>
            <span
              class="rounded-full bg-success px-2 py-0.5 text-[10px] font-semibold text-white"
            >
              {{ b.label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <p class="mt-4 max-w-[420px] text-[13px] leading-[22px] text-ink-weak">
      绿色虚线 = 机器能稳定读取的内容块。单栏纯文本结构下，这四个区块会按顺序被完整解析，不会漏读也不会串行。
    </p>
  </div>
</template>
