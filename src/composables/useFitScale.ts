import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

/**
 * 让 A4 纸（794px 宽）按容器宽度等比缩放。
 * 编辑器预览、落地页 Hero、ATS 缩略共用。
 */
export function useFitScale(options?: {
  a4WidthPx?: number;
  paddingPx?: number;
  min?: number;
  max?: number;
}): { hostRef: Ref<HTMLElement | null>; fit: Ref<number> } {
  const { a4WidthPx = 793.7, paddingPx = 48, min = 0.3, max = 1 } = options ?? {};
  const hostRef = ref<HTMLElement | null>(null);
  const fit = ref(max);
  let observer: ResizeObserver | undefined;

  function compute() {
    const el = hostRef.value;
    if (!el) return;
    const available = el.clientWidth - paddingPx;
    if (available <= 0) return;
    fit.value = Math.max(min, Math.min(max, available / a4WidthPx));
  }

  onMounted(() => {
    compute();
    if (hostRef.value && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(compute);
      observer.observe(hostRef.value);
    }
  });

  onBeforeUnmount(() => observer?.disconnect());

  return { hostRef, fit };
}
