"use client";

import { getFaculty } from "@/lib/api";
import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Progress,
  Row,
  Skeleton,
  Statistic,
} from "antd";
import { useParams } from "next/navigation";

export default function Page() {

  const {facultyId}=useParams()

   const {
    data: faculty,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["faculty", facultyId],
    queryFn: ({ queryKey }) => getFaculty(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  return (
    <Row gutter={[16, 16]}>
      <Col span={16}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic loading={isPending} title="Etudiants" value={"30"} />
               {!isPending? <Progress type="dashboard" percent={100} size={58} />:<Skeleton.Avatar size={58} active />}
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic loading={isPending} title="Hommes" value={"21"} />
                {!isPending?<Progress type="dashboard" percent={57.9} size={58} />:<Skeleton.Avatar size={58} active />}
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic loading={isPending} title="Femmes" value={"9"} />
               { !isPending?<Progress
                  type="dashboard"
                  percent={42.0}
                  size={58}
                  strokeColor="cyan"
                />:<Skeleton.Avatar size={58} active />}
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
                <Statistic loading={isPending} title="Département" value={"2"} />
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
                <Statistic loading={isPending} title="Taux de réussite" value={"95%"} />
              </Flex>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={8}>
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
            // {
            //   label: "Année académique",
            //   children: "2023-2024",
            // },
          ]}
        />
        </Card>
      </Col>
    </Row>
  );
}
