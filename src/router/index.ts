import { createRouter, createWebHistory } from "vue-router";
import LandingView from "@/views/LandingView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "landing",
      component: LandingView,
      meta: { title: "一页 OnePage · 免费在线简历制作 · 导出不设限" },
    },
    {
      path: "/editor",
      name: "editor",
      component: () => import("@/views/EditorView.vue"),
      meta: { title: "写简历 · 一页 OnePage" },
    },
    {
      path: "/ats",
      name: "ats",
      component: () => import("@/views/AtsView.vue"),
      meta: { title: "ATS 自检报告 · 一页 OnePage" },
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0 };
  },
});

router.afterEach((to) => {
  const title = (to.meta.title as string | undefined) ?? "一页 OnePage";
  document.title = title;
});

export default router;
