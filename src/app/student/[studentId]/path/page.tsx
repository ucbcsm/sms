"use client";

import {
  Typography,
  Statistic,
  Row,
  Col,
  Card,
  Flex,
  Progress,
  Tabs,
} from "antd";
import { CoursesTab } from "./_components/courses/coursesTab";
import { useQueryState } from "nuqs";
import { GradesTab } from "./_components/grades/gradesTab";
import { AttendanceTab } from "./_components/attendance/attendanceTab";

export default function Page() {
  const [selectedTab, setSelectedTab] = useQueryState("tab");
  
  return (
    <div className="p-6">
      <Typography.Title type="secondary" level={5} style={{ marginBottom: 16 }}>
        Parcours académique
      </Typography.Title>

      {/* Résumé des crédits */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card>
            <Flex justify="space-between">
              <Statistic title="Total des crédits" value={180} />
              <Progress type="dashboard" percent={100} size={58} />
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card>
            <Flex justify="space-between">
              <Statistic title="Crédits validés" value={90} />
              <Progress type="dashboard" percent={50} size={58} />
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card>
            <Flex justify="space-between">
              <Statistic
                title="Nombre de cours"
                value={40} // Remplacez par le nombre total de cours
              />
              <Progress type="dashboard" percent={100} size={58} />
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card>
            <Flex justify="space-between">
              <Statistic title="Cours validés" value={20} />
              <Progress type="dashboard" percent={50} size={58} />
            </Flex>
          </Card>
        </Col>
      </Row>
      <Tabs
        items={[
          { key: "courses", label: "Cours", children: <CoursesTab /> },
          {
            key: "grades",
            label: "Relevé de notes",
            children: <GradesTab />,
          },
          {
            key: "attendance",
            label: "Attestation de fréquentation",
            children: <AttendanceTab />,
          },
        ]}
        activeKey={selectedTab || "courses"}
        onChange={(key) => setSelectedTab(key)}
      />
    </div>
  );
}
