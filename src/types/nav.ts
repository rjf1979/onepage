/** 页脚导航的数据形状（组件与视图共用，避免两边各写一份） */

export interface FooterLink {
  label: string;
  /** 站内路由；页面还没做的条目不要给 href，标 soon */
  to?: string;
  /** 尚未上线：渲染成不可点的灰字，不做假链接 */
  soon?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}
