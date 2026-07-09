/** Runs before first paint to set the theme with no flash of the wrong colours.
 *  Default is light (per design), overridden only by an explicit stored choice.
 *  Adds `theme-ready` on the next frame so token transitions don't fire on load. */
export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light')t='light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}requestAnimationFrame(function(){document.documentElement.classList.add('theme-ready');});})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
