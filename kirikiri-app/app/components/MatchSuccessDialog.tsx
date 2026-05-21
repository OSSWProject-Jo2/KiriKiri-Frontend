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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 px-4 pb-5">
      <div className="w-full max-w-[448px] rounded-[28px] bg-white p-5 shadow-2xl">
        <h2 className="text-xl font-black text-slate-950">매칭 성공!</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          작성자가 참여 신청을 수락했습니다. 오픈채팅 링크로 이동해보세요.
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
            onClick={() => window.open(openChatLink, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink className="w-4 h-4" />
            열기
          </Button>
        </div>
      </div>
    </div>
  );
}
