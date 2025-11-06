'use client'

import { NewRetakeReasonForm } from "@/app/jury/[juryId]/[facultyId]/courses-to-retake/_components/newRetakeReasonForm";
import { useClasses } from "@/hooks/useClasses";
import { getAllCourses, getYearEnrollment } from "@/lib/api";
import { getRetakeCourses, getRetakeReasonText } from "@/lib/api/retake-course";
import { RetakeCourse } from "@/types";
import { BookOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Badge, Card, Empty, Layout, Table, Typography } from "antd";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { RetakeActionBar } from "./_components/retakeActionBar";

export default function Page() {
  const { studentId } = useParams();
  const [tab, setTab] = useQueryState("tab", { defaultValue: "retake_course_list" });
  const [studentWithRetakes, setStudentWithRetakes] = useState<
    RetakeCourse | undefined
  >();
  const {
    data: student,
    isPending:isPendingStudent,
    isError,
  } = useQuery({
    queryKey: ["enrollment", studentId],
    queryFn: ({ queryKey }) => getYearEnrollment(Number(queryKey[1])),
    enabled: !!studentId,
  });

  const { data: retakes, isPending: isPendingRetakes } = useQuery({
    queryKey: ["retake-courses", student?.user?.matricule],
    queryFn: () =>
      getRetakeCourses({
        search: student?.user?.matricule,
      }),
    enabled: !!student?.user?.matricule && !!studentId,
  });

  console.log("RetakesData",retakes);

  const { data: courses } = useQuery({
    queryKey: ["courses", student?.faculty.id, "all"],
    queryFn: ({ queryKey }) =>
      getAllCourses({ facultyId: Number(queryKey[1]) }),
    enabled: !!student?.faculty?.id && !!studentId,
  });
  
    const {
      data: classes,
      isPending: isPendingClasses,
      isError: isErrorClasses,
    } = useClasses();

  useEffect(() => {
    if (retakes && retakes.results.length > 0) {
      setStudentWithRetakes(retakes.results[0]);
    }
  }, [retakes]);

  return (
    <Layout>
      <Layout.Content
        style={{
          padding: `24px 24px 24px 24px`,
          minHeight: "calc(100vh - 110px)",
        }}
      >
        <Card
          loading={isPendingStudent || isPendingRetakes}
          activeTabKey={tab}
          onTabChange={(key) => {
            setTab(key);
          }}
          title={
            <Typography.Title level={3} style={{}}>
              Retakes
            </Typography.Title>
          }
          tabProps={{ size: "small" }}
          tabList={[
            {
              key: "retake_course_list",
              label: (
                <>
                  <Badge
                    count={studentWithRetakes?.retake_course_list.length}
                  />{" "}
                  Cours à reprendre
                </>
              ),
            },
            {
              key: "retake_course_done_list",
              label: (
                <>
                  <Badge
                    color="green"
                    count={studentWithRetakes?.retake_course_done_list.length}
                  />{" "}
                  Cours repris et acquis
                </>
              ),
            },
          ]}
        >
          {tab === "retake_course_list" && (
            <div className="">
              <Table
                title={() => (
                  <header className="flex justify-between ">
                    <NewRetakeReasonForm
                      type="not_done"
                      courses={courses}
                      staticData={{
                        userRetakeId: studentWithRetakes?.id!,
                        userId: studentWithRetakes?.user.id!,
                        matricule: studentWithRetakes?.user.matricule!,
                        studentName: `${studentWithRetakes?.user.surname} ${studentWithRetakes?.user.last_name} ${studentWithRetakes?.user.first_name}`,
                        facultyId: studentWithRetakes?.faculty.id!,
                        departmentId: studentWithRetakes?.departement.id!,
                      }}
                      currentRetakeCourseReason={
                        studentWithRetakes?.retake_course_list!
                      }
                      currentDoneRetakeCourseReason={
                        studentWithRetakes?.retake_course_done_list!
                      }
                      classes={classes}
                    />
                  </header>
                )}
                dataSource={studentWithRetakes?.retake_course_list}
                columns={[
                  {
                    key: "icon",
                    title: "",
                    render: () => <BookOutlined />,
                    width: 28,
                  },
                  {
                    title: "Cours",
                    dataIndex: "course",
                    key: "course",
                    render: (_, record) => record.available_course?.name,
                  },
                  {
                    title: "Motif de reprise",
                    dataIndex: "reason_text",
                    key: "reason_text",
                    render: (_, record) => (
                      <Typography.Text type="danger">
                        {getRetakeReasonText(record.reason)}
                      </Typography.Text>
                    ),
                    ellipsis: true,
                  },
                  {
                    key: "year",
                    title: "Année",
                    render: (_, record) => (
                      <Typography.Text>
                        {record.academic_year?.name}
                      </Typography.Text>
                    ),
                    width: 100,
                  },
                  {
                    key: "classYear",
                    title: "Classe",
                    render: (_, record) => (
                      <Typography.Text>
                        {record.class_year?.acronym}
                      </Typography.Text>
                    ),
                    width: 100,
                  },
                  {
                    key: "actions",
                    title: "",
                    render: (_, record) => (
                      <RetakeActionBar
                        itemData={record}
                        type="not_done"
                        staticData={{
                          userRetakeId: studentWithRetakes?.id!,
                          userId: studentWithRetakes?.user.id!,
                          matricule: studentWithRetakes?.user.matricule!,
                          studentName: `${studentWithRetakes?.user.surname} ${studentWithRetakes?.user.last_name} ${studentWithRetakes?.user.first_name}`,
                          facultyId: studentWithRetakes?.faculty.id!,
                          departmentId: studentWithRetakes?.departement.id!,
                        }}
                        classes={classes}
                        courses={courses}
                        currentRetakeCourseReason={
                          studentWithRetakes?.retake_course_list!
                        }
                        currentDoneRetakeCourseReason={
                          studentWithRetakes?.retake_course_done_list!
                        }
                      />
                    ),
                    width: 52,
                  },
                ]}
                size="small"
                locale={{
                  emptyText: (
                    <Empty
                      description="Aucun cours"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ),
                }}
              />
            </div>
          )}

          {tab === "retake_course_done_list" && (
            <div className="">
              <Table
                title={() => (
                  <header className="flex justify-between ">
                    <NewRetakeReasonForm
                      type="done"
                      courses={courses}
                      staticData={{
                        userRetakeId: studentWithRetakes?.id!,
                        userId: studentWithRetakes?.user.id!,
                        matricule: studentWithRetakes?.user.matricule!,
                        studentName: `${studentWithRetakes?.user.surname} ${studentWithRetakes?.user.last_name} ${studentWithRetakes?.user.first_name}`,
                        facultyId: studentWithRetakes?.faculty.id!,
                        departmentId: studentWithRetakes?.departement.id!,
                      }}
                      currentRetakeCourseReason={
                        studentWithRetakes?.retake_course_list!
                      }
                      currentDoneRetakeCourseReason={
                        studentWithRetakes?.retake_course_done_list!
                      }
                      classes={classes}
                    />
                  </header>
                )}
                dataSource={studentWithRetakes?.retake_course_done_list}
                columns={[
                  {
                    key: "icon",
                    title: "",
                    render: () => <BookOutlined />,
                    width: 28,
                  },
                  {
                    title: "Cours",
                    dataIndex: "course",
                    key: "course",
                    render: (_, record) => record.available_course?.name,
                  },
                  {
                    title: "Motif de reprise",
                    dataIndex: "reason_text",
                    key: "reason_text",
                    render: (_, record) => (
                      <Typography.Text type="warning">
                        {getRetakeReasonText(record.reason)}
                      </Typography.Text>
                    ),
                    ellipsis: true,
                  },
                  {
                    key: "year",
                    title: "Année",
                    render: (_, record) => (
                      <Typography.Text>
                        {record.academic_year?.name}
                      </Typography.Text>
                    ),
                    width: 100,
                  },
                  {
                    key: "classYear",
                    title: "Classe",
                    render: (_, record) => (
                      <Typography.Text>
                        {record.class_year?.acronym}
                      </Typography.Text>
                    ),
                    width: 100,
                  },
                  {
                    key: "actions",
                    title: "",
                    render: (_, record) => (
                      <RetakeActionBar
                        itemData={record}
                        type="done"
                        staticData={{
                          userRetakeId: studentWithRetakes?.id!,
                          userId: studentWithRetakes?.user.id!,
                          matricule: studentWithRetakes?.user.matricule!,
                          studentName: `${studentWithRetakes?.user.surname} ${studentWithRetakes?.user.last_name} ${studentWithRetakes?.user.first_name}`,
                          facultyId: student?.faculty.id!,
                          departmentId: student?.departement.id!,
                        }}
                        classes={classes}
                        courses={courses}
                        currentRetakeCourseReason={
                          studentWithRetakes?.retake_course_list!
                        }
                        currentDoneRetakeCourseReason={
                          studentWithRetakes?.retake_course_done_list!
                        }
                      />
                    ),
                    width: 52,
                  },
                ]}
                size="small"
                locale={{
                  emptyText: (
                    <Empty
                      description="Aucun cours"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ),
                }}
              />
            </div>
          )}
        </Card>
      </Layout.Content>
    </Layout>
  );
}