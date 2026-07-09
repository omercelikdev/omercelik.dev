import { getTranslations } from "next-intl/server";
import { Boxes, Cpu, Layers, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const ICONS = [Cpu, Boxes, Layers, Sparkles];

export async function Capabilities() {
  const t = await getTranslations("home");
  const items = t.raw("capabilities") as { title: string; desc: string }[];

  return (
    <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <Reveal
            key={item.title}
            delay={i * 70}
            className="rounded-[var(--radius-xl)] border border-border p-5 transition-colors duration-200 hover:border-border-strong"
          >
            <Icon className="mb-4 size-5 text-foreground" strokeWidth={1.5} />
            <h3 className="mb-1.5 text-[14px] font-medium">{item.title}</h3>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {item.desc}
            </p>
          </Reveal>
        );
      })}
    </div>
  );
}
