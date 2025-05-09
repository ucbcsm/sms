"use client";

import { Card, Col, Descriptions, Flex, Progress, Row, Statistic } from "antd";

export default function Page() {
  return (
    <Row gutter={24}>
      <Col span={18}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card>
              <Statistic title="Grade académique" value="Doctorat (Phd)" />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Statut" value="Actif" />
                <Progress type="dashboard" size={58} percent={100} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Nombre de cours" value={5} />
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
            title="Informations professionnelles"
            column={1}
            items={[
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
              {
                key: "experience",
                label: "Années d'expérience",
                children: "10 ans",
              },
            ]}
          />
        </Card>
      </Col>
    </Row>
  );
}
