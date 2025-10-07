"use client";
import BackButton from "@/components/backButton";
import { Palette } from "@/components/palette";
import { getYearEnrollment } from "@/lib/api";
import { CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Form,
  Layout,
  Menu,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import { useParams, usePathname } from "next/navigation";
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
          <Typography.Title
            type="secondary"
            style={{ marginBottom: 0 }}
            level={5}
            ellipsis={{}}
          >
            Compte étudiant
          </Typography.Title>
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
            {!isPending ? (
              <Typography.Title level={3} style={{ marginBottom: 0, textTransform: "uppercase" }}>
                {`${enrolledStudent?.user.first_name} ${enrolledStudent?.user.last_name} ${enrolledStudent?.user.surname}`}
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
              <Button
                type="text"
                icon={<CloseOutlined />}
                title="Quitter le compte"
              />
            </Link>
          </Space>
        </Layout.Header>
        <Menu
          selectedKeys={[pathname]}
          mode="horizontal"
          items={[
            {
              key: `/student/${studentId}`,
              label: <Link href={`/student/${studentId}`}>Aperçu</Link>,
            },
            {
              key: `/student/${studentId}/documents`,
              label: (
                <Link href={`/student/${studentId}/documents`}>Documents</Link>
              ),
            },
            {
              key: `/student/${studentId}/path`,
              label: (
                <Link href={`/student/${studentId}/path`}>
                  Parcours académique
                </Link>
              ),
            },
            {
              key: `/student/${studentId}/fees`,
              label: (
                <Link href={`/student/${studentId}/fees`}>
                  Frais & Paiements
                </Link>
              ),
            },
            {
              key: `/student/${studentId}/discipline`,
              label: (
                <Link href={`/student/${studentId}/discipline`}>
                  Discipline
                </Link>
              ),
            },
            
            {
              key: `/student/${studentId}/student-card`,
              label: (
                <Link href={`/student/${studentId}/student-card`}>
                  Carte d&apos;étudiant
                </Link>
              ),
            },
          ]}
        />
        <div
          style={{
            paddingTop: 24,
          }}
        >
          {children}
        </div>
      </Layout.Content>
    </Layout>
  );
}
