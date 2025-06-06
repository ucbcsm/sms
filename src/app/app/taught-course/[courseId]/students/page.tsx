"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import {
  getApplicationStatusName,
  getApplicationStatusTypographyType,
  getClasses,
  getCourseEnrollments,
  getCourseEnrollmentsByStatus,
  getCourseEnrollmentsCountByStatus,
  getDepartmentsByFacultyId,
  getPeriodEnrollmentsbyFaculty,
  getTaughtCours,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Dropdown,
  List,
  Row,
  Tabs,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { ListCourseStudents } from "./_components/list";
import { FC, useState } from "react";
import { CourseEnrollment } from "@/types";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { getHSLColor } from "@/lib/utils";
import { useYid } from "@/hooks/use-yid";

type ListCourseItemProps = {
  item: CourseEnrollment;
};

const ListCourseItem: FC<ListCourseItemProps> = ({ item }) => {
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openReject, setOpenReject] = useState<boolean>(false);
  const [openValidate, setOpenValidate] = useState<boolean>(false);

  return (
    <>
      {/* <ValidateCourseEnrollmentForm
        open={openValidate}
        setOpen={setOpenValidate}
        courseEnrollment={item}
      />
      <RejectCourseEnrollmentForm
        open={openReject}
        setOpen={setOpenReject}
        courseEnrollment={item}
      />
      <DeleteCourseEnrollmentForm
        open={openDelete}
        setOpen={setOpenDelete}
        courseEnrollment={item}
      /> */}

      <List.Item
        extra={
          <Dropdown
            menu={{
              items: [
                {
                  key: "validate",
                  label: "Accepter",
                  icon: <CheckOutlined />,
                },
                {
                  key: "reject",
                  label: "Rejeter",
                  icon: <CloseOutlined />,
                },
                {
                  key: "delete",
                  label: "Supprimer",
                  icon: <DeleteOutlined />,
                  danger: true,
                },
              ],
              onClick: ({ key }) => {
                if (key === "delete") {
                  setOpenDelete(true);
                } else if (key === "reject") {
                  setOpenReject(true);
                } else if (key === "validate") {
                  setOpenValidate(true);
                }
              },
            }}
          >
            <Button icon={<MoreOutlined />} type="text" />
          </Dropdown>
        }
      >
        <List.Item.Meta
          avatar={
            <Avatar
              src={item.student.year_enrollment.user.avatar}
              style={{
                backgroundColor: getHSLColor(
                  `${item.student.year_enrollment.user.first_name} ${item.student.year_enrollment.user.last_name} ${item.student.year_enrollment.user.surname}`
                ),
                cursor: "pointer",
              }}
            >
              {item.student.year_enrollment.user.first_name
                ?.charAt(0)
                .toUpperCase()}
              {item.student.year_enrollment.user.last_name
                ?.charAt(0)
                .toUpperCase()}
            </Avatar>
          }
          title={
            <Typography.Text style={{ cursor: "pointer" }}>
              {item.student.year_enrollment.user.first_name}{" "}
              {item.student.year_enrollment.user.last_name}{" "}
              {item.student.year_enrollment.user.surname}
            </Typography.Text>
          }
          description={
            <div style={{ cursor: "pointer" }}>
              <Typography.Text
                type={getApplicationStatusTypographyType(item.status!)}
              >
                {getApplicationStatusName(`${item.status}`)}
              </Typography.Text>{" "}
              : {item.student.year_enrollment.class_year.acronym}{" "}
              {item.student.year_enrollment.departement.name}
            </div>
          }
        />
      </List.Item>
    </>
  );
};

export default function Page() {
  const { courseId } = useParams();
  const { yid } = useYid();
  const {
    data: courseEnrollements,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["course_enrollments", courseId],
    queryFn: ({ queryKey }) => getCourseEnrollments(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const { data: course } = useQuery({
    queryKey: ["taught_courses", courseId],
    queryFn: ({ queryKey }) => getTaughtCours(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const { data: periodEnrollements } = useQuery({
    queryKey: [
      "period_enrollments",
      `${yid}`,
      `${course?.faculty.id}`,
      `${course?.period?.id}`,
    ],
    queryFn: ({ queryKey }) =>
      getPeriodEnrollmentsbyFaculty(
        Number(queryKey[1]),
        Number(queryKey[2]),
        Number(queryKey[3])
      ),
    enabled: !!yid && !!course?.faculty.id && !!course?.period?.id,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments", course?.faculty.id],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!course?.faculty.id,
  });

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });

  if (isPending) {
    return <DataFetchPendingSkeleton variant="table" />;
  }

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={16}>
        <ListCourseStudents
          courseEnrollments={getCourseEnrollmentsByStatus(
            courseEnrollements,
            "validated"
          )}
          course={course}
          periodEnrollments={periodEnrollements}
          departments={departments}
          classes={classes}
        />
      </Col>
      <Col span={8}>
        <div>
          <Typography.Title level={3}>Autres</Typography.Title>
          <Tabs
            tabBarStyle={{}}
            items={[
              {
                key: "pending",
                label: (
                  <Badge
                    count={getCourseEnrollmentsCountByStatus(
                      courseEnrollements,
                      "pending"
                    )}
                    color="red"
                    overflowCount={9}
                  >
                    En attentes
                  </Badge>
                ),
                children: (
                  <div>
                    <List
                      dataSource={getCourseEnrollmentsByStatus(
                        courseEnrollements,
                        "pending"
                      )}
                      renderItem={(item) => (
                        <ListCourseItem key={item.id} item={item} />
                      )}
                    />
                    {/* <ListCourseStudents
                    data={getCourseEnrollmentsByStatus(data, "pending")}
                  /> */}
                  </div>
                ),
              },
              {
                key: "rejected",
                label: "Rejetées",
                children: (
                  <div>
                    <List
                      dataSource={getCourseEnrollmentsByStatus(
                        courseEnrollements,
                        "rejected"
                      )}
                      renderItem={(item) => (
                        <ListCourseItem key={item.id} item={item} />
                      )}
                    />
                    {/* <ListCourseStudents
                    data={getCourseEnrollmentsByStatus(data, "rejected")}
                  /> */}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Col>
    </Row>
  );
}
