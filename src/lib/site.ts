export const siteConfig = {
  name: "Markdown Blog",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: process.env.NEXT_PUBLIC_SITE_AUTHOR ?? "Joey",
  license: process.env.NEXT_PUBLIC_SITE_LICENSE ?? "CC BY-NC-ND 4.0 DEED"
} as const;
