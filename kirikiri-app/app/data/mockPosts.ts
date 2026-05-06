export type PostCategory = "게임" | "공부";

export interface Post {
  id: string;
  title: string;
  category: PostCategory;
  gameName?: string;
  studyName?: string;
  authorTier: string;
  targetScore: string;
  description: string;
  openChatLink: string;
  author: string;
  currentMembers: number;
  maxMembers: number;
  createdAt: string;
  participants: Array<{
    id: string;
    nickname: string;
    status: "pending" | "accepted" | "rejected";
  }>;
}

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "롤 듀오 구함",
    category: "게임",
    gameName: "리그 오브 레전드",
    authorTier: "다이아몬드 3",
    targetScore: "마스터 승급",
    description: "정글 or 서폿 포지션 선호합니다. 편하게 즐기면서 랭크 올릴 분 구합니다!",
    openChatLink: "https://open.kakao.com/example1",
    author: "SummonerKing",
    currentMembers: 1,
    maxMembers: 2,
    createdAt: "2026-03-25",
    participants: [],
  },
  {
    id: "2",
    title: "한능검 스터디 구함",
    category: "공부",
    studyName: "한국사능력검정시험",
    authorTier: "2급 보유",
    targetScore: "1급 합격",
    description: "매주 월/목 저녁 8시 온라인 스터디. 함께 공부하며 목표 달성해요!",
    openChatLink: "https://open.kakao.com/example2",
    author: "역사왕",
    currentMembers: 2,
    maxMembers: 5,
    createdAt: "2026-03-24",
    participants: [],
  },
  {
    id: "3",
    title: "발로란트 5스택 모집",
    category: "게임",
    gameName: "발로란트",
    authorTier: "플래티넘 1",
    targetScore: "다이아 달성",
    description: "엔트리스트, 컨트롤러 유저 구합니다. 분위기 좋게 즐겨요!",
    openChatLink: "https://open.kakao.com/example3",
    author: "ValorantPro",
    currentMembers: 3,
    maxMembers: 5,
    createdAt: "2026-03-25",
    participants: [],
  },
  {
    id: "4",
    title: "토익 900+ 스터디",
    category: "공부",
    studyName: "TOEIC",
    authorTier: "850점",
    targetScore: "900점 이상",
    description: "주 3회 RC/LC 집중 학습. 진지하게 목표 달성하실 분만!",
    openChatLink: "https://open.kakao.com/example4",
    author: "EnglishMaster",
    currentMembers: 4,
    maxMembers: 6,
    createdAt: "2026-03-23",
    participants: [],
  },
  {
    id: "5",
    title: "오버워치2 경쟁전 듀오 모집",
    category: "게임",
    gameName: "오버워치 2",
    authorTier: "골드 2",
    targetScore: "플래티넘 진입",
    description: "탱커/딜러 구해요. 화내지 않고 같이 티어 올립시다",
    openChatLink: "https://open.kakao.com/example5",
    author: "OverwatchHero",
    currentMembers: 2,
    maxMembers: 6,
    createdAt: "2026-03-25",
    participants: [],
  },
  {
    id: "6",
    title: "정보처리기사 실기 스터디",
    category: "공부",
    studyName: "정보처리기사",
    authorTier: "필기 합격",
    targetScore: "실기 합격",
    description: "실기 준비 같이 하실 분. 매일 문제 풀이 & 코드 리뷰",
    openChatLink: "https://open.kakao.com/example6",
    author: "DevStudy",
    currentMembers: 3,
    maxMembers: 4,
    createdAt: "2026-03-22",
    participants: [],
  },
  {
    id: "7",
    title: "배틀그라운드 스쿼드 구함",
    category: "게임",
    gameName: "배틀그라운드",
    authorTier: "다이아 4",
    targetScore: "마스터 달성",
    description: "전략 플레이 선호! 치킨 먹으러 가요",
    openChatLink: "https://open.kakao.com/example7",
    author: "PubgKing",
    currentMembers: 2,
    maxMembers: 4,
    createdAt: "2026-03-24",
    participants: [],
  },
  {
    id: "8",
    title: "공무원 9급 스터디",
    category: "공부",
    studyName: "공무원 시험",
    authorTier: "재수생",
    targetScore: "9급 합격",
    description: "행정직 준비 중. 서로 응원하며 함께 합격해요",
    openChatLink: "https://open.kakao.com/example8",
    author: "공시생",
    currentMembers: 5,
    maxMembers: 8,
    createdAt: "2026-03-21",
    participants: [],
  },
];

export function getPostById(id: string) {
  return mockPosts.find((post) => post.id === id);
}
