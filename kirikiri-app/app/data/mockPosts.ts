export type PostCategory = string;

export type Post = {
  id: string;
  category: PostCategory;
  title: string;
  description: string;
  author: string;
  authorTier: string;
  currentMembers: number;
  maxMembers: number;
  targetScore: string;
  createdAt: string;
  openChatLink: string;
  topicName?: string;
  gameName?: string;
  studyName?: string;
};

export const mockPosts: Post[] = [
  {
    id: "1",
    category: "게임",
    title: "롤 자유랭 같이 올릴 파티 구해요",
    description:
      "저녁 시간대에 꾸준히 같이 할 분들을 찾습니다. 분위기 좋게 피드백하면서 목표 티어까지 같이 올라가요.",
    author: "파티장",
    authorTier: "골드 II",
    currentMembers: 3,
    maxMembers: 5,
    targetScore: "플래티넘",
    createdAt: "2026.05.06",
    openChatLink: "https://open.kakao.com/o/example1",
    topicName: "리그 오브 레전드",
    gameName: "리그 오브 레전드",
  },
  {
    id: "2",
    category: "공부",
    title: "정보처리기사 필기 스터디 모집",
    description:
      "기출 문제와 오답 정리를 같이 할 스터디원을 모집합니다. 주 3회 온라인으로 진행할 예정입니다.",
    author: "스터디장",
    authorTier: "꾸준함 Lv.8",
    currentMembers: 4,
    maxMembers: 6,
    targetScore: "필기 합격",
    createdAt: "2026.05.05",
    openChatLink: "https://open.kakao.com/o/example2",
    topicName: "정보처리기사",
    studyName: "정보처리기사",
  },
  {
    id: "3",
    category: "운동",
    title: "퇴근 후 러닝 크루 같이 해요",
    description:
      "주 2회 한강 근처에서 가볍게 뛰는 모임입니다. 처음 시작하는 분도 편하게 오셔도 됩니다.",
    author: "러닝메이트",
    authorTier: "꾸준함 Lv.5",
    currentMembers: 2,
    maxMembers: 8,
    targetScore: "5km 완주",
    createdAt: "2026.05.04",
    openChatLink: "https://open.kakao.com/o/example3",
    topicName: "러닝",
  },
];

export function getPostById(id: string) {
  return mockPosts.find((post) => post.id === id);
}
