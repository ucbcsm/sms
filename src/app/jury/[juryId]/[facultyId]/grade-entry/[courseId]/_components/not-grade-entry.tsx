"use client";

import { getYearStatusColor, getYearStatusName } from "@/lib/api";
import { TaughtCourse } from "@/types";
import { CloseOutlined, HourglassOutlined } from "@ant-design/icons";
import { Alert, Button, Layout, Result, Space, Tag, theme, Tooltip, Typography } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FC } from "react";

type NotGradeEntryProps = {
  course: TaughtCourse;
};

export const NotGradeEntry: FC<NotGradeEntryProps> = ({ course }) => {
  const {
    token: { colorBgContainer, colorWarning },
  } = theme.useToken();
  const { juryId, facultyId } = useParams();

  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: colorBgContainer,
          paddingLeft: 28,
          paddingRight: 28,
        }}
      >
        <Space>
          <Typography.Title
            level={3}
            style={{
              marginBottom: 0,
              textTransform: "uppercase",
            }}
          >
            {course?.available_course.name} ({course?.available_course.code})
          </Typography.Title>
        </Space>
        <Space>
          <Typography.Text type="secondary">Statut du cours:</Typography.Text>
          <Tag
            color={getYearStatusColor(course.status!)}
            style={{ marginRight: 0 }}
          >
            {getYearStatusName(course.status!)}
          </Tag>
          <Link href={`/jury/${juryId}/${facultyId}/grade-entry`}>
            <Tooltip title="Fermer">
              <Button icon={<CloseOutlined />} type="text" />
            </Tooltip>
          </Link>
        </Space>
      </Layout.Header>
      <Layout.Content
        style={{
          height: `calc(100vh - 192px)`,
          padding: 28,
          overflowY: "auto",
        }}
      >
        <Result
          title="La saisie des notes n'est pas permise"
          subTitle="Le cours n'est pas encore terminé."
          icon={
            <HourglassOutlined style={{ fontSize: 48, color: colorWarning }} />
          }
          extra={
            <Alert
              type="info"
              showIcon
              message={
                <div>
                  Veuillez contacter les membres de la filière:{" "}
                  <Typography.Text strong>
                    {course.faculty.name}
                  </Typography.Text>{" "}
                  pour plus d&apos;informations.
                </div>
              }
            />
          }
        />
      </Layout.Content>
    </Layout>
  );
};
