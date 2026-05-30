"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

export function TestimonialsSection1() {
  return (
    <section
      className="bg-muted/40"
      aria-labelledby="testimonial-title"
    >
      <div className="section-padding-y container-padding-x mx-auto flex max-w-7xl flex-col items-center border-x">
        <div className="flex max-w-2xl flex-col items-center gap-8">
        <blockquote
          id="testimonial-title"
          className="text-foreground text-center text-lg leading-7 font-medium text-pretty md:text-xl"
        >
          &quot;Moccilabs completely transformed how we ship internal tools.
          The dashboards and components are production-ready out of the box, so
          we launched our admin panel in days instead of months.&quot;
        </blockquote>

        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-12 w-12 rounded-xl md:h-14 md:w-14">
            <AvatarImage
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Lando Norris"
              alt="Lando Norris"
            />
          </Avatar>

          <div className="flex flex-col items-center sm:flex-row sm:gap-2">
            <span className="text-foreground font-medium">Lando Norris</span>
            <span className="text-muted-foreground hidden opacity-50 sm:block">
              •
            </span>
            <span className="text-muted-foreground">CEO at Acme Inc.</span>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
