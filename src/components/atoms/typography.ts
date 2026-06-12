// Usage: import { siteText } from "@/components/atoms/typography"

// Theme-aware: alpha-0/alpha-25 are "ink at opacities" and flip with light/dark
export const SITE_HERO_GRADIENT =
  "[background-image:radial-gradient(circle_at_50%_-100%,var(--alpha-0),var(--alpha-25))] bg-clip-text [-webkit-text-fill-color:transparent]";

export const siteText = {
  // Display headings — Inter Display + font-optical-sizing:auto.
  // H1 + H2 scale responsively (mobile-first):
  //   H1: ≤479=2.375/3 · 480–767=3.25/3.75 · ≥768=3.75/4.25 rem
  //   H2: ≤479=2.25/3 · 480–991=2.5/3.25 · ≥992=2.75/3.36 rem
  displayH1: "font-display font-semibold tracking-[-0.0075em] [font-optical-sizing:auto] text-[2.375rem] leading-[3rem] min-[480px]:text-[3.25rem] min-[480px]:leading-[3.75rem] md:text-[3.75rem] md:leading-[4.25rem]",
  displayH2: "font-display font-semibold tracking-[-0.0075em] [font-optical-sizing:auto] text-[2.25rem] leading-[3rem] min-[480px]:text-[2.5rem] min-[480px]:leading-[3.25rem] fp-lg:text-[2.75rem] fp-lg:leading-[3.36rem]",
  displayH3: "font-display text-[2.25rem] font-semibold leading-[2.75rem] tracking-[-0.00722em] [font-optical-sizing:auto]",
  displayH4: "font-display text-[1.75rem] font-semibold leading-[2.25rem] tracking-[-0.00714em] [font-optical-sizing:auto]",
  displayH5: "m-0 font-display text-[1.5rem] font-semibold leading-8 tracking-[-0.00667em] [font-optical-sizing:auto]",

  // Headings — Inter
  headingL: "font-sans text-[1.125rem] font-[550] leading-6 tracking-[-0.0144em]",
  headingM: "font-sans text-base font-[550] leading-6 tracking-[-0.01125em]",

  // Labels — Inter
  labelM: "m-0 font-sans text-base font-medium leading-6 tracking-[-0.01125em] no-underline",
  labelS: "m-0 font-sans text-[0.875rem] font-medium leading-5 tracking-[-0.00643em] no-underline",
  labelL: "m-0 font-sans text-[1.125rem] font-medium leading-6 tracking-[-0.0144em] no-underline",

  // Body — Inter
  bodyM: "font-sans text-base font-normal leading-6 tracking-[-0.01125em]",
  bodyL: "font-sans text-[1.125rem] font-normal leading-7 tracking-[-0.0144em]",
  bodyS: "font-sans text-[0.875rem] font-normal leading-5 tracking-[-0.00643em]",
  bodyXs: "font-sans text-[0.75rem] font-normal leading-5",

  // Overline — Inter, uppercase (section subtitles, sidebar categories)
  overline: "font-sans text-[0.75rem] font-[550] uppercase leading-4 tracking-[0.166667em]",

  // Navlink — Inter
  navlink: "font-sans text-[0.9375rem] leading-5",
} as const;
