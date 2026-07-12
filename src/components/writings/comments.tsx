"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";

/** Giscus comments (GitHub Discussions). Renders nothing until repoId +
 *  categoryId are set in site.comments. Theme follows the site's data-theme. */
export function Comments() {
  const ref = useRef<HTMLDivElement>(null);
  const c = site.comments;
  const enabled = Boolean(c.repoId && c.categoryId);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const theme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";

    const s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    s.async = true;
    s.crossOrigin = "anonymous";
    s.setAttribute("data-repo", c.repo);
    s.setAttribute("data-repo-id", c.repoId);
    s.setAttribute("data-category", c.category);
    s.setAttribute("data-category-id", c.categoryId);
    s.setAttribute("data-mapping", "pathname");
    s.setAttribute("data-strict", "1");
    s.setAttribute("data-reactions-enabled", "1");
    s.setAttribute("data-emit-metadata", "0");
    s.setAttribute("data-input-position", "top");
    s.setAttribute("data-theme", theme);
    s.setAttribute("data-lang", "en");
    s.setAttribute("loading", "lazy");

    const el = ref.current;
    el.innerHTML = "";
    el.appendChild(s);
  }, [enabled, c]);

  if (!enabled) return null;
  return <div ref={ref} className="mt-16 border-t border-border pt-10" />;
}
