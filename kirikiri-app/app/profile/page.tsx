import type { Metadata } from "next";
import { ProfilePage } from "../components/ProfilePage";

export const metadata: Metadata = {
  title: "관리 | 키리키리",
  description: "키리키리 관리 메뉴입니다.",
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
