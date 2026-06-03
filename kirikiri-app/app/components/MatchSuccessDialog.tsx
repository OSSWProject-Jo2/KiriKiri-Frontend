import { Button } from "./ui/button";

type MatchSuccessDialogProps = {
  open: boolean;
  openChatLink: string;
  onOpenChange: (open: boolean) => void;
};

// 신청 직후 팝업 - 수락 후 링크 공개이므로 닫기 버튼만 표시
export function MatchSuccessDialog({
  open,
  onOpenChange,
}: MatchSuccessDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 px-4 pb-5">
      <div className="w-full max-w-[448px] rounded-[28px] bg-white p-5 shadow-2xl">
        <h2 className="text-xl font-black text-slate-950">신청 완료!</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          참여 신청이 완료되었습니다. 작성자가 수락하면 이 페이지에서 오픈채팅 링크를 확인할 수 있어요.
        </p>

        <div className="mt-5">
          <Button
            variant="ghost"
            className="h-12 w-full rounded-2xl"
            onClick={() => onOpenChange(false)}
          >
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
