"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Menu } from "lucide-react";
import { LineShadowText } from "@/components/line-shadow-text";
import { FlowingWaveOverlay } from "@/components/flowing-wave-overlay";
import { ShimmerButton } from "@/components/shimmer-button";
import { LocaleToggle } from "@/components/locale-toggle";
import { useLocale } from "@/components/locale-provider";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

const GITHUB_PROFILE = "https://github.com/bitbw";
const GITHUB_REPOS = "https://github.com/bitbw?tab=repositories";

const PROJECTS = [
  {
    url: "https://capacitor-hu-previewinfo.bitbw.top/",
    nameKey: "proj6Name",
    descKey: "proj6Desc",
    tech: "Vue 3 · Three.js · ECharts · Capacitor",
  },
  {
    url: "https://fuxi-domain-control-ui-app.bitbw.top/",
    nameKey: "proj5Name",
    descKey: "proj5Desc",
    tech: "React · Vite · TypeScript",
  },
  {
    url: "https://nextaichatbox.bitbw.top/",
    nameKey: "proj2Name",
    descKey: "proj2Desc",
    tech: "Next.js · AI · TypeScript",
  },
  {
    url: "https://english-read.bitbw.top/",
    nameKey: "proj1Name",
    descKey: "proj1Desc",
    tech: "React · TypeScript",
  },
  {
    url: "https://blog.bitbw.top/",
    nameKey: "proj4Name",
    descKey: "proj4Desc",
    tech: "Hexo · Markdown",
  },
  {
    url: "https://antd-pro-editable-table.vercel.app/",
    nameKey: "proj3Name",
    descKey: "proj3Desc",
    tech: "Ant Design Pro · React",
  },
] as const;

/** Career start: October 2017 (used only for year count, not shown in copy). */
const CAREER_START = new Date(2017, 9, 1);

function completedFullYearsSince(from: Date, asOf = new Date()): number {
  let years = asOf.getFullYear() - from.getFullYear();
  if (
    asOf.getMonth() < from.getMonth() ||
    (asOf.getMonth() === from.getMonth() && asOf.getDate() < from.getDate())
  ) {
    years -= 1;
  }
  return Math.max(0, years);
}

export default function HomePage() {
  const { t } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "home" | "about" | "contact" | "projects"
  >("home");

  const careerYears = completedFullYearsSince(CAREER_START);
  const homeIntro = t.homeIntro.replaceAll("{years}", String(careerYears));

  const openResume = useCallback(() => {
    window.open(t.resumeUrl, "_blank");
  }, [t.resumeUrl]);

  const openGithubProfile = useCallback(() => {
    window.open(GITHUB_PROFILE, "_blank");
  }, []);

  const navButtonClass = (section: "home" | "about" | "contact" | "projects") => {
    return `cursor-pointer transition-colors text-sm lg:text-base ${
      activeSection === section
        ? "text-white"
        : "text-white/80 hover:text-white"
    }`;
  };

  const handleSectionChange = (section: "home" | "about" | "contact" | "projects") => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FlowingWaveOverlay />

      {/* Header Navigation */}
      <header className="relative z-100 flex items-center justify-between px-4 sm:px-6 py-4 lg:px-12">
        <button
          type="button"
          onClick={() => handleSectionChange("home")}
          className="flex items-center pl-3 sm:pl-6 lg:pl-12 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
          aria-label={t.ariaHome}
        >
          <span className="font-semibold tracking-tight text-2xl sm:text-3xl lg:text-4xl text-white select-none">
            bitbw
          </span>
        </button>

        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <button
            key="home"
            type="button"
            onClick={() => handleSectionChange("home")}
            className={navButtonClass("home")}
          >
            {t.navHome}
          </button>

          <button
            key="about"
            type="button"
            onClick={() => handleSectionChange("about")}
            className={navButtonClass("about")}
          >
            {t.navAbout}
          </button>
          <button
            key="contact"
            type="button"
            onClick={() => handleSectionChange("contact")}
            className={navButtonClass("contact")}
          >
            {t.navContact}
          </button>
          <a
            href="https://blog.bitbw.top/"
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:text-white transition-colors text-sm lg:text-base"
          >
            {t.navBlog}
          </a>
          <button
            key="projects"
            type="button"
            onClick={() => handleSectionChange("projects")}
            className={navButtonClass("projects")}
          >
            {t.navProjects}
          </button>
        </nav>

        <div className="flex md:hidden items-center gap-2">
          <LocaleToggle />
          <button
            type="button"
            className="text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LocaleToggle />
          <ShimmerButton
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 lg:px-6 py-2 rounded-xl text-sm lg:text-base font-medium shadow-lg"
            onClick={openGithubProfile}
          >
            {t.viewGithub}
          </ShimmerButton>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-white/10 z-20">
          <nav className="flex flex-col space-y-4 px-6 py-6">
            <button
              type="button"
              onClick={() => handleSectionChange("projects")}
              className={`text-left ${navButtonClass("projects")}`}
            >
              {t.navProjects}
            </button>
            <button
              type="button"
              onClick={() => handleSectionChange("about")}
              className={`text-left ${navButtonClass("about")}`}
            >
              {t.navAbout}
            </button>
            <a
              href="https://blog.bitbw.top/"
              target="_blank"
              rel="noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              {t.navBlog}
            </a>
            <button
              type="button"
              onClick={() => handleSectionChange("contact")}
              className={`text-left ${navButtonClass("contact")}`}
            >
              {t.navContact}
            </button>
            <ShimmerButton
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg w-fit"
              onClick={openResume}
            >
              {t.viewResume}
            </ShimmerButton>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-start justify-start sm:justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-12 max-w-6xl pt-4 sm:-mt-12 lg:-mt-24 pl-6 sm:pl-12 lg:pl-20">
        <AnimatePresence mode="wait">
          {activeSection === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-start"
            >
              <div className="mb-4 sm:mb-8" id="about">
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-2">
                  <span className="text-white text-xs md:text-xs">
                    {t.roleBadge}
                  </span>
                </div>
              </div>

              <h1 className="text-white text-4xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-8xl font-bold leading-tight mb-4 sm:mb-6 text-balance">
                {t.heroTitleLine1}
                <br />
                {t.heroTitleLine2Prefix}{" "}
                <LineShadowText
                  className="italic font-light"
                  shadowColor="white"
                >
                  {t.heroAccent}
                </LineShadowText>
              </h1>

              <p className="text-white/70 text-sm sm:text-base md:text-sm lg:text-2xl mb-6 sm:mb-8 max-w-2xl text-pretty">
                {homeIntro}
              </p>

              <Button
                asChild
                className="cursor-pointer group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base md:text-xs lg:text-lg font-semibold flex items-center gap-2 backdrop-blur-sm border border-orange-400/30 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
              >
                <a
                  href={GITHUB_PROFILE}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t.viewGithubAria}
                >
                  {t.viewGithub}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </Button>
            </motion.div>
          )}

          {activeSection === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-6 lg:gap-8"
            >
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-2 w-fit">
                <span className="text-white text-xs md:text-xs">
                  {t.aboutBadge}
                </span>
              </div>
              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                {t.aboutTitle}
              </h2>
              <p className="text-white/70 text-base sm:text-lg lg:text-xl max-w-3xl">
                {t.aboutLead}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {t.cardCoreTitle}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {t.cardCoreBody}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {t.cardRecentTitle}
                  </h3>
                  <ul className="space-y-2 text-white/70 text-sm leading-relaxed">
                    <li>{t.cardRecent1}</li>
                    <li>{t.cardRecent2}</li>
                    <li>{t.cardRecent3}</li>
                  </ul>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {t.cardDrivesTitle}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {t.cardDrivesBody}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {t.cardToolboxTitle}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {t.cardToolboxBody}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="w-fit rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                onClick={openResume}
              >
                {t.viewResume}
              </button>
            </motion.div>
          )}

          {activeSection === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full"
            >
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-2 w-fit mb-6">
                <span className="text-white text-xs md:text-xs">
                  {t.contactBadge}
                </span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-12">
                <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  {t.contactTitle}
                </h2>
                <p className="text-white/70 text-base sm:text-lg lg:text-xl mb-8 max-w-2xl">
                  {t.contactLead}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg text-base font-medium transition-all duration-300"
                  >
                    <a href="mailto:mail.bitbw@gmail.com">{t.emailMe}</a>
                  </Button>
                  <Button
                    asChild
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg text-base font-medium transition-all duration-300"
                  >
                    <a
                      href={GITHUB_PROFILE}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t.linkGithub}
                    </a>
                  </Button>
                  <Button
                    asChild
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg text-base font-medium transition-all duration-300"
                  >
                    <a
                      href="https://blog.bitbw.top/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t.linkBlog}
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-6 lg:gap-8 w-full"
            >
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-2 w-fit">
                <span className="text-white text-xs md:text-xs">
                  {t.projectsBadge}
                </span>
              </div>
              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                {t.projectsTitle}
              </h2>
              <p className="text-white/70 text-base sm:text-lg lg:text-xl max-w-3xl">
                {t.projectsLead}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {PROJECTS.map((project) => (
                  <div
                    key={project.url}
                    className="group bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col gap-3 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-white text-base font-semibold leading-snug">
                        {t[project.nameKey]}
                      </h3>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t[project.nameKey]}
                        className="shrink-0 text-white/40 hover:text-white transition-colors mt-0.5"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed flex-1">
                      {t[project.descKey]}
                    </p>
                    <span className="inline-block text-xs text-white/40 font-mono">
                      {project.tech}
                    </span>
                  </div>
                ))}
              </div>
              <a
                href={GITHUB_REPOS}
                target="_blank"
                rel="noreferrer"
                className="w-fit inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                {t.projectsViewAll}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
