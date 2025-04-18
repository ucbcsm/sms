// components/Sidebar.tsx
"use client";
import { Menu } from "antd";
import { useRouter } from "next/navigation";
import {
  HomeOutlined,
  BookOutlined,
  FileDoneOutlined,
  ReloadOutlined,
  FileTextOutlined,
  DollarOutlined,
  CalendarOutlined,
  FormOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ProfileOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const items = [
  { key: "/student", icon: <HomeOutlined />, label: "Accueil" },
  { key: "/student/cours", icon: <BookOutlined />, label: "Cours" },
  { key: "/student/notes", icon: <FileDoneOutlined />, label: "Notes" },
  { key: "/student/reinscription", icon: <ReloadOutlined />, label: "Réinscription" },
  { key: "/student/documents", icon: <FileTextOutlined />, label: "Documents académiques" },
  { key: "/student/finance", icon: <DollarOutlined />, label: "Finance" },
  { key: "/student/presences", icon: <CalendarOutlined />, label: "Présences" },
  { key: "/student/demandes", icon: <FormOutlined />, label: "Demandes académiques" },
  { key: "/student/notifications", icon: <BellOutlined />, label: "Notifications" },
  { key: "/student/evaluations", icon: <CheckCircleOutlined />, label: "Évaluations" },
  { key: "/student/parcours", icon: <ProfileOutlined />, label: "Parcours académiques" },
  { key: "/student/recours", icon: <WarningOutlined />, label: "Recours" },
];

export default function Sidebar() {
  const router = useRouter();
  return (
    <aside className="w-64 bg-white shadow h-full">
      <Menu
        mode="inline"
        defaultSelectedKeys={["/student"]}
        items={items}
        onClick={({ key }) => router.push(key)}
      />
    </aside>
  );
}