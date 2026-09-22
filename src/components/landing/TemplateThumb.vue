<script setup lang="ts">
/**
 * 模板缩略图骨架 —— 四种版式各有各的骨架，
 * 让「选模板」这一步真的能看出差别，而不是四张一样的占位条。
 * variant 类型与元数据同源，见 types/template.ts。
 */
import type { TemplateId } from "@/types/template";

defineProps<{ variant: TemplateId }>();

const line = "rounded-[3px] bg-[#ded6c8]";
const soft = "rounded-[3px] bg-[#c9c0b1]";
const head = "rounded-[4px] bg-ink";
</script>

<template>
  <div class="absolute inset-x-7 top-7">
    <!-- 经典单栏 -->
    <div v-if="variant === 'classic'" class="space-y-2.5">
      <div :class="[head, 'h-3.5 w-[108px]']" />
      <div :class="[soft, 'h-1.5 w-[160px]']" />
      <div class="mt-3 h-[2.5px] w-[232px] rounded-[1.25px] bg-vermilion" />
      <div :class="[head, 'h-2 w-[66px]']" />
      <div :class="[soft, 'h-1.5 w-[140px]']" />
      <div :class="[line, 'h-1.5 w-[232px]']" />
      <div :class="[line, 'h-1.5 w-[204px]']" />
      <div class="mt-2.5" :class="[head, 'h-2 w-[100px]']" />
      <div :class="[line, 'h-1.5 w-[226px]']" />
      <div :class="[line, 'h-1.5 w-[186px]']" />
      <div class="mt-2.5" :class="[head, 'h-2 w-[78px]']" />
      <div :class="[soft, 'h-1.5 w-[150px]']" />
    </div>

    <!-- 学术 CV：居中抬头 + 密排段落 -->
    <div v-else-if="variant === 'academic'" class="space-y-2">
      <div class="flex flex-col items-center gap-1.5">
        <div :class="[head, 'h-3 w-[132px]']" />
        <div :class="[soft, 'h-1.5 w-[176px]']" />
      </div>
      <div class="mx-auto mt-2 h-[2px] w-[200px] rounded-[1px] bg-[#b9ae9b]" />
      <div class="mt-3 space-y-1.5">
        <div :class="[head, 'h-2 w-[72px]']" />
        <div :class="[line, 'h-1.5 w-full']" />
        <div :class="[line, 'h-1.5 w-[92%]']" />
        <div :class="[line, 'h-1.5 w-[84%]']" />
      </div>
      <div class="mt-2.5 space-y-1.5">
        <div :class="[head, 'h-2 w-[88px]']" />
        <div :class="[line, 'h-1.5 w-[96%]']" />
        <div :class="[line, 'h-1.5 w-[88%]']" />
        <div :class="[line, 'h-1.5 w-[70%]']" />
      </div>
      <div class="mt-2.5 flex gap-1.5">
        <div class="h-6 w-6 rounded-[2px] bg-[#ece5d6]" />
        <div class="h-6 w-6 rounded-[2px] bg-[#ece5d6]" />
        <div class="h-6 w-6 rounded-[2px] bg-[#ece5d6]" />
      </div>
    </div>

    <!-- 作品集双栏：左窄色块 + 右宽内容 -->
    <div v-else-if="variant === 'portfolio'" class="flex gap-3">
      <div class="w-[74px] shrink-0 space-y-2">
        <div class="h-[74px] w-[74px] rounded-[4px] bg-[#17150f]" />
        <div :class="[soft, 'h-1.5 w-[62px]']" />
        <div :class="[line, 'h-1.5 w-[70px]']" />
        <div :class="[line, 'h-1.5 w-[52px]']" />
        <div class="mt-2 h-6 w-[74px] rounded-[3px] bg-[#ece5d6]" />
        <div class="h-6 w-[74px] rounded-[3px] bg-[#ece5d6]" />
      </div>
      <div class="min-w-0 flex-1 space-y-2">
        <div :class="[head, 'h-3 w-[96px]']" />
        <div :class="[soft, 'h-1.5 w-[128px]']" />
        <div class="h-[2px] w-[120px] rounded-[1px] bg-vermilion" />
        <div class="mt-2 grid grid-cols-2 gap-1.5">
          <div class="h-11 rounded-[3px] bg-[#ece5d6]" />
          <div class="h-11 rounded-[3px] bg-[#ece5d6]" />
        </div>
        <div :class="[line, 'h-1.5 w-full']" />
        <div :class="[line, 'h-1.5 w-[88%]']" />
        <div :class="[head, 'h-2 w-[62px]']" />
        <div :class="[line, 'h-1.5 w-[92%]']" />
        <div :class="[line, 'h-1.5 w-[76%]']" />
      </div>
    </div>

    <!-- 应届紧凑：顶部深色抬头条 + 更密的行 -->
    <div v-else class="space-y-1.5">
      <div class="h-9 w-full rounded-[3px] bg-[#17150f]" />
      <div class="mt-2.5 flex items-center justify-between">
        <div :class="[head, 'h-2.5 w-[88px]']" />
        <div :class="[soft, 'h-1.5 w-[52px]']" />
      </div>
      <div class="h-[2px] w-[110px] rounded-[1px] bg-vermilion" />
      <div :class="[line, 'h-1.5 w-full']" />
      <div :class="[line, 'h-1.5 w-[90%]']" />
      <div class="mt-2 flex items-center justify-between">
        <div :class="[head, 'h-2.5 w-[76px]']" />
        <div :class="[soft, 'h-1.5 w-[48px]']" />
      </div>
      <div :class="[line, 'h-1.5 w-[96%]']" />
      <div :class="[line, 'h-1.5 w-[82%]']" />
      <div class="mt-2 flex items-center justify-between">
        <div :class="[head, 'h-2.5 w-[68px]']" />
        <div :class="[soft, 'h-1.5 w-[44px]']" />
      </div>
      <div :class="[line, 'h-1.5 w-[92%]']" />
      <div class="mt-2 flex gap-1.5">
        <div class="h-4 w-[46px] rounded-full bg-[#ece5d6]" />
        <div class="h-4 w-[58px] rounded-full bg-[#ece5d6]" />
        <div class="h-4 w-[40px] rounded-full bg-[#ece5d6]" />
      </div>
    </div>
  </div>
</template>
