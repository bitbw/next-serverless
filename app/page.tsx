"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Menu } from "lucide-react";
import { LineShadowText } from "@/components/line-shadow-text";
import { FlowingWaveOverlay } from "@/components/flowing-wave-overlay";
import { ShimmerButton } from "@/components/shimmer-button";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "home" | "about" | "contact"
  >("home");

  const navButtonClass = (section: "home" | "about" | "contact") => {
    return `cursor-pointer transition-colors text-sm lg:text-base ${
      activeSection === section
        ? "text-white"
        : "text-white/80 hover:text-white"
    }`;
  };

  const handleSectionChange = (section: "home" | "about" | "contact") => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FlowingWaveOverlay />

      {/* Header Navigation */}
      <header className="relative z-100 flex items-center justify-between px-4 sm:px-6 py-4 lg:px-12">
        <div className="flex items-center space-x-2 pl-3 sm:pl-6 lg:pl-12">
          <img
            src="/v0-logo.png"
            alt="Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
          />
        </div>

        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
        <button
            key={"home"}
            type="button"
            onClick={() => handleSectionChange("home")}
            className={navButtonClass("home")}
          >
            Home
          </button>
         
          <button
            key={"about"}
            type="button"
            onClick={() => handleSectionChange("about")}
            className={navButtonClass("about")}
          >
            About
          </button>
          <button
            key={"contact"}
            type="button"
            onClick={() => handleSectionChange("contact")}
            className={navButtonClass("contact")}
          >
            Contact
          </button>
          <a
            href="https://blog.bitbw.top/"
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:text-white transition-colors text-sm lg:text-base"
          >
            Blog
          </a>
          <a
            href="https://github.com/bitbw"
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:text-white transition-colors text-sm lg:text-base"
          >
            Projects
          </a>
        
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <ShimmerButton
          className="hidden md:flex bg-orange-500 hover:bg-orange-600 text-white px-4 lg:px-6 py-2 rounded-xl text-sm lg:text-base font-medium shadow-lg"
          onClick={() => {
            window.open(
              "https://bitbw.notion.site/Bowen-Zhang-s-Resume-4a147165710948efa83f23ffd61303ec",
              "_blank"
            );
          }}
        >
          View Resume
        </ShimmerButton>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-white/10 z-20">
          <nav className="flex flex-col space-y-4 px-6 py-6">
            <a
              href="https://github.com/bitbw"
              target="_blank"
              rel="noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              Projects
            </a>
            <button
              type="button"
              onClick={() => handleSectionChange("about")}
              className={`text-left ${navButtonClass("about")}`}
            >
              About
            </button>
            <a
              href="https://blog.bitbw.top/"
              target="_blank"
              rel="noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              Blog
            </a>
            <button
              type="button"
              onClick={() => handleSectionChange("contact")}
              className={`text-left ${navButtonClass("contact")}`}
            >
              Contact
            </button>
            <ShimmerButton
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg w-fit"
              onClick={() => {
                window.open(
                  "https://bitbw.notion.site/Bowen-Zhang-s-Resume-4a147165710948efa83f23ffd61303ec",
                  "_blank"
                );
              }}
            >
              View Resume
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
                    Bowen Zhang · Frontend Developer
                  </span>
                </div>
              </div>

              <h1 className="text-white text-4xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-8xl font-bold leading-tight mb-4 sm:mb-6 text-balance">
                Building the Future
                <br />
                with{" "}
                <LineShadowText
                  className="italic font-light"
                  shadowColor="white"
                >
                  Code&AI
                </LineShadowText>
              </h1>

              <p className="text-white/70 text-sm sm:text-base md:text-sm lg:text-2xl mb-6 sm:mb-8 max-w-2xl text-pretty">
                I'm Bowen, a frontend engineer with 6+ years building production
                apps in React, Vue, and TypeScript. I specialize in data
                visualization, autonomous driving platforms, and exploring
                AI-powered tools. Always learning, always shipping.
              </p>

              <Button
                asChild
                className="cursor-pointer group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base md:text-xs lg:text-lg font-semibold flex items-center gap-2 backdrop-blur-sm border border-orange-400/30 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
              >
                <a
                  href="https://github.com/bitbw"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Visit Bowen's GitHub profile"
                >
                  View GitHub
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
                  About Bowen
                </span>
              </div>
              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Developer, technologist, relentless learner.
              </h2>
              <p className="text-white/70 text-base sm:text-lg lg:text-xl max-w-3xl">
                I craft human-centered interfaces and data-rich dashboards
                across automotive, mapping, and enterprise products. From CAN
                bus visualizers to large-scale management platforms, I bridge
                product vision with performant frontends that teams can scale
                and maintain.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    Core Focus
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    TypeScript-first development, design systems, data
                    visualization, and AI-assisted workflows for teams shipping
                    ambitious software.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    Recent Highlights
                  </h3>
                  <ul className="space-y-2 text-white/70 text-sm leading-relaxed">
                    <li>
                      • Led Li Auto's smart chassis visualization platform
                    </li>
                    <li>
                      • Built end-to-end project management systems with React &
                      Vite
                    </li>
                    <li>• Shipped high-traffic Meituan map experiences</li>
                  </ul>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    What Drives Me
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Curiosity for emerging tech, especially AI. I love
                    transforming complex requirements into experiences that feel
                    effortless.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    Toolbox
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    React, Vue, Next.js, Vite, ECharts, Three.js, Node.js,
                    Electron, Ant Design, Quasar, Webpack, Vercel.
                  </p>
                </div>
              </div>
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
                <span className="text-white text-xs md:text-xs">Contact</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-12">
                <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  Let's build something meaningful.
                </h2>
                <p className="text-white/70 text-base sm:text-lg lg:text-xl mb-8 max-w-2xl">
                  Whether you’re exploring partnerships, need help shipping a
                  complex interface, or want to talk about AI-augmented
                  workflows, my inbox is open.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg text-base font-medium transition-all duration-300"
                  >
                    <a href="mailto:mail.bitbw@gmail.com">Email Me</a>
                  </Button>
                  <Button
                    asChild
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg text-base font-medium transition-all duration-300"
                  >
                    <a
                      href="https://github.com/bitbw"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
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
                      Blog
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
