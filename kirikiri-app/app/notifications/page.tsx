import type { Metadata } from "next";
import { NotificationsPage } from "../components/NotificationsPage";

export const metadata: Metadata = {
  title: "알림 | 키리키리",
  description: "참여 신청과 수락 알림을 확인합니다.",
};

export default function NotificationsRoute() {
  return <NotificationsPage />;
}
