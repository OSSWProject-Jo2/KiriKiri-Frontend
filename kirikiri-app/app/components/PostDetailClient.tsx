"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Post } from "../data/mockPosts";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { ParticipationDialog } from "../components/ParticipationDialog";
import { MatchSuccessDialog } from "../components/MatchSuccessDialog";
import { useAuth } from "../components/auth/ClerkAuthProvider";
import {
  notifyPostDeletedMock,
  type Applicant,
} from "../lib/mockApi";
import {
  acceptApplicant,
  deletePost,
  getApplicants,
  getMyApplication,
  getPost,
  joinPost,
} from "../lib/api";
import {
  ArrowLeft,
  Users,
  Target,
  Calendar,
  User,
  Lock,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { Toaster, toast } from "sonner";

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

type PostDetailClientProps = {
  post?: Post;
  postId?: string;
};

export function PostDetailClient({ post: initialPost, postId }: PostDetailClientProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | undefined>(initialPost);
  const [hasCheckedSavedPost, setHasCheckedSavedPost] = useState(
    Boolean(initialPost),
  );
  const [showParticipationDialog, setShowParticipationDialog] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successOpenChatLink, setSuccessOpenChatLink] = useState("");
  const [myOpenChatLink, setMyOpenChatLink] = useState<string | null>(null); // 수락 후 공개되는 링크
  const [myApplicationStatus, setMyApplicationStatus] = useState<string | null>(null); // 내 신청 상태
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [acceptingApplicantId, setAcceptingApplicantId] = useState<string | null>(
    null,
  );
  const { isSignedIn, nickname, openSignIn, getToken } = useAuth();
  const isFull = Boolean(post && post.currentMembers >= post.maxMembers);
  const isAuthor = Boolean(isSignedIn && nickname && post?.author === nickname);

  useEffect(() => {
    if (initialPost || !postId) {
      return;
    }

    let isActive = true;
    const requestedPostId = postId;

    async function loadPost() {
      try {
        const nextPost = await getPost(requestedPostId);
        if (isActive) {
          setPost(nextPost);
        }
      } catch {
        if (isActive) {
          setPost(undefined);
        }
      } finally {
        if (isActive) {
          setHasCheckedSavedPost(true);
        }
      }
    }

    void loadPost();

    return () => {
      isActive = false;
    };
  }, [initialPost, postId]);

  useEffect(() => {
    if (!post?.id || !isAuthor) {
      return;
    }

    let isActive = true;
    const currentPostId = post.id;

    async function loadApplicants() {
      try {
        const token = await getToken();
        const nextApplicants = await getApplicants(currentPostId, token);

        if (isActive) {
          setApplicants(nextApplicants);
        }
      } catch {
        if (isActive) {
          setApplicants([]);
        }
      }
    }

    void loadApplicants();

    return () => {
      isActive = false;
    };
  }, [getToken, isAuthor, post?.id]);

  // 내 신청 상태 조회 - 수락됐을 때 오픈채팅 링크를 "신청 후 공개" 섹션에 표시
  useEffect(() => {
    if (!post?.id || !isSignedIn || isAuthor) {
      return;
    }

    let isActive = true;
    const currentPostId = post.id;

    async function loadMyApplication() {
      try {
        const token = await getToken();
        const result = await getMyApplication(currentPostId, token);
        if (isActive) {
          setMyApplicationStatus(result.status);
          setMyOpenChatLink(result.openChatLink);
        }
      } catch {
        // 신청 내역 없으면 무시
      }
    }

    void loadMyApplication();

    return () => {
      isActive = false;
    };
  }, [getToken, isAuthor, isSignedIn, post?.id]);

  if (!post && !hasCheckedSavedPost) {
    return (
      <div className="min-h-screen max-w-[480px] mx-auto bg-[#F8F7FF] px-5 py-10">
        <Link
          href="/"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          목록
        </Link>
        <div className="mt-24 rounded-[28px] bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-500">모집글을 불러오는 중</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen max-w-[480px] mx-auto bg-[#F8F7FF] px-5 py-10">
        <Link
          href="/"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          목록
        </Link>
        <div className="mt-24 rounded-[28px] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">
            모집글을 찾을 수 없어요
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            삭제되었거나 현재 브라우저에 저장되지 않은 글입니다.
          </p>
        </div>
      </div>
    );
  }

  const topicLabel = post.topicName || post.gameName || post.studyName || post.category;
  const participationDisabled = isFull || isAuthor;
  const pendingApplicants = applicants.filter(
    (applicant) => applicant.status === "pending",
  );

  const handleParticipation = async () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    if (isAuthor) {
      setShowParticipationDialog(false);
      toast.error("내가 작성한 글에는 신청할 수 없어요.");
      return;
    }

    const userNickname = nickname || "익명";

    setIsMatching(true);

    try {
      const token = await getToken();
      const res = await joinPost(post.id, { nickname: userNickname }, token);
      if (!res.success) {
        throw new Error(res.error || "신청 실패");
      }

      setShowParticipationDialog(false);
      setSuccessOpenChatLink(res.openChatLink || post.openChatLink);
      setShowSuccessDialog(true);
      toast.success(`${userNickname}님, 참여 신청이 완료되었습니다!`);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "참여 중 오류가 발생했습니다.",
      );
    } finally {
      setIsMatching(false);
    }
  };

  const handleAcceptApplicant = async (applicantId: string) => {
    setAcceptingApplicantId(applicantId);

    try {
      const token = await getToken();
      const res = await acceptApplicant(post.id, applicantId, token);

      if (!res.success) {
        throw new Error(res.error || "수락 중 오류가 발생했습니다.");
      }

      const [nextPost, nextApplicants] = await Promise.all([
        getPost(post.id),
        getApplicants(post.id, token),
      ]);

      setPost(nextPost);
      setApplicants(nextApplicants);
      toast.success("신청을 수락하고 인원 수를 갱신했어요.");
      router.refresh();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "수락 중 오류가 발생했습니다.",
      );
    } finally {
      setAcceptingApplicantId(null);
    }
  };

  const handleDeletePost = async () => {
    if (!isAuthor) {
      toast.error("작성자만 삭제할 수 있어요.");
      return;
    }

    const confirmed = window.confirm("이 모집글을 삭제할까요?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const token = await getToken();
      await deletePost(post.id, token);
      notifyPostDeletedMock(post, nickname || post.author);
      toast.success("모집글을 삭제했어요.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("모집글 삭제에 실패했어요. 잠시 후 다시 시도해주세요.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen max-w-[480px] mx-auto bg-[#F8F7FF] pb-28">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-transparent px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            목록
          </Link>

          <Badge className="rounded-full px-3 py-1 bg-violet-100 text-violet-700 hover:bg-violet-100">
            {post.category}
          </Badge>
        </div>
      </header>

      <motion.main
        className="px-5 pt-6"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Card className="overflow-hidden rounded-[32px] border-0 shadow-xl bg-white">
          <div className="p-6 bg-gradient-to-br from-slate-950 to-violet-800 text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-sm text-white/75">{topicLabel}</span>
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
                value={myOpenChatLink ?? (myApplicationStatus === "pending" ? "수락 대기 중" : "신청 후 공개")}
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
                  신청 완료 후 오픈채팅 링크가 바로 공개됩니다.
                </p>
              </div>
            </section>

            {isAuthor ? (
              <section className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-4 rounded-2xl border border-red-100 bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-black text-slate-950">
                        모집글 관리
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        작성한 모집글을 삭제할 수 있어요.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleDeletePost}
                      disabled={isDeleting}
                      className="h-10 shrink-0 rounded-2xl bg-red-500 px-4 text-sm text-white hover:bg-red-600 disabled:opacity-60"
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      {isDeleting ? "삭제 중" : "삭제"}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-black text-slate-950">
                    신청자 관리
                  </h2>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-violet-700">
                    {pendingApplicants.length}명 대기
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {applicants.length > 0 ? (
                    applicants.map((applicant) => (
                      <div
                        key={applicant.id}
                        className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {applicant.nickname}
                          </p>
                          <p className="text-xs text-slate-400">
                            {applicant.status === "accepted"
                              ? "수락 완료"
                              : "수락 대기"}
                          </p>
                        </div>
                        {applicant.status === "accepted" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            수락됨
                          </span>
                        ) : (
                          <Button
                            className="h-10 shrink-0 rounded-2xl bg-violet-600 px-4 text-sm hover:bg-violet-700"
                            onClick={() => handleAcceptApplicant(applicant.id)}
                            disabled={isFull || acceptingApplicantId !== null}
                          >
                            {acceptingApplicantId === applicant.id
                              ? "수락 중"
                              : "수락"}
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="rounded-2xl bg-white p-4 text-center text-sm text-slate-500">
                      아직 신청자가 없어요.
                    </p>
                  )}
                </div>
              </section>
            ) : null}
          </div>
        </Card>
      </motion.main>

      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="max-w-[480px] mx-auto p-4 bg-white/90 backdrop-blur-md border-t border-slate-100">
          <Button
            size="lg"
            className="w-full h-14 rounded-2xl text-base font-bold bg-violet-600 hover:bg-violet-700"
            onClick={() => setShowParticipationDialog(true)}
            disabled={participationDisabled}
          >
            {isAuthor ? "내가 작성한 글" : isFull ? "모집 마감" : "참여하기"}
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
        openChatLink={successOpenChatLink || post.openChatLink}
      />
      <Toaster position="top-center" richColors />
    </div>
  );
}
