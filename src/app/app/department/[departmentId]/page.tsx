"use client";

import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Progress,
  Row,
  Statistic,
} from "antd";

export default function Page() {
  return (
    <Row gutter={[16, 16]}>
      <Col span={16}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Etudiants" value={"30"} />
                <Progress type="dashboard" percent={100} size={58} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Hommes" value={"21"} />
                <Progress type="dashboard" percent={57.9} size={58} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Femmes" value={"9"} />
                <Progress
                  type="dashboard"
                  percent={42.0}
                  size={58}
                  strokeColor="cyan"
                />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Actifs" value={"30"} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Abandons" value={"0"} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Promotions" value={8} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Programmes" value={"6"} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Personnel" value={"5"} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Taux de réussite" value={"95%"} />
              </Flex>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={8}>
        <Descriptions
          title="Détails sur le département"
          extra={
            <Button type="link" icon={<EditOutlined />}>
              Modifier
            </Button>
          }
          column={1}
          items={[
            {
              label: "Code",
              children: "GI01",
            },
            {
              label: "Nom",
              children: "Nom du département",
            },
            {
              label: "Faculté",
              children: "Nom de la faculté",
            },
            {
              label: "Domaine",
              children: "Nom du domaine",
            },
            {
              label: "Année académique",
              children: "2023-2024",
            },
          ]}
        />
      </Col>
    </Row>
  );
}
