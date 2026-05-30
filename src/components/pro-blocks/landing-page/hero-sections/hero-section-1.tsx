"use client";

import { Button } from "@/components/ui/button";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const SOCIAL_PROOF_AVATARS = [
  { src: "https://github.com/shadcn.png", fallback: "SC" },
  { src: "https://github.com/leerob.png", fallback: "LR" },
  { src: "https://github.com/evilrabbit.png", fallback: "ER" },
  { src: "https://github.com/vercel.png", fallback: "VC" },
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
        <div className="flex items-center gap-3">
          <AvatarGroup>
            {SOCIAL_PROOF_AVATARS.map(({ src, fallback }) => (
              <Avatar key={fallback}>
                <AvatarImage src={src} alt={fallback} />
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          <p className="text-muted-foreground text-left text-xs font-medium tracking-wide uppercase">
            Loved by <span className="text-foreground">shadcn</span> and{" "}
            <span className="text-foreground">7,500+</span>
            <br className="hidden sm:block" /> creators and teams
          </p>
        </div>

        {/* Heading */}
        <div className="section-title-gap-xl flex flex-col items-center">
          <h1 id="hero-heading" className="heading-xl">
            Design &amp; ship shadcn/ui projects faster
          </h1>
          <p className="text-muted-foreground text-lg/8 text-pretty">
            Extensive collection of Figma and React resources to help designers,
            developers, and teams deliver shadcn/ui projects efficiently.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Link href="#">
            <Button size="lg" className="rounded-full">
              Get lifetime access
            </Button>
          </Link>
          <Link href="#">
            <Button size="lg" variant="outline" className="rounded-full">
              Preview
              <ArrowUpRight />
            </Button>
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
}
