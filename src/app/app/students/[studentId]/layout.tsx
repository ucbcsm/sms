"use client";
import BackButton from "@/components/backButton";
import { Palette } from "@/components/palette";
import { getYearEnrollment } from "@/lib/api";
import { CloseOutlined, MoreOutlined, UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Form,
  Layout,
  Menu,
  Skeleton,
  Space,
  Tabs,
  theme,
  Typography,
} from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";
import { StudentProfileDetails } from "./profile/profileDetails";
import Link from "next/link";

export default function StudentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const { studentId } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const {
    data: enrolledStudent,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["enrollment", studentId],
    queryFn: ({ queryKey }) => getYearEnrollment(Number(queryKey[1])),
    enabled: !!studentId,
  });

  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          background: colorBgContainer,
          overflowY: "auto",
          height: "calc(100vh - 64px)",
        }}
      >
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            padding: 0,
          }}
        >
          <Space>
            {/* <BackButton /> */}
            {!isPending ? (
              <Avatar icon={<UserOutlined />} />
            ) : (
              <Form>
                <Skeleton.Avatar active />
              </Form>
            )}
            {!isPending ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                {`${enrolledStudent?.user.first_name} ${enrolledStudent?.user.last_name} ${enrolledStudent?.user.surname}`}{" "}
                [{enrolledStudent?.user.matricule}]
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>
            {/* <Palette /> */}
            <Button
              icon={<CloseOutlined />}
              type="text"
              title="Quitter ce profile étudant"
              onClick={() => router.push("/app/students")}
            />
          </Space>
        </Layout.Header>
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={[
            {
              key: `/app/students/${studentId}`,
              label: <Link href={`/app/students/${studentId}`}>Aperçu</Link>,
            },
            {
              key: `/app/students/${studentId}/fees`,
              label: (
                <Link href={`/app/students/${studentId}/fees`}>
                  Frais & Paiements
                </Link>
              ),
            },
            {
              key: `/app/students/${studentId}/documents`,
              label: (
                <Link href={`/app/students/${studentId}/documents`}>
                  Documents
                </Link>
              ),
            },
            {
              key: `/app/students/${studentId}/health`,
              label: (
                <Link href={`/app/students/${studentId}/health`}>Santé</Link>
              ),
            },
            {
              key: `/app/students/${studentId}/discipline`,
              label: (
                <Link href={`/app/students/${studentId}/discipline`}>
                  Discipline
                </Link>
              ),
            },
            {
              key: `/app/students/${studentId}/path`,
              label: (
                <Link href={`/app/students/${studentId}/path`}>
                  Parcours académique
                </Link>
              ),
            },
            {
              key: `/app/students/${studentId}/student-card`,
              label: (
                <Link href={`/app/students/${studentId}/student-card`}>
                  Carte d&apos;étudiant
                </Link>
              ),
            },
            { key: "form", label: "Attestation d'admission", disabled: true },
            { key: "transcript", label: "Relevé de notes", disabled: true },
            {
              key: "certificate",
              label: "Certificat de scolarité",
              disabled: true,
            },
            {
              key: "schedule",
              label: "Attestation de fréquentation",
              disabled: true,
            },
            { key: "diploma", label: "Diplôme", disabled: true },
            { key: "report", label: "Rapport de stage", disabled: true },
            { key: "rules", label: "Règlement intérieur", disabled: true },
          ]}
        />

        <div
          style={{
            paddingTop: 24,
            overflow: "auto",
            height: "calc(100vh - 174px)",
          }}
        >
          {children}
          <Layout.Footer
            style={{
              display: "flex",
              background: colorBgContainer,
              padding: " 24px 0",
            }}
          >
            <Typography.Text type="secondary">
              © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
            </Typography.Text>
            <div className="flex-1" />
            <Space>
              <Palette />
            </Space>
          </Layout.Footer>
        </div>
      </Layout.Content>
      <Layout.Sider
        width={280}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
      >
        <StudentProfileDetails data={enrolledStudent} isError={isError} />
      </Layout.Sider>
    </Layout>
  );
}
