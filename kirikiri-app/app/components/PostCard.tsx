import Link from "next/link";
import type { Post } from "../data/mockPosts";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`} className="post-card">
      <div className="post-card-top">
        <h3>{post.title}</h3>
        <span className={post.category === "게임" ? "post-badge game" : "post-badge study"}>{post.category}</span>
      </div>

      <p className="post-subtitle">{post.category === "게임" ? post.gameName : post.studyName}</p>

      <div className="post-meta">
        <span aria-hidden="true">◎</span>
        <span>{post.targetScore}</span>
      </div>

      <div className="post-meta">
        <span aria-hidden="true">♙</span>
        <span>
          {post.currentMembers}/{post.maxMembers}명
        </span>
      </div>

      <p className="post-description">{post.description}</p>
    </Link>
  );
}
