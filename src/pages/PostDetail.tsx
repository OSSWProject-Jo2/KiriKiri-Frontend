import { useState, useEffect, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router";
import { mockPosts } from "../data/mockPosts";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { ParticipationDialog } from "../components/ParticipationDialog";
import { MatchSuccessDialog } from "../components/MatchSuccessDialog";
import {
  ArrowLeft,
  Users,
  Target,
  Trophy,
  Calendar,
  User,
  Lock,
  Gamepad2,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

type InfoItemProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-violet-600">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [showParticipationDialog, setShowParticipationDialog] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const post = mockPosts.find((p) => p.id === id);

  useEffect(() => {
    if (!post) navigate("/");
  }, [post, navigate]);

  if (!post) return null;

  const isFull = post.currentMembers >= post.maxMembers;

  const handleParticipation = (nickname: string) => {
    setIsMatching(true);

    setTimeout(() => {
      setIsMatching(false);
      setShowParticipationDialog(false);
      toast.success(`${nickname}님, 참여 신청이 완료되었습니다!`);

      setTimeout(() => {
        setShowSuccessDialog(true);
      }, 1500);
    }, 2500);
  };

  return (
    <div className="min-h-screen max-w-[480px] mx-auto bg-[#F8F7FF] pb-28">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            목록
          </Button>

          <Badge className="rounded-full px-3 py-1 bg-violet-100 text-violet-700 hover:bg-violet-100">
            {post.category}
          </Badge>
        </div>
      </header>

      <motion.main
        className="px-5 pt-6"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Card className="overflow-hidden rounded-[32px] border-0 shadow-xl bg-white">
          <div className="p-6 bg-gradient-to-br from-slate-950 to-violet-800 text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                {post.category === "게임" ? (
                  <Gamepad2 className="w-5 h-5" />
                ) : (
                  <BookOpen className="w-5 h-5" />
                )}
              </div>
              <span className="text-sm text-white/75">
                {post.category === "게임" ? post.gameName : post.studyName}
              </span>
            </div>

            <h1 className="text-3xl font-black leading-tight">{post.title}</h1>

            <div className="mt-5 flex items-center gap-2 text-sm text-white/80">
              <Users className="w-4 h-4" />
              <span>
                현재 {post.currentMembers}명 / 최대 {post.maxMembers}명
              </span>
            </div>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 gap-3">
              <InfoItem
                icon={<User className="w-5 h-5" />}
                label="작성자"
                value={post.author}
              />

              <InfoItem
                icon={<Trophy className="w-5 h-5" />}
                label="작성자 티어"
                value={post.authorTier}
              />

              <InfoItem
                icon={<Target className="w-5 h-5" />}
                label="목표"
                value={post.targetScore}
              />

              <InfoItem
                icon={<Calendar className="w-5 h-5" />}
                label="작성일"
                value={post.createdAt}
              />

              <InfoItem
                icon={<Lock className="w-5 h-5" />}
                label="오픈채팅 링크"
                value="수락 후 공개"
              />
            </div>

            <Separator className="my-6" />

            <section>
              <h2 className="text-lg font-black text-slate-950 mb-3">
                상세 설명
              </h2>
              <p className="text-sm leading-7 text-slate-600">
                {post.description}
              </p>
            </section>

            <section className="mt-6 p-4 rounded-2xl bg-violet-50 border border-violet-100">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-violet-600 mt-0.5" />
                <p className="text-sm leading-6 text-violet-800">
                  참여 신청을 하면 작성자에게 닉네임이 전달되고,
                  작성자가 수락하면 오픈채팅 링크가 공개됩니다.
                </p>
              </div>
            </section>
          </div>
        </Card>
      </motion.main>

      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="max-w-[480px] mx-auto p-4 bg-white/90 backdrop-blur-md border-t border-slate-100">
          <Button
            size="lg"
            className="w-full h-14 rounded-2xl text-base font-bold bg-violet-600 hover:bg-violet-700"
            onClick={() => setShowParticipationDialog(true)}
            disabled={isFull}
          >
            {isFull ? "모집 마감" : "참여하기"}
          </Button>
        </div>
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
    </div>
  );
}
