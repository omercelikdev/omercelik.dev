import { type ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "sm";

const VARIANT: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  outline: "bg-background border border-border hover:bg-muted",
  ghost: "bg-transparent hover:bg-muted",
};
const SIZE: Record<Size, string> = {
  md: "h-9 px-3.5 text-sm",
  sm: "h-8 px-3 text-[13px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return `inline-flex items-center justify-center gap-2 rounded-[var(--radius-lg)] font-semibold transition-colors ${VARIANT[variant]} ${SIZE[size]}`;
}

/** Internal, locale-aware link styled as a button. */
export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={buttonClass(variant, size)}>
      {children}
    </Link>
  );
}
