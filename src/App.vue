<script setup lang="ts">
import { onMounted } from "vue";
import PrintLayer from "@/components/PrintLayer.vue";
import { useResumeStore } from "@/stores/resume";

const store = useResumeStore();

onMounted(() => store.hydrate());
</script>

<template>
  <RouterView />
  <PrintLayer />
</template>
