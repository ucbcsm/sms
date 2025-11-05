import React, { FC } from "react";
import { Table, Space, Typography, Button, Popover, Tag, Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getStudentYearGrades } from "@/lib/api/grade-report";
import { parseAsInteger, parseAsStringEnum, useQueryState } from "nuqs";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  getDecisionColor,
  getDecisionText,
  getMomentText,
  getSessionText,
} from "@/lib/api";
import { ViewYearGradeReport } from "./viewYearGradeReport";

type YearGradesTabProps = {
  userId?: number;
};

export const YearGradesTab: FC<YearGradesTabProps> = ({ userId }) => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));
  const [pageSize, setPageSize] = useQueryState(
    "size",
    parseAsInteger.withDefault(0)
  );
  const [session, setSession] = useQueryState(
    "session",
    parseAsStringEnum(["all","main_session", "retake_session"]).withDefault(
      "all"
    )
  );
  const [moment, setMoment] = useQueryState(
    "moment",
    parseAsStringEnum(["all", "before_appeal", "after_appeal"]).withDefault(
      "all"
    )
  );

  const { data, isPending } = useQuery({
    queryKey: ["student-year-grades", userId, session, moment, page, pageSize],
    queryFn: ({ queryKey }) =>
      getStudentYearGrades({
        userId: Number(queryKey[1]),
        page: page !== 0 ? page : undefined,
        pageSize: pageSize !== 0 ? pageSize : undefined,
        session: session !== "all" ? session : undefined,
        moment: moment !== "all" ? moment : undefined,
      }),
    enabled: !!userId,
  });

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
          title={() => (
            <header className="flex pb-1 px-2">
              <Space></Space>
              <div className="flex-1" />
              <Space>
                <Typography.Text type="secondary">Session: </Typography.Text>
                <Select
                  variant="filled"
                  placeholder="Session"
                  value={session}
                  options={[
                    { value: "all", label: "Toutes les sessions" },
                    { value: "main_session", label: "Principale" },
                    { value: "retake_session", label: "Rattrapage" },
                  ]}
                  style={{ width: 180 }}
                  onSelect={(value) => {
                    setSession(
                      value as "all" | "main_session" | "retake_session"
                    );
                  }}
                />
                <Typography.Text type="secondary">Moment: </Typography.Text>
                <Select
                  variant="filled"
                  placeholder="Moment"
                  value={moment}
                  options={[
                    { value: "all", label: "Tous les moments" },
                    { value: "before_appeal", label: "Avant recours" },
                    { value: "after_appeal", label: "Après recours" },
                  ]}
                  style={{ width: 150 }}
                  onSelect={(value) => {
                    setMoment(
                      value as "all" | "before_appeal" | "after_appeal"
                    );
                  }}
                />
              </Space>
            </header>
          )}
          size="small"
          loading={isPending}
          columns={[
            {
              title: "Année",
              dataIndex: "year",
              key: "year",
              render: (_, record) => record.student.academic_year.name,
            },
            {
              key: "session",
              dataIndex: "session",
              title: "Session",
              render: (_, record) => getSessionText(record.session),
              width: 120,
            },
            {
              key: "moment",
              dataIndex: "moment",
              title: "Moment",
              render: (_, record) => getMomentText(record.moment),
              width: 120,
            },
            {
              title: "Moyenne",
              dataIndex: "weighted_average",
              key: "weighted_average",
              render: (value) => <Typography.Text>{value}/20</Typography.Text>,
              width: 80,
              align: "right",
            },
            {
              title: "Pourcentage",
              dataIndex: "percentage",
              key: "percentage",
              render: (value) => value,
              width: 102,
              align: "right",
            },
            {
              key: "grade_letter",
              dataIndex: "grade_letter",
              title: "Grade",
              render: (_, record) => (
                <Space>
                  <Typography.Text strong>
                    {record.grade_letter.grade_letter}
                  </Typography.Text>
                  {record.grade_letter?.grade_letter && (
                    <Popover
                      content={record.grade_letter?.appreciation}
                      title="Appréciation"
                    >
                      <Button
                        type="text"
                        icon={<QuestionCircleOutlined />}
                        shape="circle"
                        size="small"
                      />
                    </Popover>
                  )}
                </Space>
              ),
              width: 74,
            },
            {
              key: "final_decision",
              dataIndex: "final_decision",
              title: "Décision",
              render: (_, record) => (
                <Tag
                  color={getDecisionColor(record.final_decision)}
                  bordered={false}
                  style={{ marginRight: 0, width: "100%", textAlign: "center" }}
                >
                  {getDecisionText(record.final_decision)}
                </Tag>
              ),
              width: 96,
            },
            {
              title: "",
              key: "actions",
              render: (_, record) => (
                <ViewYearGradeReport
                  yearGradeId={record.id}
                  yearGrade={record}
                />
              ),
              width: 116,
            },
          ]}
          dataSource={data?.results}
          rowKey="id"
          bordered
          scroll={{ y: "calc(100vh - 477px)" }}
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
