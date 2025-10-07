import React from 'react';
import { Card, Table, Tag, Space, Typography, Statistic, Divider } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const GradesTab = () => {
  // Données simulées pour le relevé de notes
  const gradesData = [
    {
      key: '1',
      subject: 'Mathématiques',
      grade: 16,
      coefficient: 4,
      status: 'Validé',
      date: '2024-01-15'
    },
    {
      key: '2',
      subject: 'Physique',
      grade: 14,
      coefficient: 3,
      status: 'Validé',
      date: '2024-01-18'
    },
    {
      key: '3',
      subject: 'Informatique',
      grade: 18,
      coefficient: 5,
      status: 'Validé',
      date: '2024-01-20'
    },
    {
      key: '4',
      subject: 'Anglais',
      grade: 12,
      coefficient: 2,
      status: 'En cours',
      date: '2024-02-01'
    }
  ];

  const calculateAverage = () => {
    const total = gradesData.reduce((sum, item) => {
      if (item.status === 'Validé') {
        return sum + (item.grade * item.coefficient);
      }
      return sum;
    }, 0);
    
    const totalCoefficients = gradesData.reduce((sum, item) => {
      if (item.status === 'Validé') {
        return sum + item.coefficient;
      }
      return sum;
    }, 0);
    
    return totalCoefficients > 0 ? (total / totalCoefficients).toFixed(2) : 0;
  };

  return (
    <div style={{}}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Space size="large">
            <div>
              <Statistic
                title="Moyenne générale"
                value={calculateAverage()}
                suffix="/20"
                valueStyle={{ color: "#1890ff" }}
              />
            </div>
            <Divider type="vertical" />
            <div>
              <Statistic
                title="Matières validées"
                value={
                  gradesData.filter((item) => item.status === "Validé").length
                }
                valueStyle={{ color: "#52c41a" }}
              />
            </div>
          </Space>
        </Card>

        <Table
          columns={[
            {
              title: "Semestre",
              dataIndex: "semester",
              key: "semester",
            },
            {
              title: "Année",
              dataIndex: "year",
              key: "year",
            },
            {
              title: "Moyenne",
              dataIndex: "average",
              key: "average",
              render: (average) => <Text strong>{average}/20</Text>,
            },
            {
              title: "Matières validées",
              dataIndex: "validatedSubjects",
              key: "validatedSubjects",
            },
            {
              title: "Statut",
              dataIndex: "status",
              key: "status",
              render: (status) => (
                <Tag
                  icon={
                    status === "Validé" ? (
                      <CheckCircleOutlined />
                    ) : (
                      <ClockCircleOutlined />
                    )
                  }
                  color={status === "Validé" ? "success" : "processing"}
                >
                  {status}
                </Tag>
              ),
            },
            {
              title: "Télécharger",
              key: "download",
              render: (_, record) => (
                <a
                  href={`/api/grades/download?semester=${record.semester}&year=${record.year}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Télécharger
                </a>
              ),
            },
          ]}
          dataSource={[
            {
              key: "1",
              semester: "Semestre 1",
              year: "2023-2024",
              average: "15.67",
              validatedSubjects: 3,
              status: "Validé",
            },
            {
              key: "2",
              semester: "Semestre 2",
              year: "2023-2024",
              average: "14.25",
              validatedSubjects: 2,
              status: "En cours",
            },
          ]}
          pagination={false}
        />
      </Space>
    </div>
  );
};
