import React, { FC } from 'react';
import { Table, Space, Typography} from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getStudentPeriodGrades } from '@/lib/api/grade-report';
import { parseAsInteger, useQueryState } from 'nuqs';

type PeriodGradesTabProps={
  userId?:number
}


export const PeriodGradesTab: FC<PeriodGradesTabProps> = ({ userId }) => {

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));
  const [pageSize, setPageSize] = useQueryState(
    "size",
    parseAsInteger.withDefault(0)
  );

  const { data, isPending } = useQuery({
    queryKey: ["student-period-grades", userId, page, pageSize],
    queryFn: ({ queryKey }) =>
      getStudentPeriodGrades({
        userId: Number(queryKey[1]),
        page: page !== 0 ? page : undefined,
        pageSize: pageSize !== 0 ? pageSize : undefined,
      }),
    enabled: !!userId,
  });

  console.log(data);

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
              title: "Semestre",
              dataIndex: "period",
              key: "period",
              render: (_, record) =>
                `${record.period.name} ${record.period.acronym}`,
            },
            {
              title: "Année",
              dataIndex: "year",
              key: "year",
              render: (_, record) =>
                record.student.year_enrollment.academic_year.name,
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
              key: "period_decision",
              dataIndex: "period_decision",
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
          rowKey="id"
          pagination={{
        defaultPageSize: 25,
        pageSizeOptions: [25, 50, 75, 100],
        size: "small",
        showSizeChanger: true,
        total: data?.count,
        current: page !== 0 ? page : 1,
        pageSize: pageSize !== 0 ? pageSize : 25,
        onChange: (page, pageSize) => {
          setPage(page);
          setPageSize(pageSize);
        },
      }}
        />
      </Space>
    </div>
  );
};
