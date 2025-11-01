"use client";

import {
  Alert,
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
import { ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAllCourses,
  getClassrooms,
  getDepartmentsByFacultyId,
  getPeriods,
  getTaughtCours,
  getTeachersByFaculty,
  getTeachingUnitsByfaculty,
  getYearStatusColor,
  getYearStatusName,
} from "@/lib/api";
import { TaughtCourseDetails } from "./(dashboard)/course-details";
import { CloseOutlined } from "@ant-design/icons";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { SupportDrawer } from "@/components/support-drawer";
import { AppsButton } from "@/components/appsButton";
import { UserProfileButton } from "@/components/userProfileButton";
import { useInstitution } from "@/hooks/use-institution";
import { getPublicR2Url } from "@/lib/utils";

export default function FacultyLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary, colorPrimary },
  } = theme.useToken();
const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { courseId } = useParams();
  const pathname = usePathname();
  const router = useRouter()

   const {data:institution} = useInstitution();

  const {
    data: course,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["taught_courses", courseId],
    queryFn: ({ queryKey }) => getTaughtCours(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const { data: courses } = useQuery({
    queryKey: ["courses", `${course?.faculty.id}`, "all"],
    queryFn: ({ queryKey }) =>
      getAllCourses({ facultyId: Number(queryKey[1]) }),
    enabled: !!course?.faculty.id,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments", `${course?.faculty.id}`],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!course?.faculty.id,
  });

  const { data: teachers } = useQuery({
    queryKey: ["teachers", `${course?.faculty.id}`],
    queryFn: ({ queryKey }) => getTeachersByFaculty(Number(queryKey[1])),
    enabled: !!course?.faculty.id,
  });

  const { data: periods } = useQuery({
    queryKey: ["periods"],
    queryFn: getPeriods,
  });


  const { data: teachingUnits } = useQuery({
    queryKey: ["teaching-units", `${course?.faculty.id}`],
    queryFn: ({ queryKey }) => getTeachingUnitsByfaculty(Number(queryKey[1])),
    enabled: !!course?.faculty.id,
  });

  const { data: classrooms } = useQuery({
    queryKey: ["classrooms"],
    queryFn: getClassrooms,
  });

  return (
    <Layout>
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
              router.push(`/faculty/${course?.faculty.id}/taught-courses`);
              setIsModalOpen(false);
            }}
            onCancel={() => setIsModalOpen(false)}
            okButtonProps={{ style: { boxShadow: "none" } }}
            cancelButtonProps={{ style: { boxShadow: "none" } }}
          >
            <Alert
              description={`Vous allez quitter le cours: ${course?.available_course.name} et retourner à la liste des cours.`}
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
            href={`/taught-course/${courseId}`}
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
          <Typography.Text type="secondary">Cours:</Typography.Text>

          {!isPending ? (
            <Typography.Title
              level={5}
              style={{ marginBottom: 0 }}
              ellipsis={{}}
            >
              {course?.available_course.name}
            </Typography.Title>
          ) : (
            <Form>
              <Skeleton.Input active />
            </Form>
          )}
        </Space>

        <div className="flex-1" />
        <Space>
          {/* <Typography.Text type="secondary">
            {enrolledStudent?.academic_year.name}
          </Typography.Text> */}
          {/* <Link href={`/faculty/${course?.faculty.id}/taught-courses`}>
            <Button
              type="text"
              icon={<CloseOutlined />}
              title="Quitter le cours"
            />
          </Link> */}
          <LanguageSwitcher />
          <SupportDrawer />
          <AppsButton />
          <UserProfileButton />
        </Space>
      </Layout.Header>
      <div>
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={[
            {
              key: `/taught-course/${courseId}`,
              label: <Link href={`/taught-course/${courseId}`}>Aperçu</Link>,
            },
            {
              key: `/taught-course/${courseId}/students`,
              label: (
                <Link href={`/taught-course/${courseId}/students`}>
                  Étudiants inscrits
                </Link>
              ),
            },
            {
              key: `/taught-course/${courseId}/attendances`,
              label: (
                <Link href={`/taught-course/${courseId}/attendances`}>
                  Listes des présences
                </Link>
              ),
            },
            {
              key: `/taught-course/${courseId}/hours-tracking`,
              label: (
                <Link href={`/taught-course/${courseId}/hours-tracking`}>
                  Suivis des heures
                </Link>
              ),
            },
            {
              key: `/taught-course/${courseId}/assessments`,
              label: (
                <Link href={`/taught-course/${courseId}/assessments`}>
                  Notes (TD/TP & Examens)
                </Link>
              ),
            },
            {
              key: `/taught-course/${courseId}/course-evaluations`,
              label: (
                <Link href={`/taught-course/${courseId}/course-evaluations`}>
                  Évaluations du cours
                </Link>
              ),
            },
          ]}
        />
      </div>
      <div>{children}</div>
    </Layout>
  );
}
