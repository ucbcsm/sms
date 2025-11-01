"use client";
import { getYearEnrollment } from "@/lib/api";
import {
  CloseOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DollarOutlined,
  FolderOutlined,
  RedoOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Avatar,
  Button,
  Divider,
  Form,
  Image,
  Layout,
  Menu,
  Modal,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useInstitution } from "@/hooks/use-institution";
import { getHSLColor, getPublicR2Url } from "@/lib/utils";
import { UserProfileButton } from "@/components/userProfileButton";
import { AppsButton } from "@/components/appsButton";
import { SupportDrawer } from "@/components/support-drawer";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { useState } from "react";

export default function StudentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary, colorPrimary },
  } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { data: institution } = useInstitution();
  const router = useRouter();

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
          paddingLeft: 0,
          borderBottom: `1px solid ${colorBorderSecondary}`,
        }}
      >
        <Space style={{ background: colorPrimary }}>
          <Button
            type="primary"
            icon={<CloseOutlined />}
            style={{
              boxShadow: "none",
              height: 64,
              width: 64,
              borderRadius: 0,
            }}
            size="large"
            onClick={() => setIsModalOpen(true)}
          />

          <Modal
            title={`Quitter`}
            centered
            open={isModalOpen}
            onOk={() => {
              router.push(`/faculty/${enrolledStudent?.faculty.id}/students`);
              setIsModalOpen(false);
            }}
            onCancel={() => setIsModalOpen(false)}
            okButtonProps={{ style: { boxShadow: "none" } }}
            cancelButtonProps={{ style: { boxShadow: "none" } }}
          >
            <Alert
              description={`Vous allez quitter le compte étudiant: ${enrolledStudent?.user.surname} ${enrolledStudent?.user.last_name} ${enrolledStudent?.user.first_name} et retourner à la liste des étudiants.`}
              message={`Information`}
              type="info"
              showIcon
              style={{
                marginTop: 16,
                marginBottom: 32,
                border: 0,
              }}
            />
          </Modal>
        </Space>
        <Space style={{ marginLeft: 28 }}>
          <Link
            href={`/student/${studentId}`}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className="flex items-center pr-3">
              <Image
                src={getPublicR2Url(institution?.logo) || undefined}
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
          <Typography.Title
            level={5}
            type="secondary"
            style={{ marginBottom: 0 }}
          >
            Étudiant:
          </Typography.Title>
          {enrolledStudent && (
            <Avatar
              style={{
                background: getHSLColor(
                  `${enrolledStudent?.user.surname} ${enrolledStudent?.user.last_name} ${enrolledStudent?.user.first_name}`
                ),
              }}
              size="small"
              shape="square"
              src={getPublicR2Url(enrolledStudent?.user.avatar)}
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
          <Divider type="vertical" />
          <LanguageSwitcher />
          <SupportDrawer />
          <AppsButton />
          <UserProfileButton />
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
              icon: <DashboardOutlined />,
            },
            {
              key: `/student/${studentId}/documents`,
              label: (
                <Link href={`/student/${studentId}/documents`}>Documents</Link>
              ),
              icon: <FolderOutlined />,
            },
            {
              key: `/student/${studentId}/path`,
              label: (
                <Link href={`/student/${studentId}/path`}>
                  Rélevés de notes
                </Link>
              ),
              icon: <SolutionOutlined />,
            },
            {
              key: `/student/${studentId}/fees`,
              label: (
                <Link href={`/student/${studentId}/fees`}>
                  Frais & Paiements
                </Link>
              ),
              icon: <DollarOutlined />,
            },
            {
              key: `/student/${studentId}/retake`,
              label: (
                <Link href={`/student/${studentId}/retake`}>
                  Cours à reprendre
                </Link>
              ),
              icon: <RedoOutlined />,
            },
            {
              key: `/student/${studentId}/student-card`,
              label: (
                <Link href={`/student/${studentId}/student-card`}>
                  Carte d&apos;étudiant
                </Link>
              ),
              icon: <ContactsOutlined />,
            },
          ]}
        />
      </div>
      <div>{children}</div>
    </div>
  );
}
