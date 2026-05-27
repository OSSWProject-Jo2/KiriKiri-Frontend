import { getSavedPostById } from "../data/postStorage";
import { getPostById } from "../data/mockPosts";

export type JoinResponse = {
  success: boolean;
  openChatLink?: string;
  error?: string;
};

const APPLICANTS_KEY = "kirikiri_applicants";

function loadApplicants(): Record<string, Array<Record<string, unknown>>> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(APPLICANTS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveApplicants(obj: Record<string, Array<Record<string, unknown>>>) {
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

      if (post.currentMembers >= post.maxMembers) {
        resolve({ success: false, error: "모집 마감" });
        return;
      }

      const applicants = loadApplicants();
      applicants[postId] = applicants[postId] || [];

      const already = applicants[postId].some(
        (a: any) => String(a.nickname || "") === String(nickname || ""),
      );

      if (already) {
        resolve({ success: false, error: "이미 신청하셨습니다." });
        return;
      }

      const applicant = {
        id: String(Date.now()),
        nickname,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      applicants[postId].push(applicant);
      saveApplicants(applicants);

      // 개발 편의를 위한 링크 반환
      resolve({ success: true, openChatLink: post.openChatLink });
    }, 700);
  });
}

export function getApplicantsMock(postId: string) {
  const applicants = loadApplicants();
  return applicants[postId] || [];
}
