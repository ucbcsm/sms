'use client'
import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import {
  Classroom,
  Course,
  Department,
  Faculty,
  Period,
  TaughtCourse,
  Teacher,
  TeachingUnit,
} from "@/types";

import { Button, Descriptions, Space, Tag } from "antd";
import { FC, useState } from "react";
import { getCourseTypeName, getYearStatusName } from "@/lib/api";
import { EditOutlined } from "@ant-design/icons";
import { EditTaughtCourseForm } from "@/app/app/faculty/[facultyId]/taught-courses/forms/edit";

type TaughtCourseDetailsProps = {
  data?: TaughtCourse;
  isError: boolean;
  departments?: Department[];
  faculties?: Faculty[];
  courses?: Course[];
  teachers?: Teacher[];
  periods?: Period[];
  teachingUnits?: TeachingUnit[];
  classrooms?: Classroom[];
};

export const TaughtCourseDetails: FC<TaughtCourseDetailsProps> = ({
  data,
  isError,
  faculties,
  departments,
  teachers,
  periods,
  classrooms,
  courses,
  teachingUnits,
}) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  if (isError) {
    return <DataFetchErrorResult />;
  }

  if (data)
    return (
      <>
        <EditTaughtCourseForm
          open={openEdit}
          setOpen={setOpenEdit}
          taughtCourse={data}
          faculties={faculties}
          departments={departments}
          periods={periods}
          teachers={teachers}
          courses={courses}
          teachingUnits={teachingUnits}
          classrooms={classrooms}
        />
        <Space
          direction="vertical"
          size="middle"
          style={{
            padding: "16px 0 40px 28px",
            width: "100%",
            height: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
        >
          <Descriptions
            title="Département"
            column={1}
            items={[
              {
                key: "name",
                label: "Nom",
                children: data?.departement.name || "",
              },
              {
                key: "code",
                label: "Code",
                children: data?.departement.acronym || "",
              },
              {
                key: "year",
                label: "Année",
                children: data?.academic_year?.name || "",
              },
              {
                key: "year",
                label: "Période",
                children: `${data?.period?.name} ${
                  data.period?.acronym && `(${data.period?.acronym})`
                }`,
              },
              {
                key: "faculty",
                label: "Faculté",
                children: data?.faculty.name || "",
              },
            ]}
          />
          <Descriptions
            title="Détails du cours"
            extra={
              <Button
                icon={<EditOutlined />}
                type="link"
                // style={{ marginRight: 16 }}
                onClick={() => setOpenEdit(true)}
              />
            }
            column={1}
            items={[
              {
                key: "name",
                label: "Intitulé",
                children: data?.available_course.name || "",
              },
              {
                key: "code",
                label: "Code du cours",
                children: data?.available_course.code || "",
              },
              {
                key: "category",
                label: "Catégorie",
                children: getCourseTypeName(data?.available_course.code) || "",
              },
              {
                key: "credits",
                label: "Crédits",
                children: data?.credit_count || "",
              },
              {
                key: "max",
                label: "Note maximale",
                children: data.max_value || "",
              },
              {
                key: "hours",
                label: "Heures",
                children:
                  data?.theoretical_hours! + data?.practical_hours! || "",
              },
              {
                key: "theoretical_hours",
                label: "Heures théoriques",
                children: data?.theoretical_hours || "",
              },
              {
                key: "practical_hours",
                label: "Heures pratiques",
                children: data?.practical_hours || "",
              },
              {
                key: "teaching_unit",
                label: "UE",
                children: `${data.teaching_unit?.name} ${
                  data.teaching_unit?.code && `(${data.teaching_unit?.code})`
                }`,
              },
              {
                key: "start_date",
                label: "Date de début",
                children: data.start_date
                  ? new Intl.DateTimeFormat("fr", { dateStyle: "long" }).format(
                      new Date(`${data.start_date}`)
                    )
                  : "",
              },
              {
                key: "end_date",
                label: "Date de fin",
                children: data.end_date
                  ? new Intl.DateTimeFormat("fr", { dateStyle: "long" }).format(
                      new Date(`${data.end_date}`)
                    )
                  : "",
              },
              {
                key: "status",
                label: "Statut",
                children: (
                  <Tag bordered={false}>{getYearStatusName(data?.status!)}</Tag>
                ),
              },
            ]}
          />
        </Space>
      </>
    );

  return (
    <div className="p-6">
      <DataFetchPendingSkeleton />
    </div>
  );
};
