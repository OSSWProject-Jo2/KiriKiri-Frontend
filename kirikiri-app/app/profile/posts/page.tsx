import type { Metadata } from "next";
import { ManagedPostsPage } from "../../components/ManagedPostsPage";

export const metadata: Metadata = {
  title: "게시글 관리 | 키리키리",
  description: "내가 만든 모집글을 관리합니다.",
};

export default function ManagedPostsRoute() {
  return <ManagedPostsPage />;
}
