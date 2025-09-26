"use client";

import {
  Button,
  Card,
  Form,
  Layout,
  Menu,
  Skeleton,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAllCourses,
  getClassrooms,
  getDepartmentsByFacultyId,
  getFaculties,
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

export default function FacultyLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const { courseId } = useParams();
  const pathname = usePathname();
  const router = useRouter();

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
              Gestion du cours
            </Typography.Title>
          </Space>
        </div>
        <TaughtCourseDetails
          data={course}
          isError={isError}
          departments={departments}
          periods={periods}
          teachers={teachers}
          courses={courses}
          teachingUnits={teachingUnits}
          classrooms={classrooms}
        />
      </Layout.Sider>
      <Layout.Content
        style={{
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
              <Typography.Title
                level={3}
                style={{ marginBottom: 0 }}
                ellipsis={{}}
              >
                {course?.available_course.name} (Cours)
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>
            {!isPending ? (
              <Space>
                <Typography.Text type="secondary">Statut:</Typography.Text>
                <Tag
                  color={getYearStatusColor(course?.status!)}
                  style={{ border: 0 }}
                >
                  {getYearStatusName(course?.status!)}
                </Tag>
              </Space>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
            <Link href={`/faculty/${course?.faculty.id}/taught-courses`} >
              <Button
                type="text"
                icon={<CloseOutlined />}
                title="Quitter le cours"
              />
            </Link>
          </Space>
        </Layout.Header>
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

        <div
          style={{
            overflowY: "auto",
            height: "calc(100vh - 110px)",
            paddingTop: 16,
          }}
        >
          {children}
          {/* <Layout.Footer
            style={{
              display: "flex",
              background: colorBgContainer,
              padding: "24px 0",
            }}
          >
            <Typography.Text type="secondary">
              © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
            </Typography.Text>
            <div className="flex-1" />
            <Space>
              <Palette />
            </Space>
          </Layout.Footer> */}
        </div>
      </Layout.Content>
    </Layout>
  );
}
