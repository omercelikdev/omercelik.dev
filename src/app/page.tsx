import { routing } from "@/i18n/routing";
import { site } from "@/config/site";

const FALLBACK = `/${routing.defaultLocale}`;

// A static host has no server to negotiate the language, so the root page does
// it in the browser: the first supported language the visitor prefers, else
// English. The <noscript> refresh covers visitors without JavaScript.
const PICK_LOCALE = `(function(){var s=${JSON.stringify(routing.locales)};var p=navigator.languages||[navigator.language||""];for(var i=0;i<p.length;i++){var l=String(p[i]).slice(0,2).toLowerCase();if(s.indexOf(l)>-1){location.replace("/"+l);return}}location.replace(${JSON.stringify(FALLBACK)})})()`;

export default function RootPage() {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <title>{site.name}</title>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href={`${site.url}${FALLBACK}`} />
        <script dangerouslySetInnerHTML={{ __html: PICK_LOCALE }} />
        <noscript>
          <meta httpEquiv="refresh" content={`0; url=${FALLBACK}`} />
        </noscript>
      </head>
      <body>
        <a href={FALLBACK}>{site.domain}</a>
      </body>
    </html>
  );
}
