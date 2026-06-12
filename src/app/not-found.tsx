import Link from "next/link";
import { fontInter } from "@/fonts";

/**
 * Custom 404 page scoped to .site wrapper so it inherits the dark theme
 * and doesn't flash white (default Next.js 404 has no .site wrapper).
 */
export default function NotFound() {
  return (
    <div
      className={[
        "site",
        fontInter.variable,
        "min-h-svh bg-background text-muted-foreground",
        "font-sans text-base font-normal antialiased",
        "flex flex-col items-center justify-center gap-6 px-4",
      ].join(" ")}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        404
      </p>
      <h1 className="text-foreground text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground text-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-2 text-sm text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
      >
        Back to home
      </Link>
    </div>
  );
}
