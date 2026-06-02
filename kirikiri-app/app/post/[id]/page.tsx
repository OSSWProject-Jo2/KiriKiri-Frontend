import type { Metadata } from "next";
import { PostDetailClient } from "../../components/PostDetailClient";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await params;

  return {
    title: "모집글 | 키리키리",
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <PostDetailClient postId={id} />;
}
