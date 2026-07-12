"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";

const GISCUS_ORIGIN = "https://giscus.app";

function currentTheme(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

/** Giscus comments (GitHub Discussions). Renders nothing until repoId +
 *  categoryId are set in site.comments. Theme follows the site toggle live. */
export function Comments() {
  const ref = useRef<HTMLDivElement>(null);
  const c = site.comments;
  const enabled = Boolean(c.repoId && c.categoryId);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const s = document.createElement("script");
    s.src = `${GISCUS_ORIGIN}/client.js`;
    s.async = true;
    s.crossOrigin = "anonymous";
    s.setAttribute("data-repo", c.repo);
    s.setAttribute("data-repo-id", c.repoId);
    s.setAttribute("data-category", c.category);
    s.setAttribute("data-category-id", c.categoryId);
    s.setAttribute("data-mapping", "pathname");
    s.setAttribute("data-strict", "0");
    s.setAttribute("data-reactions-enabled", "1");
    s.setAttribute("data-emit-metadata", "0");
    s.setAttribute("data-input-position", "bottom");
    s.setAttribute("data-theme", currentTheme());
    s.setAttribute("data-lang", "en");
    s.setAttribute("loading", "lazy");

    const el = ref.current;
    el.innerHTML = "";
    el.appendChild(s);

    // Keep giscus in sync with the site's theme toggle.
    const observer = new MutationObserver(() => {
      const iframe = el.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
      iframe?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: currentTheme() } } },
        GISCUS_ORIGIN,
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [enabled, c]);

  if (!enabled) return null;
  return <div ref={ref} className="mt-16 border-t border-border pt-10" />;
}
