import { getRequestConfig } from "next-intl/server";
import messages from "./messages/en.json";

/** The site is English-only. next-intl stays as the home of the UI copy
 *  (messages/en.json, with ICU plurals and rich text), not for routing. The
 *  fixed locale also keeps every page statically rendered: nothing reads the
 *  request to decide which language to use. */
export default getRequestConfig(async () => ({ locale: "en", messages }));
