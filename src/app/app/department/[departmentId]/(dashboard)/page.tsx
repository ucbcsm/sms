"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { useYid } from "@/hooks/use-yid";
import { getDepartment, getDepartmentDashboard } from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
import { CloseOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Dropdown,
  Flex,
  List,
  Progress,
  Row,
  Skeleton,
  Statistic,
  Typography,
} from "antd";
import { useParams } from "next/navigation";

export default function Page() {
  const { departmentId } = useParams();
  const { yid } = useYid();

  const {
    data: department,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["department", departmentId],
    queryFn: ({ queryKey }) => getDepartment(Number(queryKey[1])),
    enabled: !!departmentId,
  });

  const {
    data: departmentDashboard,
    isPending: isPendingDashboard,
    isError: isErrorDashboard,
  } = useQuery({
    queryKey: ["department", yid, departmentId],
    queryFn: ({ queryKey }) =>
      getDepartmentDashboard(yid!, Number(queryKey[2])),
    enabled: !!yid && !!departmentId,
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
                  value={departmentDashboard?.student_counter}
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
                  value={departmentDashboard?.male_count}
                />
                {!isPendingDashboard ? (
                  <Progress
                    type="dashboard"
                    percent={
                      (departmentDashboard.male_count /
                        departmentDashboard.student_counter) *
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
                  value={departmentDashboard?.female_count}
                />
                {!isPendingDashboard ? (
                  <Progress
                    type="dashboard"
                    percent={
                      (departmentDashboard.female_count /
                        departmentDashboard.student_counter) *
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
                  value={departmentDashboard?.actif_count}
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
                  value={departmentDashboard?.inactif_count}
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
                <Statistic loading={isPending} title="Programmes" value={"6"} />
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
        </Row>
      </Col>
      <Col span={8}>
      <Row gutter={[16,16]}>
        <Col span={24}>
        <Card loading={isPending}>
          <Descriptions
            title="Détails sur le département"
            // extra={
            //   <Button type="link" icon={<EditOutlined />}>
            //     Modifier
            //   </Button>
            // }
            column={1}
            items={[
              {
                label: "Code",
                children: department?.acronym,
              },
              {
                label: "Nom",
                children: department?.name,
              },
              {
                label: "Faculté",
                children: department?.faculty.name,
              },
              // {
              //   label: "Année académique",
              //   children: "",
              // },
            ]}
          />
        </Card>
        </Col>
        <Col span={24}>
        <Card>
          <Typography.Title level={5}>
            Responsables de la faculté
          </Typography.Title>
          <div style={{ width: "100%" }}>
            <div>
              <Typography.Text type="secondary">Directeur</Typography.Text>
              {department?.director ? (
                <List
                  dataSource={[department.director]}
                  renderItem={(item) => (
                    <List.Item
                      extra={
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: "edit",
                                label: "Modifier",
                                icon: <EditOutlined />,
                              },
                              {
                                key: "delete",
                                label: "Retirer",
                                icon: <CloseOutlined />,
                                danger: true,
                              },
                            ],
                            onClick: ({ key }) => {},
                          }}
                        >
                          <Button type="text" icon={<MoreOutlined />} />
                        </Dropdown>
                      }
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            style={{
                              backgroundColor: getHSLColor(
                                `${department.director.user.first_name} ${department.director.user.last_name} ${department.director.user.surname}`
                              ),
                            }}
                          >
                            {department.director.user.first_name
                              ?.charAt(0)
                              .toUpperCase()}
                            {department.director.user.last_name
                              ?.charAt(0)
                              .toUpperCase()}
                          </Avatar>
                        }
                        title={`${department.director?.user.first_name} ${department.director?.user.last_name} ${department.director?.user.surname}`}
                        description={department.director.academic_title}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div className="flex ">
                  <Button type="link">Définir un directeur</Button>
                </div>
              )}
            </div>
            <Divider size="small" />

            <div>
              <Typography.Text type="secondary">Autres membres</Typography.Text>
              {department?.other_members &&
              department.other_members.length > 0 ? (
                <List
                  dataSource={department?.other_members!}
                  renderItem={(item, index) => (
                    <List.Item
                      key={item.id}
                      extra={
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: "edit",
                                label: "Modifier",
                                icon: <EditOutlined />,
                              },
                              {
                                key: "delete",
                                label: "Retirer",
                                icon: <CloseOutlined />,
                                danger: true,
                              },
                            ],
                            onClick: ({ key }) => {},
                          }}
                        >
                          <Button type="text" icon={<MoreOutlined />} />
                        </Dropdown>
                      }
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            style={{
                              backgroundColor: getHSLColor(
                                `${item.user.first_name} ${item.user.last_name} ${item.user.surname}`
                              ),
                            }}
                          >
                            {item.user.first_name?.charAt(0).toUpperCase()}
                            {item.user.last_name?.charAt(0).toUpperCase()}
                          </Avatar>
                        }
                        title={`${item?.user.first_name} ${item?.user.last_name} ${item?.user.surname}`}
                        description={item.academic_title}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div className="flex">
                  <Button type="link">Ajouter les membres</Button>
                </div>
              )}
            </div>
          </div>
        </Card>
        </Col>
      </Row>
        
      </Col>
    </Row>
  );
}
