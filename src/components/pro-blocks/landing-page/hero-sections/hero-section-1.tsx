"use client";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const SOCIAL_PROOF_AVATARS = [
  { seed: "Fathur", fallback: "FT" },
  { seed: "Sarah", fallback: "SA" },
  { seed: "Andi", fallback: "AN" },
  { seed: "Maya", fallback: "MY" },
] as const;

export function HeroSection1() {
  return (
    <section
      className="bg-background"
      aria-labelledby="hero-heading"
    >
      <div className="section-padding-y mx-auto max-w-7xl border-x">
        <div className="container-padding-x mx-auto flex max-w-3xl flex-col items-center gap-6 text-center lg:gap-8">
        {/* Social proof */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-muted-foreground text-center text-xs font-medium tracking-wide uppercase">
            Trusted by <span className="text-foreground">product teams</span> at{" "}
            <span className="text-foreground">500+</span> startups and agencies
          </p>
          <AvatarGroup>
            {SOCIAL_PROOF_AVATARS.map(({ seed, fallback }) => (
              <Avatar key={fallback}>
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`}
                  alt={fallback}
                />
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>

        {/* Heading */}
        <div className="section-title-gap-xl flex flex-col items-center">
          <h1 id="hero-heading" className="heading-xl">
            Your admin dashboard, ready on day one
          </h1>
          <p className="text-muted-foreground text-lg/8 text-pretty">
            Moccilabs gives you production-ready dashboards, 50+ UI components, and
            built-in theming so you can launch internal tools and SaaS backends
            in hours, not weeks.
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full rounded-full sm:w-auto">
              Open the dashboard
            </Button>
          </Link>
          <Link href="/dashboard-saas" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full rounded-full sm:w-auto">
              View live demo
              <ArrowUpRight />
            </Button>
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
}
