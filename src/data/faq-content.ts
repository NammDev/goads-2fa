/** FAQ items — single source for FAQ section render and Phase 5 JSON-LD. */

export interface FaqItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is a 2FA code generator?",
    answer:
      "A 2FA code generator creates time-based one-time passwords (TOTP) using the RFC 6238 standard — the same algorithm used by Google Authenticator, Authy, and Microsoft Authenticator. You enter your secret key once and receive a fresh 6-digit code every 30 seconds. This site generates those codes entirely in your browser with no server involved.",
  },
  {
    question: "Is it safe to paste my 2FA secret key here?",
    answer:
      "Yes. All code generation happens 100% client-side using the Web Crypto API built into your browser. Your secret key is never transmitted to any server, never stored in cookies or local storage, and never logged. You can verify this yourself by opening DevTools → Network while generating codes — you will see zero outbound requests. Closing or refreshing the tab wipes everything.",
  },
  {
    question: "Where do I find my 2FA secret key?",
    answer:
      "Your 2FA secret key is the base32 string (typically 16–32 uppercase letters and digits 2–7) shown during the initial 2FA setup on a website. Most platforms display it alongside the QR code under a link like \"Can't scan the QR code?\" or \"Enter key manually\". If you've already scanned the QR code without saving the key, you'll need to disable and re-enable 2FA on that account to access the key again.",
  },
  {
    question: "Why is my code not working?",
    answer:
      "The most common cause is a device clock that is out of sync — TOTP codes are time-sensitive and require your clock to be accurate within roughly 30 seconds. Check that your system time is correct and set to sync automatically. Other causes: a typo in the secret key, using the wrong secret for the account, or trying to use the code after the 30-second window has expired.",
  },
  {
    question: "Can I generate codes for multiple accounts at once?",
    answer:
      "Yes. Paste one secret per line in the textarea. You can also use pipe-separated rows in the format label|SECRET or email@example.com|password|SECRET — the tool extracts the valid base32 secret from each line automatically. Once generated, use \"Copy all\" to copy every code to your clipboard at once, or \"Export\" to download a .txt file with all secret–code pairs.",
  },
  {
    question: "Which services does this work with?",
    answer:
      "This tool works with any service that uses the standard TOTP protocol (RFC 6238), which includes Google, Facebook, Instagram, Microsoft, GitHub, Dropbox, cryptocurrency exchanges, and the vast majority of platforms that offer authenticator-app 2FA. If a service supports Google Authenticator, it works here.",
  },
  {
    question: "Do you store my secret keys?",
    answer:
      "No. There is no server, no database, no cookies for secrets, and no analytics that capture key material. Your secrets exist only in the browser tab while you have it open. Closing the tab or refreshing the page clears everything permanently. This is by design — a tool that handles authentication secrets should never persist them.",
  },
  {
    question: "Who built 2FA.media?",
    answer:
      "2FA.media is a free tool built by GOADS — the agency ad account partner for performance marketers. GOADS provides premium Facebook and Google agency ad accounts, fast top-ups, and real human support to keep campaigns running. This tool is our contribution to the marketing community. Learn more at goadsagency.com.",
  },
]
