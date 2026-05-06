"use client";

import { useState } from "react";

type ParticipationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (nickname: string) => void;
  isMatching: boolean;
};

export function ParticipationDialog({
  open,
  onOpenChange,
  onSubmit,
  isMatching,
}: ParticipationDialogProps) {
  const [nickname, setNickname] = useState("");

  if (!open) {
    return null;
  }

  function handleSubmit() {
    const trimmed = nickname.trim();

    if (trimmed) {
      onSubmit(trimmed);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={() => onOpenChange(false)}>
      <section
        className="participation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="participation-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {!isMatching ? (
          <>
            <button
              type="button"
              className="modal-close"
              aria-label="닫기"
              onClick={() => onOpenChange(false)}
            >
              ×
            </button>
            <h2 id="participation-title">파티 참여 신청</h2>
            <p>작성자에게 전달될 닉네임을 입력해주세요.</p>

            <label className="nickname-field" htmlFor="nickname">
              <span>닉네임</span>
              <input
                id="nickname"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSubmit();
                  }
                }}
                placeholder="닉네임을 입력하세요"
              />
            </label>

            <button
              type="button"
              className="modal-submit"
              disabled={!nickname.trim()}
              onClick={handleSubmit}
            >
              참여하기
            </button>
          </>
        ) : (
          <div className="matching-state">
            <h2>매칭 중</h2>
            <p>작성자의 수락을 기다리고 있습니다...</p>
            <div className="spinner" aria-hidden="true" />
            <span>곧 응답을 받을 수 있습니다</span>
          </div>
        )}
      </section>
    </div>
  );
}
