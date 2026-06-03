import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

type MatchSuccessDialogProps = {
  open: boolean;
  openChatLink: string;
  onOpenChange: (open: boolean) => void;
};

export function MatchSuccessDialog({
  open,
  openChatLink,
  onOpenChange,
}: MatchSuccessDialogProps) {
  if (!open) return null;

  const hasOpenChatLink = openChatLink.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 px-4 pb-5">
      <div className="w-full max-w-[448px] rounded-[28px] bg-white p-5 shadow-2xl">
        <h2 className="text-xl font-black text-slate-950">신청 완료!</h2>
        {/* 수락 후 링크 공개 방식 - 링크가 있으면 바로 입장, 없으면 수락 대기 안내 */}
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {hasOpenChatLink
            ? "참여 신청이 완료되었습니다. 아래 버튼으로 오픈채팅방에 바로 입장할 수 있어요."
            : "참여 신청이 완료되었습니다. 작성자가 수락하면 이 페이지에서 오픈채팅 링크를 확인할 수 있어요."}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            className="h-12 rounded-2xl"
            onClick={() => onOpenChange(false)}
          >
            닫기
          </Button>
          <Button
            className="h-12 rounded-2xl gap-2 bg-violet-600 hover:bg-violet-700"
            disabled={!hasOpenChatLink}
            onClick={() => window.open(openChatLink, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink className="w-4 h-4" />
            오픈채팅 열기
          </Button>
        </div>
      </div>
    </div>
  );
}
