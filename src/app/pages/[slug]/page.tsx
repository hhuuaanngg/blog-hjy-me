import { permanentRedirect } from "next/navigation";

import { getAllPages } from "@/lib/content/pages";

type StaticPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllPages().map((page) => ({
    slug: page.slug
  }));
}

export default async function StaticPage({ params }: StaticPageProps) {
  const { slug } = await params;
  permanentRedirect(`/${slug}`);
}
