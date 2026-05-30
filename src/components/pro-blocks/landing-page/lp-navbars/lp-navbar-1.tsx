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
import { useState } from "react";
import Link from "next/link";

const PRODUCTS = [
  {
    label: "Figma Kit",
    description: "Design system components for Figma",
    href: "#",
  },
  {
    label: "Pro Blocks",
    description: "Ready-to-ship marketing sections",
    href: "#",
  },
  {
    label: "Agent Skills",
    description: "AI-powered workflows for your team",
    href: "#",
  },
  {
    label: "Figma Plugin",
    description: "Bring components straight into Figma",
    href: "#",
  },
] as const;

const RESOURCES = [
  { label: "Documentation", description: "Guides and API references", href: "#" },
  { label: "Templates", description: "Starter projects and layouts", href: "#" },
  { label: "Changelog", description: "Latest updates and releases", href: "#" },
  { label: "Community", description: "Join the conversation", href: "#" },
] as const;

const SIMPLE_LINKS = [
  { label: "Docs", href: "#" },
  { label: "Help", href: "#" },
  { label: "Pricing", href: "#" },
] as const;

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

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="bg-background sticky top-0 isolate z-50">
      {/* Announcement banner */}
      <Link
        href="#"
        className="bg-muted/60 text-muted-foreground hover:bg-muted flex items-center justify-center gap-2 border-b px-6 py-2.5 text-center text-sm transition-colors"
      >
        <span className="bg-background rounded-full border px-2 py-0.5 text-xs font-medium shadow-xs">
          New update
        </span>
        <span className="text-foreground hidden font-medium sm:inline">
          New Figma kit shadcn/ui styles &ndash; Nova, Vega, Mira and Luma.
        </span>
        <ArrowRight className="size-4 shrink-0" />
      </Link>

      <nav className="border-b">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 border-x px-6 py-3.5 md:py-4">
          {/* Logo */}
          <Link href="/" aria-label="Go to homepage">
            <Logo className="text-foreground h-3 w-auto" />
          </Link>

          {/* Desktop centered navigation */}
          <NavigationMenu
            viewport={false}
            className="absolute left-1/2 hidden -translate-x-1/2 md:flex"
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
          <div className="hidden items-center gap-2 md:flex">
            <Link href="#">
              <Button variant="ghost">Preview</Button>
            </Link>
            <Link href="#">
              <Button className="rounded-full">Get access</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            className="flex size-9 items-center justify-center md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 pt-4 md:hidden">
            <MobileLinks />
            <div className="flex flex-col gap-2">
              <Link href="#">
                <Button variant="ghost" className="w-full">
                  Preview
                </Button>
              </Link>
              <Link href="#">
                <Button className="w-full rounded-full">Get access</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
