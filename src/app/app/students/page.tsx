"use client";

import { Button, Dropdown, Form, Layout, Skeleton, Space, theme, Typography } from "antd";
import { ListStudents } from "./_components/list-students";
import { UserAddOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getFaculties } from "@/lib/api";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
    const { data: faculties, isPending: isPendingFaculties } = useQuery({
      queryKey: ["faculties"],
      queryFn: getFaculties,
    });
  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          padding: 0,
        }}
      >
        <Space>
          <Typography.Title level={3} className="" style={{ marginBottom: 0 }}>
            Étudiants
          </Typography.Title>
        </Space>
        <div className="flex-1" />
        <Space>
          {!isPendingFaculties ? (
            <Dropdown
              menu={{
                items: [],
              }}
            >
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                style={{ boxShadow: "none" }}
              >
                Inscription périodique
              </Button>
            </Dropdown>
          ) : (
            <Form>
              <Skeleton.Input active />
            </Form>
          )}
        </Space>
      </Layout.Header>
      <Layout.Content style={{ background: colorBgContainer }}>
        <ListStudents />
      </Layout.Content>
    </Layout>
  );
}
