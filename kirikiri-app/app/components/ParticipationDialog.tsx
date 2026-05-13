import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type ParticipationDialogProps = {
  open: boolean;
  isMatching: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (nickname: string) => void;
};

export function ParticipationDialog({
  open,
  isMatching,
  onOpenChange,
  onSubmit,
}: ParticipationDialogProps) {
  const [nickname, setNickname] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    const trimmed = nickname.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 px-4 pb-5">
      <div className="w-full max-w-[448px] rounded-[28px] bg-white p-5 shadow-2xl">
        <h2 className="text-xl font-black text-slate-950">ì°¸ì—¬ ?‹ ì²?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          ?‘?„±??—ê²? ? „?‹¬?•  ?‹‰?„¤?„?„ ?…? ¥?•´ì£¼ì„¸?š”.
        </p>

        <Input
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="?‹‰?„¤?„"
          className="mt-5 h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base"
          disabled={isMatching}
        />

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            className="h-12 rounded-2xl"
            onClick={() => onOpenChange(false)}
            disabled={isMatching}
          >
            ì·¨ì†Œ
          </Button>
          <Button
            className="h-12 rounded-2xl bg-violet-600 hover:bg-violet-700"
            onClick={handleSubmit}
            disabled={isMatching || nickname.trim() === ""}
          >
            {isMatching ? "?‹ ì²? ì¤?..." : "?‹ ì²??•˜ê¸?"}
          </Button>
        </div>
      </div>
    </div>
  );
}
