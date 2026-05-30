import { LpNavbar1 } from '@/components/pro-blocks/landing-page/lp-navbars/lp-navbar-1'
import { HeroSection1 } from '@/components/pro-blocks/landing-page/hero-sections/hero-section-1'
import { ProductShowcase1 } from '@/components/pro-blocks/landing-page/product-showcases/product-showcase-1'
import { LogoSection1 } from '@/components/pro-blocks/landing-page/logo-sections/logo-section-1'
import { BentoGrid1 } from '@/components/pro-blocks/landing-page/bento-grids/bento-grid-1'
import { TestimonialsSection1 } from '@/components/pro-blocks/landing-page/testimonials-sections/testimonials-section-1'
import { CtaSection1 } from '@/components/pro-blocks/landing-page/cta-sections/cta-section-1'
import { Footer1 } from '@/components/pro-blocks/landing-page/footers/footer-1'

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <LpNavbar1 />
      <main className="flex-1">
        <HeroSection1 />
        <ProductShowcase1 />
        <LogoSection1 />
        <BentoGrid1 />
        <TestimonialsSection1 />
        <CtaSection1 />
      </main>
      <Footer1 />
    </div>
  )
}
