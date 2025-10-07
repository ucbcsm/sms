import React from 'react';
import { Card, Table, Progress, Tag, Space, Typography, Button } from 'antd';
import { DownloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const AttendanceTab = () => {
  // Données simulées pour la fréquentation
  const attendanceData = [
    {
      key: '1',
      subject: 'Mathématiques',
      totalHours: 30,
      attendedHours: 28,
      attendanceRate: 93.3,
      status: 'Satisfaisant'
    },
    {
      key: '2',
      subject: 'Physique',
      totalHours: 25,
      attendedHours: 22,
      attendanceRate: 88.0,
      status: 'Satisfaisant'
    },
    {
      key: '3',
      subject: 'Informatique',
      totalHours: 40,
      attendedHours: 40,
      attendanceRate: 100.0,
      status: 'Excellent'
    },
    {
      key: '4',
      subject: 'Anglais',
      totalHours: 20,
      attendedHours: 15,
      attendanceRate: 75.0,
      status: 'À améliorer'
    }
  ];

  const overallAttendance = () => {
    const totalHours = attendanceData.reduce(
      (sum, item) => sum + item.totalHours,
      0
    );
    const attendedHours = attendanceData.reduce(
      (sum, item) => sum + item.attendedHours,
      0
    );
    return totalHours > 0 ? ((attendedHours / totalHours) * 100).toFixed(1) : 0;
  };

  return (
    <div style={{}}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Space size="large" align="start">
            <div>
              <Text>Taux de présence global : </Text>
              <Progress
                type="circle"
                percent={Number(overallAttendance())}
                strokeColor={
                  Number(overallAttendance()) >= 90
                    ? "#52c41a"
                    : Number(overallAttendance()) >= 75
                    ? "#1890ff"
                    : "#ff4d4f"
                }
                size={96}
              />
            </div>

            <Space direction="vertical">
              <div>
                <Text strong>Formation : </Text>
                <Text>Licence Informatique</Text>
              </div>
              <div>
                <Text strong>Années : </Text>
                <Text>2023-2024, 2024-2025, 2025-2026, 2026-2027</Text>
              </div>

              <Button
                type="primary"
                icon={<DownloadOutlined />}
                style={{ boxShadow: "none" }}
              >
                Télécharger l&apos;attestation
              </Button>
            </Space>
          </Space>
        </Card>

        {/* <Card title="Détail de la fréquentation par matière">
          <Table
            columns={[
              {
                title: "Matière",
                dataIndex: "subject",
                key: "subject",
              },
              {
                title: "Heures totales",
                dataIndex: "totalHours",
                key: "totalHours",
                render: (hours) => `${hours}h`,
              },
              {
                title: "Heures suivies",
                dataIndex: "attendedHours",
                key: "attendedHours",
                render: (hours) => `${hours}h`,
              },
              {
                title: "Taux de présence",
                dataIndex: "attendanceRate",
                key: "attendanceRate",
                render: (rate) => (
                  <Progress
                    percent={rate}
                    size="small"
                    strokeColor={
                      rate >= 90
                        ? "#52c41a"
                        : rate >= 75
                        ? "#1890ff"
                        : "#ff4d4f"
                    }
                  />
                ),
              },
              {
                title: "Statut",
                dataIndex: "status",
                key: "status",
                render: (status) => {
                  const color =
                    status === "Excellent"
                      ? "success"
                      : status === "Satisfaisant"
                      ? "processing"
                      : "error";

                  const icon =
                    status === "Excellent" ? (
                      <CheckCircleOutlined />
                    ) : status === "Satisfaisant" ? (
                      <CheckCircleOutlined />
                    ) : (
                      <CloseCircleOutlined />
                    );

                  return (
                    <Tag icon={icon} color={color}>
                      {status}
                    </Tag>
                  );
                },
              },
            ]}
            dataSource={attendanceData}
            pagination={false}
          />
        </Card> */}
      </Space>
    </div>
  );
};
