"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { getDepartmentsByFacultyId, getFaculty } from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  List,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { ListStaffOfficer } from "../teachers/staff";

export default function Page() {
  const { facultyId } = useParams();
  const router = useRouter();

  const {
    data: faculty,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["faculty", facultyId],
    queryFn: ({ queryKey }) => getFaculty(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={16}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic loading={isPending} title="Etudiants" value={"30"} />
                {!isPending ? (
                  <Progress type="dashboard" percent={100} size={58} />
                ) : (
                  <Skeleton.Avatar size={58} active />
                )}
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic loading={isPending} title="Hommes" value={"21"} />
                {!isPending ? (
                  <Progress type="dashboard" percent={57.9} size={58} />
                ) : (
                  <Skeleton.Avatar size={58} active />
                )}
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic loading={isPending} title="Femmes" value={"9"} />
                {!isPending ? (
                  <Progress
                    type="dashboard"
                    percent={42.0}
                    size={58}
                    strokeColor="cyan"
                  />
                ) : (
                  <Skeleton.Avatar size={58} active />
                )}
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic loading={isPending} title="Actifs" value={"30"} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic loading={isPending} title="Abandons" value={"0"} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Département"
                  value={"2"}
                />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic loading={isPending} title="Promotions" value={8} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic loading={isPending} title="Personnel" value={"5"} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Taux de réussite"
                  value={"95%"}
                />
              </Flex>
            </Card>
          </Col>
          <Col span={24}>
            <Card title="Départements">
              {/* <Typography.Title level={5}></Typography.Title> */}
              <List
                dataSource={departments}
                renderItem={(item) => (
                  <List.Item
                    extra={
                      <Space>
                        <Button
                          type="dashed"
                          style={{ boxShadow: "none" }}
                          onClick={() =>
                            router.push(`/app/department/${item.id}`)
                          }
                        >
                          Gérer
                        </Button>
                      </Space>
                    }
                  >
                    <List.Item.Meta
                      title={`${item.name}`}
                      description={
                        <Space>
                          Code:
                          <Badge
                            count={item?.acronym}
                            color={getHSLColor(`${item?.name}`)}
                          />
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={8}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Descriptions
                title="Détails sur la faculté"
                // extra={
                //   <Button type="link" icon={<EditOutlined />}>
                //     Modifier
                //   </Button>
                // }
                column={1}
                items={[
                  {
                    label: "Code",
                    children: faculty?.acronym,
                  },
                  {
                    label: "Nom",
                    children: faculty?.name,
                  },
                  {
                    label: "Domaine",
                    children: faculty?.field.name,
                  },
                ]}
              />
            </Card>
          </Col>
          <Col span={24}>
            <ListStaffOfficer />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
