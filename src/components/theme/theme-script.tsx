import Script from "next/script";

/** Runs before first paint to set the theme with no flash of the wrong colours.
 *  Default is light (per design), overridden only by an explicit stored choice.
 *  Uses next/script (beforeInteractive) so it isn't re-rendered as a React
 *  <script> on the client. */
const THEME_JS = `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light')t='light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}requestAnimationFrame(function(){document.documentElement.classList.add('theme-ready');});})();`;

export function ThemeScript() {
  return (
    <Script
      id="theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: THEME_JS }}
    />
  );
}
