"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";

export function BentoGrid1() {
  return (
    <section className="bg-muted">
      <div className="section-padding-y container-padding-x mx-auto flex max-w-7xl flex-col gap-10 border-x md:gap-12">
        <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center">
          <Tagline>What&apos;s inside</Tagline>
          <h2 className="heading-lg">
            Everything your dashboard needs, out of the box
          </h2>
          <p className="text-muted-foreground text-lg/8 text-pretty">
            Charts, data tables, theming, and ready-made layouts that work
            together so you spend time on your product, not on scaffolding.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-xl shadow-xs lg:row-span-2">
            <CardHeader>
              <h3 className="heading-sm">Ready-made dashboards</h3>
              <p className="text-muted-foreground">
                SaaS, analytics, and app-shell layouts with sidebar, command
                palette, and notifications already wired up.
              </p>
            </CardHeader>
            <CardContent className="flex h-full flex-col">
              <Image
                src="https://ui.shadcn.com/placeholder.svg"
                alt="Placeholder"
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
              />
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-xs">
            <CardHeader>
              <h3 className="heading-sm">Charts &amp; analytics</h3>
              <p className="text-muted-foreground">
                Area, bar, and pie charts that follow your theme tokens
                automatically.
              </p>
            </CardHeader>
            <CardContent className="flex h-full flex-col">
              <Image
                src="https://ui.shadcn.com/placeholder.svg"
                alt="Placeholder"
                width={1000}
                height={1000}
                className="h-full w-full object-cover md:aspect-[4/3]"
              />
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-xs lg:col-start-2">
            <CardHeader>
              <h3 className="heading-sm">Powerful data tables</h3>
              <p className="text-muted-foreground">
                Sort, filter, and reorder rows with drag-and-drop, ready for
                your own data.
              </p>
            </CardHeader>
            <CardContent className="flex h-full flex-col">
              <Image
                src="https://ui.shadcn.com/placeholder.svg"
                alt="Placeholder"
                width={1000}
                height={1000}
                className="h-full w-full object-cover md:aspect-[4/3]"
              />
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-xs lg:col-start-3 lg:row-span-2 lg:row-start-1">
            <CardHeader>
              <h3 className="heading-sm">Theming you control</h3>
              <p className="text-muted-foreground">
                Switch color presets and radius on the fly, with full light and
                dark mode support.
              </p>
            </CardHeader>
            <CardContent className="flex h-full flex-col">
              <Image
                src="https://ui.shadcn.com/placeholder.svg"
                alt="Placeholder"
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
