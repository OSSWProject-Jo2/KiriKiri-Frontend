import { getSavedPostById } from "../data/postStorage";
import { getPostById } from "../data/mockPosts";
import { addNotification } from "../data/notificationStorage";

export type JoinResponse = {
  success: boolean;
  openChatLink?: string;
  error?: string;
};

const APPLICANTS_KEY = "kirikiri_applicants";

export type Applicant = {
  id: string;
  nickname: string;
  status: "pending" | "accepted";
  createdAt: string;
};

function loadApplicants(): Record<string, Applicant[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(APPLICANTS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveApplicants(obj: Record<string, Applicant[]>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(APPLICANTS_KEY, JSON.stringify(obj));
}

export async function joinPostMock(postId: string, nickname: string): Promise<JoinResponse> {
 
  // 네트워크 지연 시간 시뮬레이션
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = getSavedPostById(postId) || getPostById(postId);

      if (!post) {
        resolve({ success: false, error: "모집글을 찾을 수 없습니다." });
        return;
      }

      if (post.author === nickname) {
        resolve({
          success: false,
          error: "내가 작성한 글에는 신청할 수 없어요.",
        });
        return;
      }

      if (post.currentMembers >= post.maxMembers) {
        resolve({ success: false, error: "모집 마감" });
        return;
      }

      const applicants = loadApplicants();
      applicants[postId] = applicants[postId] || [];

      const already = applicants[postId].some(
        (applicant) =>
          String(applicant.nickname || "") === String(nickname || ""),
      );

      if (already) {
        resolve({ success: false, error: "이미 신청하셨습니다." });
        return;
      }

      const applicant: Applicant = {
        id: String(Date.now()),
        nickname,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      applicants[postId].push(applicant);
      saveApplicants(applicants);
      addNotification({
        kind: "application",
        postId,
        postTitle: post.title,
        recipientNickname: post.author,
        actorNickname: nickname,
        message: `${nickname}님이 "${post.title}"에 참여 신청했어요.`,
      });

      // 개발 편의를 위한 링크 반환
      resolve({ success: true, openChatLink: post.openChatLink });
    }, 700);
  });
}

export function getApplicantsMock(postId: string) {
  const applicants = loadApplicants();
  return applicants[postId] || [];
}

export function acceptApplicantMock(postId: string, applicantId: string) {
  const post = getSavedPostById(postId) || getPostById(postId);
  const applicants = loadApplicants();
  const postApplicants = applicants[postId] || [];
  const applicant = postApplicants.find((item) => item.id === applicantId);

  if (!post || !applicant) {
    return { success: false, error: "신청 정보를 찾을 수 없어요." };
  }

  applicant.status = "accepted";
  saveApplicants(applicants);
  addNotification({
    kind: "accepted",
    postId,
    postTitle: post.title,
    recipientNickname: applicant.nickname,
    actorNickname: post.author,
    message: `"${post.title}" 참여 신청이 수락되었어요.`,
    openChatLink: post.openChatLink,
  });

  return { success: true };
}
