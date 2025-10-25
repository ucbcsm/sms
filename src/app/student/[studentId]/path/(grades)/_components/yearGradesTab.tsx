import React, { FC } from 'react';
import { Card, Table, Tag, Space, Typography, Statistic, Divider, Tabs } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getStudentYearGrades } from '@/lib/api/grade-report';
import { record } from 'zod';

type YearGradesTabProps={
  userId?:number;
}

export const YearGradesTab:FC<YearGradesTabProps> = ({userId}) => {
   const { data, isPending } = useQuery({
     queryKey: ["student-year-grades", userId],
     queryFn: ({ queryKey }) =>
       getStudentYearGrades({ userId: Number(queryKey[1]) }),
     enabled: !!userId,
   });

  console.log(data);
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
        {/* <Card>
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
        </Card> */}

        <Table
          size="small"
          loading={isPending}
          columns={[
            {
              title: "Année",
              dataIndex: "year",
              key: "year",
              render: (_, record) => record.student.academic_year.name,
              width: 86,
            },
            {
              key: "session",
              dataIndex: "session",
              title: "Session",
            },
            {
              key: "moment",
              dataIndex: "moment",
              title: "Moment",
            },
            {
              title: "Moyenne",
              dataIndex: "weighted_average",
              key: "weighted_average",
              render: (value) => <Typography.Text>{value}/20</Typography.Text>,
            },
            {
              title: "Pourcentage",
              dataIndex: "percentage",
              key: "percentage",
              render: (value) => value,
            },
            {
              key: "grade_letter",
              dataIndex: "grade_letter",
              title: "Grade",
              render: (_, record) => record.grade_letter.grade_letter,
            },
            {
              key: "final_decision",
              dataIndex: "final_decision",
              title: "Décision",
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
          dataSource={data?.results}
          pagination={false}
        />
      </Space>
    </div>
  );
};
