import { Lock, Sparkles, Users } from "lucide-react";
import type { Post } from "../data/mockPosts";

type PostCardProps = {
  post: Post;
  onClick?: () => void;
};

function getTopicLabel(post: Post) {
  return post.topicName || post.gameName || post.studyName || post.category;
}

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <article
      onClick={onClick}
      className="rounded-[28px] bg-white p-5 shadow-sm border border-slate-100 active:scale-[0.99] transition-transform"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-bold text-violet-600">
            <Sparkles className="w-4 h-4" />
            <span>{getTopicLabel(post)}</span>
          </div>
          <h3 className="mt-3 text-lg font-black leading-snug text-slate-950">
            {post.title}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
          {post.category}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
        {post.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          {post.currentMembers}/{post.maxMembers}명
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock className="w-4 h-4" />
          수락 후 공개
        </span>
      </div>
    </article>
  );
}
