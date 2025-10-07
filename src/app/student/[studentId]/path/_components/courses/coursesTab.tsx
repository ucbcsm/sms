"use client";

import { Select, Space, Table } from "antd";
import { useState } from "react";

export const CoursesTab = () => {
     const [academicYearFilter, setAcademicYearFilter] = useState<
       string | null
     >(null);

  const dataSource = [
    {
      key: "1",
      course: "Mathématiques Avancées",
      grade: "A",
      credits: 5,
      academicYear: "2022-2023",
    },
    {
      key: "2",
      course: "Physique Quantique",
      grade: "B+",
      credits: 4,
      academicYear: "2022-2023",
    },
    {
      key: "3",
      course: "Programmation en TypeScript",
      grade: "A+",
      credits: 3,
      academicYear: "2022-2023",
    },
    {
      key: "4",
      course: "Histoire de l'Art",
      grade: "B",
      credits: 2,
      academicYear: "2021-2022",
    },
    {
      key: "5",
      course: "Analyse des Données",
      grade: "A",
      credits: 4,
      academicYear: "2021-2022",
    },
  ];

  const filteredDataSource = academicYearFilter
    ? dataSource.filter((item) => item.academicYear === academicYearFilter)
    : dataSource;

  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Select
              placeholder="Filtrer par année académique"
              style={{ width: "100%" }}
              allowClear
              onChange={(value) => setAcademicYearFilter(value)}
              options={[
                { value: "2022-2023", label: "2022-2023" },
                { value: "2021-2022", label: "2021-2022" },
              ]}
            />
          </Space>
          <div className="flex-1" />
          <Space></Space>
        </header>
      )}
      dataSource={filteredDataSource}
      columns={[
        {
          title: "Cours",
          dataIndex: "course",
          key: "course",
        },
        {
          title: "Note",
          dataIndex: "grade",
          key: "grade",
        },
        {
          title: "Crédits",
          dataIndex: "credits",
          key: "credits",
        },
        {
          title: "Année",
          dataIndex: "academicYear",
          key: "academicYear",
        },
      ]}
      rowKey="key"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      size="small"
      pagination={{
        defaultPageSize: 10,
        pageSizeOptions: [10, 20, 50],
        size: "small",
      }}
    />
  );
};
