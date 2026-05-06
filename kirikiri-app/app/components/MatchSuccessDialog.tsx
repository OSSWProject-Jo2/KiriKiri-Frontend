"use client";

type MatchSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  openChatLink: string;
};

export function MatchSuccessDialog({ open, onOpenChange, openChatLink }: MatchSuccessDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={() => onOpenChange(false)}>
      <section
        className="success-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-success-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="success-icon" aria-hidden="true">
          ✓
        </div>
        <h2 id="match-success-title">매칭 성공!</h2>
        <p>작성자가 신청을 수락했습니다.</p>
        <button type="button" className="join-button" onClick={() => window.open(openChatLink, "_blank")}>
          오픈채팅 참여하기
        </button>
      </section>
    </div>
  );
}
