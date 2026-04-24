export type Locale = "en" | "zh";

export const STORAGE_KEY = "locale";

export const DEFAULT_LOCALE: Locale = "en";

const RESUME_EN =
  "https://bitbw.notion.site/Bowen-Zhang-s-Resume-4a147165710948efa83f23ffd61303ec";

const RESUME_ZH = "https://bitbw.notion.site/2eebad4eb3af4e1997aa53fe61cbcc34";

export type Copy = {
  ariaHome: string;
  navHome: string;
  navAbout: string;
  navContact: string;
  navBlog: string;
  navProjects: string;
  viewResume: string;
  localeEn: string;
  localeZh: string;
  roleBadge: string;
  heroTitleLine1: string;
  heroTitleLine2Prefix: string;
  heroAccent: string;
  /** 使用 `{years}` 占位 */
  homeIntro: string;
  viewGithub: string;
  viewGithubAria: string;
  aboutBadge: string;
  aboutTitle: string;
  aboutLead: string;
  cardCoreTitle: string;
  cardCoreBody: string;
  cardRecentTitle: string;
  cardRecent1: string;
  cardRecent2: string;
  cardRecent3: string;
  cardDrivesTitle: string;
  cardDrivesBody: string;
  cardToolboxTitle: string;
  cardToolboxBody: string;
  contactBadge: string;
  contactTitle: string;
  contactLead: string;
  emailMe: string;
  linkGithub: string;
  linkBlog: string;
  resumeUrl: string;
  projectsBadge: string;
  projectsTitle: string;
  projectsLead: string;
  projectsVisit: string;
  projectsViewAll: string;
  proj1Name: string;
  proj1Desc: string;
  proj2Name: string;
  proj2Desc: string;
  proj3Name: string;
  proj3Desc: string;
  proj4Name: string;
  proj4Desc: string;
  proj5Name: string;
  proj5Desc: string;
};

export const copy: Record<Locale, Copy> = {
  en: {
    ariaHome: "Home",
    navHome: "Home",
    navAbout: "About",
    navContact: "Contact",
    navBlog: "Blog",
    navProjects: "Projects",
    viewResume: "View Resume",
    localeEn: "EN",
    localeZh: "中文",
    roleBadge: "Bowen Zhang · Senior Frontend Engineer",
    heroTitleLine1: "Building the Future",
    heroTitleLine2Prefix: "with",
    heroAccent: "Code&AI",
    homeIntro:
      "I'm Bowen, a frontend engineer with {years}+ years building production apps in React, Vue, and TypeScript. I specialize in data visualization, autonomous driving platforms, and exploring AI-powered tools. Always learning, always shipping.",
    viewGithub: "View GitHub",
    viewGithubAria: "Visit Bowen's GitHub profile",
    aboutBadge: "About Bowen",
    aboutTitle: "Developer, technologist, relentless learner.",
    aboutLead:
      "I craft human-centered interfaces and data-rich dashboards across automotive, mapping, and enterprise products. From CAN bus visualizers to large-scale management platforms, I bridge product vision with performant frontends that teams can scale and maintain.",
    cardCoreTitle: "Core Focus",
    cardCoreBody:
      "TypeScript-first development, design systems, data visualization, and AI-assisted workflows for teams shipping ambitious software.",
    cardRecentTitle: "Recent Highlights",
    cardRecent1: "• Led Li Auto's smart chassis visualization platform",
    cardRecent2:
      "• Governed data Q&A—trusted, conversational answers across complex operational datasets",
    cardRecent3:
      "• Cockpit-grade in-vehicle delivery—real-time context into calm, production-ready experiences",
    cardDrivesTitle: "What Drives Me",
    cardDrivesBody:
      "Curiosity for emerging tech, especially AI. I love transforming complex requirements into experiences that feel effortless.",
    cardToolboxTitle: "Toolbox",
    cardToolboxBody:
      "React, Vue, Next.js, Vite, ECharts, Three.js, Node.js, Electron, Tauri, Capacitor, Ant Design, Quasar, Webpack, Vercel, Python, Android.",
    contactBadge: "Contact",
    contactTitle: "Let's build something meaningful.",
    contactLead:
      "Whether you're exploring partnerships, need help shipping a complex interface, or want to talk about AI-augmented workflows, my inbox is open.",
    emailMe: "Email Me",
    linkGithub: "GitHub",
    linkBlog: "Blog",
    resumeUrl: RESUME_EN,
    projectsBadge: "My Projects",
    projectsTitle: "Things I've built.",
    projectsLead:
      "A selection of personal projects and side experiments — from AI tools to developer utilities and platform UIs.",
    projectsVisit: "Visit Project",
    projectsViewAll: "View all on GitHub",
    proj1Name: "English Reading App",
    proj1Desc:
      "An English reading practice tool designed to improve reading comprehension and vocabulary through curated articles.",
    proj2Name: "AI Chatbox",
    proj2Desc:
      "A Next.js-powered AI chat application with streaming responses, multi-turn conversations, and a clean minimal UI.",
    proj3Name: "Editable Table Demo",
    proj3Desc:
      "An interactive Ant Design Pro editable table component showcasing inline editing, validation, and row operations.",
    proj4Name: "Personal Blog",
    proj4Desc:
      "My personal tech blog covering frontend development, tooling, engineering insights, and side-project write-ups.",
    proj5Name: "Smart Chassis Domain Control UI",
    proj5Desc:
      "A vehicle domain control UI application built for the Fuxi smart driving platform, focusing on real-time data display.",
  },
  zh: {
    ariaHome: "首页",
    navHome: "首页",
    navAbout: "关于",
    navContact: "联系",
    navBlog: "博客",
    navProjects: "项目",
    viewResume: "查看简历",
    localeEn: "EN",
    localeZh: "中文",
    roleBadge: "张博文 · 资深前端工程师",
    heroTitleLine1: "共筑未来",
    heroTitleLine2Prefix: "携手",
    heroAccent: "Code&AI",
    homeIntro:
      "我是博文，一名拥有 {years}+ 年前端经验的工程师，长期使用 React、Vue 与 TypeScript 交付线上产品。我擅长数据可视化、自动驾驶相关平台，以及探索 AI 赋能的研发流程。保持学习，持续交付。",
    viewGithub: "查看 GitHub",
    viewGithubAria: "访问博文的 GitHub 主页",
    aboutBadge: "关于博文",
    aboutTitle: "开发者、技术人、终身学习者。",
    aboutLead:
      "我专注于以人为本的界面与数据密集型仪表盘，覆盖汽车、地图与企业级产品。从 CAN 总线可视化到大型管理平台，我在产品愿景与可扩展、可维护的高性能前端之间搭建桥梁。",
    cardCoreTitle: "核心方向",
    cardCoreBody:
      "以 TypeScript 为先的工程实践、设计系统、数据可视化，以及帮助团队交付复杂软件的 AI 辅助工作流。",
    cardRecentTitle: "近期亮点",
    cardRecent1: "• 负责理想汽车智能底盘可视化平台",
    cardRecent2: "• 合规框架下的智能问数，将复杂数据沉淀为可信、可用的业务洞察",
    cardRecent3: "• 智能座舱与车端交付：实时车况到稳定、可量产的座舱体验",
    cardDrivesTitle: "动力来源",
    cardDrivesBody:
      "对新兴技术（尤其是 AI）的好奇。我喜欢把复杂需求变成用起来毫不费力的体验。",
    cardToolboxTitle: "技术栈",
    cardToolboxBody:
      "React、Vue、Next.js、Vite、ECharts、Three.js、Node.js、Electron、Tauri、Capacitor、Ant Design、Quasar、Webpack、Vercel、Python、Android。",
    contactBadge: "联系",
    contactTitle: "一起做点有意义的事。",
    contactLead:
      "无论你想探讨合作、需要把复杂界面落地上线，还是聊聊 AI 增强的研发流程，都欢迎来信。",
    emailMe: "发邮件",
    linkGithub: "GitHub",
    linkBlog: "博客",
    resumeUrl: RESUME_ZH,
    projectsBadge: "我的项目",
    projectsTitle: "我构建过的作品。",
    projectsLead:
      "个人项目与技术实验精选——涵盖 AI 工具、开发者工具和平台 UI。",
    projectsVisit: "访问项目",
    projectsViewAll: "在 GitHub 查看全部",
    proj1Name: "英语阅读应用",
    proj1Desc:
      "一款英语阅读练习工具，通过精选文章帮助提升阅读理解能力与词汇量。",
    proj2Name: "AI 聊天应用",
    proj2Desc:
      "基于 Next.js 的 AI 对话应用，支持流式响应、多轮对话与简洁 UI。",
    proj3Name: "可编辑表格 Demo",
    proj3Desc:
      "基于 Ant Design Pro 的交互式可编辑表格示例，展示行内编辑、数据校验与行操作。",
    proj4Name: "个人技术博客",
    proj4Desc:
      "分享前端开发、工程实践与技术洞察的个人博客，包含各类项目复盘。",
    proj5Name: "智能底盘域控 UI",
    proj5Desc:
      "用于伏羲智能驾驶平台的车端域控 UI 应用，专注于实时数据展示与交互。",
  },
};

export function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "zh";
}
