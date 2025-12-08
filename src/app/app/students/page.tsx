"use client";

import {
  Button,
  Dropdown,
  Form,
  Layout,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { ListStudents } from "./_components/list-students";
import { UserAddOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getFaculties } from "@/lib/api";
import { StudentsStatsDashboard } from "./_components/statsDashboard";
import Link from "next/link";

export default function Page() {
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
          background: "#f5f5f5",
          padding: 0,
        }}
      >
        <Space>
          <Typography.Title
            // type="secondary"
            level={3}
            className=""
            style={{ marginBottom: 0 }}
          >
            Étudiants
          </Typography.Title>
        </Space>
        <div className="flex-1" />
        <Space>
          {!isPendingFaculties ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "",
                    type: "submenu",
                    label: "Filières",
                    children:
                      faculties?.map((fac) => ({
                        key: fac.id,
                        label: (
                          <Link href={`/faculty/${fac.id}/students`}>
                            {fac.name}
                          </Link>
                        ),
                      })) || [],
                  },
                ],
              }}
            >
              <Button
                color="primary"
                variant="dashed"
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
          <StudentsStatsDashboard />
        </Space>
      </Layout.Header>
      <Layout.Content>
        <ListStudents />
      </Layout.Content>
    </Layout>
  );
}
