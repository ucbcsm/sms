"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import {
  getDepartmentsByFacultyId,
  getFaculty,
  getFacultyDashboard,
} from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
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
import { useYid } from "@/hooks/use-yid";
import { FacultyMembersList } from "./_components/members/list";

export default function Page() {
  const { facultyId } = useParams();
  const { yid } = useYid();
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

  const {
    data: facultyDashboard,
    isPending: isPendingDashboard,
    isError: isErrorDashboard,
  } = useQuery({
    queryKey: ["faculty_dashboard", yid, facultyId],
    queryFn: ({ queryKey }) => getFacultyDashboard(yid!, Number(queryKey[2])),
    enabled: !!yid && !!facultyId,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  if (isError || isErrorDashboard) {
    return <DataFetchErrorResult />;
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={16}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPendingDashboard}
                  title="Étudiants"
                  value={facultyDashboard?.student_counter}
                />
                {!isPendingDashboard ? (
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
                <Statistic
                  loading={isPendingDashboard}
                  title="Hommes"
                  value={facultyDashboard?.male_count}
                />
                {!isPendingDashboard ? (
                  <Progress
                    type="dashboard"
                    percent={
                      (facultyDashboard?.male_count! /
                        facultyDashboard?.student_counter!) *
                      100
                    }
                    size={58}
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
                <Statistic
                  loading={isPendingDashboard}
                  title="Femmes"
                  value={facultyDashboard?.female_count}
                />
                {!isPendingDashboard ? (
                  <Progress
                    type="dashboard"
                    percent={
                      (facultyDashboard?.female_count! /
                        facultyDashboard?.student_counter!) *
                      100
                    }
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
                <Statistic
                  loading={isPendingDashboard}
                  title="Actifs"
                  value={facultyDashboard?.actif_count}
                />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPendingDashboard}
                  title="Abandons"
                  value={facultyDashboard?.inactif_count}
                />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPendingDashboard}
                  title="Départements"
                  value={facultyDashboard?.departement_count}
                />
              </Flex>
            </Card>
          </Col>
          {/* <Col span={8}>
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
          </Col> */}
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
                          color="primary"
                          variant="dashed"
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
            <Card loading={isPending}>
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
            <Card>
              <Typography.Title level={5}>
                Responsables de la faculté
              </Typography.Title>
              <FacultyMembersList faculty={faculty}/>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
