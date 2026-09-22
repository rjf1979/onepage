<script setup lang="ts">
/** 全站图标：一套 20×20 的线性图标，避免为一个小图标引入整个图标库 */

type IconName =
  | "arrow-right"
  | "arrow-left"
  | "check"
  | "check-circle"
  | "warn-circle"
  | "chevron-down"
  | "chevron-up"
  | "sparkle"
  | "download"
  | "lock"
  | "scan"
  | "plus"
  | "trash"
  | "minus"
  | "close"
  | "more"
  | "eye";

interface IconDef {
  stroke?: string[];
  solid?: string[];
  badge?: "check" | "warn";
}

const ICONS: Record<IconName, IconDef> = {
  "arrow-right": { stroke: ["M3.5 10h13M11.5 5l5 5-5 5"] },
  "arrow-left": { stroke: ["M16.5 10h-13M8.5 5l-5 5 5 5"] },
  check: { stroke: ["M4.5 10.5l3.5 3.5 7.5-8"] },
  "check-circle": { badge: "check" },
  "warn-circle": { badge: "warn" },
  "chevron-down": { stroke: ["M5.5 8l4.5 4.5L14.5 8"] },
  "chevron-up": { stroke: ["M5.5 12l4.5-4.5 4.5 4.5"] },
  sparkle: {
    solid: ["M10 1.6l2.3 5.9 5.9 2.3-5.9 2.3-2.3 5.9-2.3-5.9L1.8 9.8l5.9-2.3z"],
  },
  download: {
    stroke: [
      "M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5",
      "M4 14.5v1.5a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5v-1.5",
    ],
  },
  lock: {
    stroke: [
      "M4.5 8.8h11v8H4.5z",
      "M7.2 8.8V6.6a2.8 2.8 0 015.6 0v2.2",
    ],
  },
  scan: {
    stroke: [
      "M3.5 7V5.2c0-.9.7-1.7 1.7-1.7H7",
      "M16.5 7V5.2c0-.9-.7-1.7-1.7-1.7H13",
      "M3.5 13v1.8c0 .9.7 1.7 1.7 1.7H7",
      "M16.5 13v1.8c0 .9-.7 1.7-1.7 1.7H13",
    ],
  },
  plus: { stroke: ["M10 4v12M4 10h12"] },
  minus: { stroke: ["M4 10h12"] },
  trash: {
    stroke: [
      "M4 6h12M8 6V4.6c0-.3.3-.6.6-.6h2.8c.3 0 .6.3.6.6V6",
      "M5.6 6l.6 9.4c0 .6.5 1.1 1.1 1.1h5.4c.6 0 1.1-.5 1.1-1.1L14.4 6",
    ],
  },
  close: { stroke: ["M5 5l10 10M15 5L5 15"] },
  more: {
    solid: [
      "M4.5 10a1.4 1.4 0 100-2.8 1.4 1.4 0 000 2.8zM10 10a1.4 1.4 0 100-2.8 1.4 1.4 0 000 2.8zM15.5 10a1.4 1.4 0 100-2.8 1.4 1.4 0 000 2.8z",
    ],
  },
  eye: {
    stroke: ["M2 10s3-4.5 8-4.5S18 10 18 10s-3 4.5-8 4.5S2 10 2 10z"],
  },
};

const props = withDefaults(
  defineProps<{ name: IconName; size?: number | string }>(),
  { size: 20 }
);

const def = ICONS[props.name];
</script>

<template>
  <svg
    viewBox="0 0 20 20"
    :width="size"
    :height="size"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <template v-if="def.badge === 'check'">
      <circle cx="10" cy="10" r="10" fill="#1F6B4A" />
      <path
        d="M6 10.3l2.7 2.7L14 7.6"
        stroke="#fff"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
    <template v-else-if="def.badge === 'warn'">
      <circle cx="10" cy="10" r="10" fill="#D9A13B" />
      <path
        d="M10 5.2v5.4"
        stroke="#fff"
        stroke-width="1.7"
        stroke-linecap="round"
      />
      <circle cx="10" cy="14.4" r="1" fill="#fff" />
    </template>
    <template v-else-if="def.solid">
      <path v-for="(d, i) in def.solid" :key="i" :d="d" fill="currentColor" />
    </template>
    <template v-else>
      <path
        v-for="(d, i) in def.stroke ?? []"
        :key="i"
        :d="d"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
  </svg>
</template>
