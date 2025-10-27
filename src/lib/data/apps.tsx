import { AppItem } from "@/types";
import {
  BulbOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  FolderOutlined,
  PartitionOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";


export const ALL_APPS: AppItem[] = [
  {
    id: "student",
    name: "Espace étudiant",
    description: "Inscriptions, évaluations, résultats et gestion du profil.",
    href: "/s",
    color: "#6366F1",
    roles: ["etudiant"],
    icon: <UserOutlined />,
  },
  {
    id: "teacher",
    name: "Espace enseignant",
    description: "Suivi des cours, gestion des presences et évaluation.",
    href: "/t",
    color: "#10B981",
    roles: ["enseignant", "faculte"],
    icon: <BulbOutlined />,
  },
  {
    id: "faculty",
    name: "Filière & Mentions",
    description:
      "Planification des cours, suivi, gestion des enseignants et étudiants.",
    href: "/faculty",
    color: "#EF4444",
    roles: ["faculte"],
    icon: <PartitionOutlined />,
  },
  {
    id: "apparitorat",
    name: "Apparitorat",
    description: "Gestion des dossiers étudiants et assistance générale.",
    href: "/app",
    color: "#FACC15",
    roles: ["apparitorat", "admin"],
    icon: <FolderOutlined />,
  },
  {
    id: "jury",
    name: "Jury",
    description:
      "Organisation des examens, collecte des notes, délibérations et publication des résultats.",
    href: "/jury",
    color: "#3B82F6",
    roles: ["jury", "enseignant"],
    icon: <CheckCircleOutlined />,
  },
  {
    id: "finance",
    name: "Finances",
    description: "Frais à payer, paiements et factures étudiants.",
    href: "/finances",
    color: "#C026D3",
    roles: ["finance", "admin"],
    icon: <DollarOutlined />,
  },
  {
    id: "admin",
    name: "Console d'administration",
    description:
      "Configurations globales, gestion des utilisateurs et permissions.",
    href: "/console",
    color: "#1e2939",
    roles: ["admin"],
    icon: <SettingOutlined />,
  },
];