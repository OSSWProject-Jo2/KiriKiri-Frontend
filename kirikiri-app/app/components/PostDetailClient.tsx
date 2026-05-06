"use client";

import Link from "next/link";
import { useState } from "react";
import type { Post } from "../data/mockPosts";
import { MatchSuccessDialog } from "./MatchSuccessDialog";
import { ParticipationDialog } from "./ParticipationDialog";

type PostDetailClientProps = {
  post: Post;
};

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="detail-info-item">
      <div className="detail-info-icon" aria-hidden="true">
        {icon}
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export function PostDetailClient({ post }: PostDetailClientProps) {
  const [showParticipationDialog, setShowParticipationDialog] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const isFull = post.currentMembers >= post.maxMembers;

  function handleParticipation() {
    setIsMatching(true);

    window.setTimeout(() => {
      setIsMatching(false);
      setShowParticipationDialog(false);
      setShowSuccessDialog(true);
    }, 900);
  }

  return (
    <main className="mobile-app detail-app">
      <header className="detail-header">
        <Link href="/" className="back-button">
          <span aria-hidden="true">←</span>
          목록
        </Link>
        <span className="detail-category">{post.category}</span>
      </header>

      <section className="detail-content">
        <article className="detail-card">
          <div className="detail-hero">
            <div className="detail-kind">
              <span className="detail-kind-icon" aria-hidden="true">
                {post.category === "게임" ? "🎮" : "📖"}
              </span>
              <span>{post.category === "게임" ? post.gameName : post.studyName}</span>
            </div>

            <h1>{post.title}</h1>

            <div className="detail-members">
              <span aria-hidden="true">♙</span>
              <span>
                현재 {post.currentMembers}명 / 최대 {post.maxMembers}명
              </span>
            </div>
          </div>

          <div className="detail-body">
            <div className="detail-info-grid">
              <InfoItem icon="♙" label="작성자" value={post.author} />
              <InfoItem icon="♕" label="작성자 티어" value={post.authorTier} />
              <InfoItem icon="◎" label="목표" value={post.targetScore} />
              <InfoItem icon="▣" label="작성일" value={post.createdAt} />
            </div>

            <hr className="detail-separator" />

            <section className="detail-description">
              <h2>상세 설명</h2>
              <p>{post.description}</p>
            </section>

            <section className="notice-box">
              <span aria-hidden="true">♧</span>
              <p>참여 신청을 하면 작성자에게 닉네임이 전달되고, 작성자가 수락하면 오픈채팅 링크가 공개됩니다.</p>
            </section>
          </div>
        </article>
      </section>

      <div className="bottom-action">
        <button
          type="button"
          className="join-button"
          disabled={isFull}
          onClick={() => setShowParticipationDialog(true)}
        >
          {isFull ? "모집 마감" : "참여하기"}
        </button>
      </div>

      <ParticipationDialog
        open={showParticipationDialog}
        onOpenChange={setShowParticipationDialog}
        onSubmit={handleParticipation}
        isMatching={isMatching}
      />

      <MatchSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        openChatLink={post.openChatLink}
      />
    </main>
  );
}
