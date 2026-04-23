"use client";

import { useLocale } from "@/components/locale-provider";
import type { Locale } from "@/lib/i18n/copy";

export function LocaleToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  const pill =
    "rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40";

  const select = (next: Locale) => {
    setLocale(next);
  };

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border border-white/20 bg-black/30 p-0.5 ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        className={`${pill} ${
          locale === "en"
            ? "bg-white/20 text-white"
            : "text-white/70 hover:text-white"
        }`}
        onClick={() => select("en")}
      >
        {t.localeEn}
      </button>
      <button
        type="button"
        className={`${pill} ${
          locale === "zh"
            ? "bg-white/20 text-white"
            : "text-white/70 hover:text-white"
        }`}
        onClick={() => select("zh")}
      >
        {t.localeZh}
      </button>
    </div>
  );
}
