"use client";

import { Card, Col, Descriptions, Flex, Progress, Row, Statistic } from "antd";

export default function Page() {
  return (
    <Row gutter={24}>
      <Col span={18}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card>
              <Statistic title="Promotion actuelle" value="L2" />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Statut académique" value="Actif" />
                <Progress type="dashboard" size={58} percent={100} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Présences" value="95" />
                <Progress
                  type="dashboard"
                  percent={95}
                  size={58}
                  strokeColor="red"
                />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Résultat S1" value="60%" />
                {/* <Progress type="dashboard" percent={60} size={58} /> */}
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Résultat S2" value="62%" />
                {/* <Progress type="dashboard" percent={62} size={58} /> */}
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Moyenne générale" value="61%" />
                {/* <Progress type="dashboard" percent={61} size={58} /> */}
              </Flex>
            </Card>
          </Col>
          
          <Col span={8}>
            <Card>
              <Statistic
                title="Frais payés"
                value={`${new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: "USD",
                }).format(200)} / ${new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: "USD",
                }).format(500)}`}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Dernière mise à jour"
                value={`${new Intl.DateTimeFormat("fr", {
                  dateStyle: "long",
                }).format(new Date())}`}
              />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={6}>
        <Card>
          <Descriptions
            title="Filières"
            column={1}
            items={[
              {
                key: "domaine",
                label: "Domaine",
                children: "Sciences et Technologies",
              },
              {
                key: "faculte",
                label: "Faculté",
                children: "Faculté des Sciences Informatiques",
              },
              {
                key: "departement",
                label: "Département",
                children: "Informatique",
              },
              {
                key: "specialisation",
                label: "Spécialisation",
                children: "Développement Logiciel",
              },
            ]}
          />
        </Card>
      </Col>
    </Row>
  );
}
