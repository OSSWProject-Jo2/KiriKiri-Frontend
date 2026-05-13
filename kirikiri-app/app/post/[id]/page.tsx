import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostDetailClient } from "../../components/PostDetailClient";
import { getPostById, mockPosts } from "../../data/mockPosts";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return mockPosts.map((post) => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = getPostById(id);

  if (!post) {
    return {
      title: "아직 여기엔 아무도 없나봐요!",
    };
  }

  return {
    title: `${post.title} | 끼리끼리`,
    description: post.description,
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = getPostById(id);

  if (!post) {
    notFound();
  }

  return <PostDetailClient post={post} />;
}
