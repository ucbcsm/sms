"use client";
import { getYearEnrollment } from "@/lib/api";
import { CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Divider,
  Form,
  Image,
  Layout,
  Menu,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useInstitution } from "@/hooks/use-institution";
import { getHSLColor } from "@/lib/utils";

export default function StudentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const { data: institution } = useInstitution();

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
    <div>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          padding: "0 28px",
        }}
      >
        <Space>
          <Link
            href={`/student/${studentId}`}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className="flex items-center pr-3">
              <Image
                src={institution?.logo || "/ucbc-logo.png"}
                alt="Logo"
                width={36}
                height="auto"
                preview={false}
              />
            </div>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              {institution?.acronym}
            </Typography.Title>
          </Link>
          <Divider type="vertical" />
          <Typography.Text type="secondary">Étudiant:</Typography.Text>
          {enrolledStudent && (
            <Avatar
              style={{
                background: getHSLColor(
                  `${enrolledStudent?.user.surname} ${enrolledStudent?.user.last_name} ${enrolledStudent?.user.first_name}`
                ),
              }}
              size="small"
              shape="square"
            >
              {`${enrolledStudent?.user.first_name?.charAt(0).toUpperCase()}`}
            </Avatar>
          )}

          {!isPending ? (
            <Typography.Title
              level={5}
              style={{ marginBottom: 0, textTransform: "uppercase" }}
            >
              {`${enrolledStudent?.user.surname} ${enrolledStudent?.user.last_name} ${enrolledStudent?.user.first_name}`}
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
      <div>
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
                  Rélevés de notes
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
      </div>
      <div>{children}</div>
    </div>
  );
}
