import { permanentRedirect } from "next/navigation";

import { getAllPosts } from "@/lib/content/posts";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  permanentRedirect(`/${slug}`);
}
