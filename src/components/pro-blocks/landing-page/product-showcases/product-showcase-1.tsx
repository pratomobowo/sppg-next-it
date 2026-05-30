"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon } from "lucide-react";

const SHOWCASE_TABS = [
  { value: "figma-kit", label: "Figma Kit" },
  { value: "pro-blocks", label: "Pro Blocks" },
  { value: "agent-skills", label: "Agent Skills" },
  { value: "figma-plugin", label: "Figma Plugin" },
] as const;

function ShowcasePreview({ label }: { label: string }) {
  return (
    <div className="bg-muted/40 flex aspect-video w-full items-center justify-center rounded-xl border">
      <div className="text-muted-foreground flex flex-col items-center gap-2">
        <ImageIcon className="size-8" />
        <span className="text-sm font-medium">{label} preview</span>
      </div>
    </div>
  );
}

export function ProductShowcase1() {
  return (
    <section className="bg-background" aria-label="Product showcase">
      <div className="mx-auto max-w-7xl border-x">
        <Tabs defaultValue="pro-blocks" className="gap-0">
          <TabsList className="grid !h-auto w-full grid-cols-2 gap-0 rounded-none border-y bg-transparent p-0 sm:grid-cols-4">
            {SHOWCASE_TABS.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="relative -mb-px h-auto rounded-none border-t-0 border-r-0 border-b-2 border-l border-l-border border-b-transparent py-4 text-base font-semibold shadow-none after:hidden first:border-l-0 data-[state=active]:border-b-foreground data-[state=active]:bg-muted/50 data-[state=active]:shadow-none"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {SHOWCASE_TABS.map(({ value, label }) => (
            <TabsContent
              key={value}
              value={value}
              className="container-padding-x border-b py-16 lg:py-24"
            >
              <ShowcasePreview label={label} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
