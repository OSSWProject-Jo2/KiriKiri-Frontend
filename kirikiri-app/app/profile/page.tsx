import type { Metadata } from "next";
import { ProfilePage } from "../components/ProfilePage";

export const metadata: Metadata = {
  title: "프로필 | 키리키리",
  description: "프로필 정보를 확인합니다.",
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
