"use client";

import { Logo } from "@/components/pro-blocks/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  {
    label: "Default Dashboard",
    description: "Orders, earnings, and transactions overview",
    href: "/dashboard",
  },
  {
    label: "SaaS Dashboard",
    description: "MRR, active users, and growth metrics",
    href: "/dashboard-saas",
  },
  {
    label: "Analytics",
    description: "Charts, reports, and traffic insights",
    href: "/analytics",
  },
  {
    label: "E-Commerce",
    description: "Products, orders, and customers",
    href: "/pages/ecommerce/dashboard",
  },
] as const;

const RESOURCES = [
  { label: "Components", description: "50+ ready-to-use UI components", href: "/components/button" },
  { label: "Charts", description: "Area, bar, and pie visualizations", href: "/charts" },
  { label: "Icons", description: "Browse the full icon set", href: "/icons" },
  { label: "Authentication", description: "Login, register, and recovery flows", href: "/auth/login" },
] as const;

const SIMPLE_LINKS = [
  { label: "Pricing", href: "/pages/pricing" },
  { label: "Billing", href: "/pages/billing" },
  { label: "Help", href: "/pages/help" },
] as const;

// Horizontal padding of the nav container (px-6 = 1.5rem on each side).
const CONTAINER_PADDING = 48;
// Breathing room kept on each side of the centered menu.
const SIDE_GAP = 24;

interface MenuLinkListProps {
  items: ReadonlyArray<{ label: string; description: string; href: string }>;
}

function MenuLinkList({ items }: MenuLinkListProps) {
  return (
    <ul className="grid w-[22rem] gap-1 p-2">
      {items.map(({ label, description, href }) => (
        <li key={label}>
          <NavigationMenuLink asChild>
            <Link href={href}>
              <span className="text-sm font-medium">{label}</span>
              <span className="text-muted-foreground text-sm">
                {description}
              </span>
            </Link>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  );
}

function MobileLinks() {
  return (
    <div className="flex flex-col gap-1">
      {[
        { label: "Products", href: "#" },
        { label: "Resources", href: "#" },
        ...SIMPLE_LINKS,
      ].map(({ label, href }) => (
        <Link key={label} href={href}>
          <Button variant="ghost" className="w-full justify-start">
            {label}
          </Button>
        </Link>
      ))}
    </div>
  );
}

export function LpNavbar1() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Driven by available width, not a fixed breakpoint.
  const [isCompact, setIsCompact] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mirrorLogoRef = useRef<HTMLDivElement>(null);
  const mirrorMenuRef = useRef<HTMLDivElement>(null);
  const mirrorActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const available = container.clientWidth - CONTAINER_PADDING;
      const logoW = mirrorLogoRef.current?.offsetWidth ?? 0;
      const menuW = mirrorMenuRef.current?.offsetWidth ?? 0;
      const actionsW = mirrorActionsRef.current?.offsetWidth ?? 0;
      // Centered menu needs symmetric space on both sides of the widest edge.
      const needed = menuW + 2 * Math.max(logoW, actionsW) + 2 * SIDE_GAP;
      const compact = needed > available;
      setIsCompact(compact);
      if (!compact) setIsMenuOpen(false);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="bg-background sticky top-0 isolate z-50">
      {/* Announcement banner */}
      <Link
        href="/dashboard"
        className="bg-muted/60 text-muted-foreground hover:bg-muted flex items-center justify-center gap-2 border-b px-4 py-2.5 text-center text-xs transition-colors sm:px-6 sm:text-sm"
      >
        <span className="bg-background shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium shadow-xs">
          New update
        </span>
        <span className="text-foreground min-w-0 truncate font-medium">
          Billing, notifications, and draggable dashboard widgets are now live.
        </span>
        <ArrowRight className="size-4 shrink-0" />
      </Link>

      <nav className="relative border-b">
        <div
          ref={containerRef}
          className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 border-x px-6 py-3.5 md:py-4"
        >
          {/* Hidden mirror for measuring the natural desktop width */}
          <div
            aria-hidden
            className="pointer-events-none invisible absolute top-0 left-0 flex w-max items-center"
          >
            <div ref={mirrorLogoRef}>
              <Logo className="h-3 w-auto" />
            </div>
            <div ref={mirrorMenuRef} className="flex items-center">
              <span className={navigationMenuTriggerStyle()}>Products</span>
              <span className={navigationMenuTriggerStyle()}>Resources</span>
              {SIMPLE_LINKS.map(({ label }) => (
                <span key={label} className={navigationMenuTriggerStyle()}>
                  {label}
                </span>
              ))}
            </div>
            <div ref={mirrorActionsRef} className="flex items-center gap-2">
              <Button variant="ghost" tabIndex={-1}>
                Sign in
              </Button>
              <Button className="rounded-full" tabIndex={-1}>
                Open dashboard
              </Button>
            </div>
          </div>

          {/* Logo */}
          <Link href="/" aria-label="Go to homepage">
            <Logo className="text-foreground h-3 w-auto" />
          </Link>

          {/* Desktop centered navigation */}
          <NavigationMenu
            viewport={false}
            className={cn(
              "absolute left-1/2 -translate-x-1/2",
              isCompact ? "hidden" : "flex",
            )}
          >
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <MenuLinkList items={PRODUCTS} />
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <MenuLinkList items={RESOURCES} />
                </NavigationMenuContent>
              </NavigationMenuItem>
              {SIMPLE_LINKS.map(({ label, href }) => (
                <NavigationMenuItem key={label}>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href={href}>{label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop actions */}
          <div
            className={cn("items-center gap-2", isCompact ? "hidden" : "flex")}
          >
            <Link href="/auth/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="rounded-full">Open dashboard</Button>
            </Link>
          </div>

          {/* Compact toggle */}
          <Button
            variant="ghost"
            className={cn(
              "size-9 items-center justify-center",
              isCompact ? "flex" : "hidden",
            )}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Compact navigation overlay */}
        <div
          className={cn(
            "absolute inset-x-0 top-full z-40 grid bg-background transition-[grid-template-rows] duration-300 ease-out",
            !isCompact && "hidden",
            isMenuOpen
              ? "grid-rows-[1fr]"
              : "pointer-events-none grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden border-b">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 border-x px-6 py-4">
              <MobileLinks />
              <div className="flex flex-col gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="w-full rounded-full">Open dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
