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
    id: "is_student",
    name: "Espace étudiant",
    description: "Inscriptions, évaluations, résultats et gestion du profil.",
    href: "/s-space",
    color: "#6366F1",
    roles: [],
    icon: <UserOutlined />,
  },
  {
    id: "is_teacher",
    name: "Espace enseignant",
    description: "Suivi des cours, gestion des presences et évaluation.",
    href: "/t-space",
    color: "#10B981",
    roles: [],
    icon: <BulbOutlined />,
  },
  {
    id: "faculty",
    name: "Filières & Mentions",
    description:
      "Planification des cours, suivi, gestion des enseignants et étudiants.",
    href: "/faculty",
    color: "#EF4444",
    roles: [
      "is_faculty_coordinator",
      "is_faculty_secretary",
      "is_faculty_personal",
    ],
    icon: <PartitionOutlined />,
  },
  {
    id: "apparitorat",
    name: "Apparitorat",
    description: "Gestion des dossiers étudiants et assistance générale.",
    href: "/app",
    color: "#FACC15",
    roles: [
      "is_apparitorat_personal",
      "is_apparitor",
      "is_academic_general_secretary",
      "is_sgad_cabin_manager",
      "is_sgad_secretary",
      "is_sgad_personal",
    ],
    icon: <FolderOutlined />,
  },
  {
    id: "jury",
    name: "Jurys",
    description:
      "Collecte des notes, délibérations et publication des résultats.",
    href: "/jury",
    color: "#3B82F6",
    roles: [
      "is_jury_member",
      "is_jury_personal",
      "is_jury_secretary",
      "is_jury_president",
    ],
    icon: <CheckCircleOutlined />,
  },
  {
    id: "finance",
    name: "Finances",
    description: "Frais à payer, paiements et factures étudiants.",
    href: "/finances",
    color: "#C026D3",
    roles: [
      "is_finance_accountant",
      "is_finance_budget_administrator",
      "is_finance_personal",
    ],
    icon: <DollarOutlined />,
  },
  {
    id: "is_superuser",
    name: "Console d'administration",
    description:
      "Configurations globales, gestion des utilisateurs et permissions.",
    href: "/console",
    color: "#1e2939",
    roles: [],
    icon: <SettingOutlined />,
  },
];