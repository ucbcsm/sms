"use client";

import { useYid } from "@/hooks/use-yid";
import {
  getTeacherTaughtCourses
} from "@/lib/api";
import { TaughtCourse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Dropdown,
  Form,
  Layout,
  List,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import { FC } from "react";
import { EyeOutlined, MoreOutlined, ReadOutlined } from "@ant-design/icons";
import Link from "next/link";

type CourseListItemProps = {
  item: TaughtCourse;
};

const CourseListItem: FC<CourseListItemProps> = ({ item }) => {

  return (
    <>
      <List.Item
        extra={
          <Space>
            <Link href={`/t-space/courses/course/${item.id}`}>
              <Button
                type="link"
                style={{ boxShadow: "none" }}
                icon={<EyeOutlined />}
                title="Voir le cours"
              />
            </Link>

            <Dropdown
              menu={{
                items: [
                  {
                    key: "attendances",
                    label: (
                      <Link
                        href={`/t-space/courses/course/${item.id}?tab=attendances`}
                      >
                        Présences
                      </Link>
                    ),
                  },
                  {
                    key: "assessments",
                    label: (
                      <Link
                        href={`/t-space/courses/course/${item.id}?tab=assessments`}
                      >
                        Notes
                      </Link>
                    ),
                  },
                ],
              }}
            >
              <Button
                icon={<MoreOutlined />}
                type="text"
                style={{ boxShadow: "none" }}
              />
            </Dropdown>
          </Space>
        }
      >
        <List.Item.Meta
          title={
            <Link href={`/t-space/courses/course/${item.id}`}>
              <Space>
                <ReadOutlined />
                {`${item.available_course.name} (${item.available_course.code})`}
              </Space>
            </Link>
          }
          description={item.departements.map((dep) => dep.acronym).join(", ")}
        />
      </List.Item>
    </>
  );
};

export default function Page() {
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const { yid } = useYid();

  const {
    data: courses,
    isPending: isPendingCourses,
    isError: isErrorCourses,
  } = useQuery({
    queryKey: ["courses", `${yid}`],
    queryFn: ({ queryKey }) => getTeacherTaughtCourses(Number(queryKey[1])),
    enabled: !!yid,
  });

  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 28px 28px 28px",
           overflowY: "auto",
          height: "calc(100vh - 110px)",
        }}
      >
        <Layout.Header
          style={{
            background: colorBgLayout,
            display: "flex",
            alignItems: "center",
            padding: 0,
          }}
        >
          <Space>
            {!isPendingCourses ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                Mes cours
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>{/* <Palette /> */}</Space>
        </Layout.Header>
        <Card loading={isPendingCourses}>
          <List
            dataSource={courses}
            renderItem={(item) => <CourseListItem key={item.id} item={item} />}
          />
        </Card>
      </Layout.Content>
    </Layout>
  );
}
