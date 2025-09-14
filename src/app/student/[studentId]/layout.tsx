"use client";
import BackButton from "@/components/backButton";
import { Palette } from "@/components/palette";
import { getYearEnrollment } from "@/lib/api";
import { CloseOutlined, MoreOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Dropdown,
  Form,
  Layout,
  Menu,
  Skeleton,
  Space,
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
      <Layout.Sider
        width={280}
        theme="light"
        style={{ borderRight: `1px solid ${colorBorderSecondary}` }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            borderBottom: `1px solid ${colorBorderSecondary}`,
            paddingLeft: 32,
            paddingRight: 32,
          }}
        >
          <Space>
            <Typography.Title
              type="secondary"
              style={{ marginBottom: 0 }}
              level={5}
              ellipsis={{}}
            >
              Compte étudiant
            </Typography.Title>
          </Space>
        </div>
        <StudentProfileDetails data={enrolledStudent} isError={isError} />
      </Layout.Sider>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          background: colorBgContainer,
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
            <BackButton />
            {!isPending ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                {`${enrolledStudent?.user.first_name} ${enrolledStudent?.user.last_name} ${enrolledStudent?.user.surname}`}{" "}
                (étudiant)
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>
            <Typography.Text type="secondary">
              {enrolledStudent?.academic_year.name}
            </Typography.Text>
            <Link href={`/faculty/${enrolledStudent?.faculty.id}/students`}>
              <Button type="text" icon={<CloseOutlined />} title="Quitter le compte" />
            </Link>
          </Space>
        </Layout.Header>
        <Menu
          selectedKeys={[pathname]}
          mode="horizontal"
          items={[
            {
              key: `/app/student/${studentId}`,
              label: <Link href={`/app/student/${studentId}`}>Aperçu</Link>,
            },
            {
              key: `/app/student/${studentId}/courses/`,
              label: (
                <Link href={`/app/student/${studentId}/courses/`}>
                  Cours prévus
                </Link>
              ),
            },
            {
              key: `/app/student/${studentId}/taught-courses`,
              label: (
                <Link href={`/app/student/${studentId}/taught-courses`}>
                  Cours programmés
                </Link>
              ),
            },
            {
              key: `/app/student/${studentId}/fees`,
              label: (
                <Link href={`/app/student/${studentId}/fees`}>
                  Frais & Paiements
                </Link>
              ),
            },
            {
              key: `/app/student/${studentId}/documents`,
              label: (
                <Link href={`/app/student/${studentId}/documents`}>
                  Documents
                </Link>
              ),
            },
            {
              key: `/app/student/${studentId}/health`,
              label: (
                <Link href={`/app/student/${studentId}/documents`}>Santé</Link>
              ),
            },
            {
              key: `/app/student/${studentId}/discipline`,
              label: (
                <Link href={`/app/student/${studentId}/discipline`}>
                  Discipline
                </Link>
              ),
            },
            {
              key: `/app/student/${studentId}/path`,
              label: (
                <Link href={`/app/student/${studentId}/path`}>
                  Parcours académique
                </Link>
              ),
            },
            {
              key: `/app/student/${studentId}/student-card`,
              label: (
                <Link href={`/app/student/${studentId}/student-card`}>
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
            overflowY: "auto",
            height: "calc(100vh - 110px)",
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
    </Layout>
  );
}
