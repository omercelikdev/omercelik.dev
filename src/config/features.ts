/** Feature flags. Flip one here; nothing else changes. Everything behind a
 *  flag stays in the codebase, tested, and out of the build output until it's
 *  on — a static export has no runtime toggles. */
export const features = {
  /** The Qorpe band and product cards on Work and the home page. Off until
   *  the licensing and the qorpe.com site are settled. */
  qorpe: false,
} as const;
