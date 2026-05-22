import { Button } from "./ui/button";

type ParticipationDialogProps = {
  open: boolean;
  isMatching: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
};

export function ParticipationDialog({
  open,
  isMatching,
  onOpenChange,
  onSubmit,
}: ParticipationDialogProps) {
  if (!open) return null;

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 px-4 pb-5">
      <div className="w-full max-w-[448px] rounded-[28px] bg-white p-5 shadow-2xl">
        <h2 className="text-xl font-black text-slate-950">참여 신청</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          로그인한 닉네임으로 자동 등록됩니다. 확인 후 신청해주세요.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            className="h-12 rounded-2xl"
            onClick={() => onOpenChange(false)}
            disabled={isMatching}
          >
            취소
          </Button>
          <Button
            className="h-12 rounded-2xl bg-violet-600 hover:bg-violet-700"
            onClick={handleSubmit}
            disabled={isMatching}
          >
            {isMatching ? "신청 중..." : "신청하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
