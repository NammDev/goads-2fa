import { Inter } from "next/font/google";

// Inter with optical size axis for display headings.
// opsz axis enables the "Inter Display" look at large sizes (tighter, condensed).
export const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  axes: ["opsz"],
});
