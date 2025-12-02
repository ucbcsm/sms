"use client";

import { Avatar, Select, Space, Table, Tag, theme, Typography } from "antd";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Class, CourseEnrollment, Department, PeriodEnrollment, TaughtCourse } from "@/types";
import { getHSLColor, getPublicR2Url } from "@/lib/utils";
import {
  getCurrentClassesAsOptions,
} from "@/lib/api";
import { CheckCircleFilled, CloseCircleOutlined } from "@ant-design/icons";

type ListNewCourseEnrollmentsProps = {
  course?:TaughtCourse;
  periodEnrollments?: PeriodEnrollment[];
  courseEnrollements?: CourseEnrollment[];
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<React.Key[]>>;
  departments?: Department[];
  classes?: Class[]; // Promotions
  departmentFilterValueId: number;
  setDepartmentFilterValueId: Dispatch<SetStateAction<number>>;
  classFilterValueId: number;
  setClassFilterValueId: Dispatch<SetStateAction<number>>;
};

export const ListNewCourseEnrollments: FC<ListNewCourseEnrollmentsProps> = ({
course,
  periodEnrollments,
  courseEnrollements,
  selectedRowKeys,
  setSelectedRowKeys,
  departments,
  classes,
  departmentFilterValueId,
  setDepartmentFilterValueId,
  classFilterValueId,
  setClassFilterValueId,
}) => {
  const {
    token: { colorTextDisabled },
  } = theme.useToken();

  const [filteredStudents, setFilteredStudents] = useState<PeriodEnrollment[]>(
    []
  );

  const existsInCourseEnrollments = (periodEnrollmentId: number) => {
    const exists = courseEnrollements?.some(
      (enrollment) => enrollment.student.id === periodEnrollmentId
    );

    return exists || false;
  };
const isPartOfDepartment = (departmentId: number) => {
  const exist = course?.departements.some((dep) => dep.id === departmentId);
  return exist || false;
};

  const filterStudentsByDepartment = (departmentId: number) => {
    let newfilteredStudents: PeriodEnrollment[] | undefined = [];

    if (departmentId !== 0) {
      newfilteredStudents = periodEnrollments?.filter(
        (student) => student.year_enrollment.departement.id === departmentId
      );
    } else {
      newfilteredStudents = periodEnrollments;
    }

    if (classFilterValueId !== 0) {
      newfilteredStudents = newfilteredStudents?.filter(
        (student) =>
          student.year_enrollment.class_year.id === classFilterValueId
      );
    }

    setFilteredStudents(newfilteredStudents!);
    setDepartmentFilterValueId(departmentId);
  };

  const filterStudentsByClass = (classId: number) => {
    let newfilteredStudents: PeriodEnrollment[] | undefined = [];
    if (classId !== 0) {
      newfilteredStudents = periodEnrollments?.filter(
        (student) => student.year_enrollment.class_year.id === classId
      );
    } else {
      newfilteredStudents = periodEnrollments;
    }
    if (departmentFilterValueId !== 0) {
      newfilteredStudents = newfilteredStudents?.filter(
        (student) =>
          student.year_enrollment.departement.id === departmentFilterValueId
      );
    }

    setFilteredStudents(newfilteredStudents!);
    setClassFilterValueId(classId);
  };

  const getDepartmentsAsOptions = (departments?: Department[]) => {
    return departments?.map((dep) => ({
      value: dep.id,
      label: dep.name,
      disabled: course?.departements.some((courseDep) => courseDep.id === dep.id) ? false : true,
    }));
  }

  useEffect(() => {
    setFilteredStudents(periodEnrollments!);
  }, [periodEnrollments]);

  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Étudiants
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Typography.Text type="secondary">Mention:</Typography.Text>
            <Select
              placeholder="Sélectionnez une mention"
              showSearch
              defaultValue={departmentFilterValueId}
              value={departmentFilterValueId}
              options={[
                { value: 0, label: "Toutes les mentions" },
                ...(getDepartmentsAsOptions(departments) || []),
              ]}
              onChange={(value) => {
                filterStudentsByDepartment(value);
              }}
            />
            <Typography.Text type="secondary">Promotion:</Typography.Text>
            <Select
              placeholder="Sélectionnez une promotion"
              showSearch
              defaultValue={classFilterValueId}
              value={classFilterValueId}
              options={[
                { value: 0, label: "Toutes les promotions" },
                ...getCurrentClassesAsOptions(classes)!,
              ]}
              onChange={(value) => {
                filterStudentsByClass(value);
              }}
            />
          </Space>
        </header>
      )}
      dataSource={filteredStudents}
      columns={[
        {
          title: "Photo",
          dataIndex: "avatar",
          key: "avatar",
          render: (_, record, __) => (
            <Avatar
              src={getPublicR2Url(record.year_enrollment.user.avatar)}
              style={{
                backgroundColor:
                  existsInCourseEnrollments(record.id) ||
                  !isPartOfDepartment(record.year_enrollment.departement.id)
                    ? colorTextDisabled
                    : getHSLColor(
                        `${record.year_enrollment.user.surname} ${record.year_enrollment.user.last_name} ${record.year_enrollment.user.first_name}`
                      ),
              }}
            >
              {record.year_enrollment.user.first_name?.charAt(0).toUpperCase()}
            </Avatar>
          ),
          width: 58,
          align: "center",
        },
        {
          title: "Matricule",
          dataIndex: "matricule",
          key: "matricule",
          width: 92,
          render: (_, record, __) => (
            <Typography.Text
              style={{
                color:
                  existsInCourseEnrollments(record.id) ||
                  !isPartOfDepartment(record.year_enrollment.departement.id)
                    ? colorTextDisabled
                    : "",
              }}
            >
              {record.year_enrollment.user.matricule}
            </Typography.Text>
          ),
          align: "center",
        },
        {
          title: "Noms",
          dataIndex: "available_course",
          key: "available_course",
          render: (_, record) => (
            <Typography.Text
              style={{
                color:
                  existsInCourseEnrollments(record.id) ||
                  !isPartOfDepartment(record.year_enrollment.departement.id)
                    ? colorTextDisabled
                    : "",
              }}
            >
              {record.year_enrollment.user.surname}{" "}
              {record.year_enrollment.user.last_name}{" "}
              {record.year_enrollment.user.first_name}
            </Typography.Text>
          ),
        },
        {
          title: "Promotion",
          dataIndex: "class",
          key: "class",
          render: (_, record, __) => (
            <Typography.Text
              style={{
                color:
                  existsInCourseEnrollments(record.id) ||
                  !isPartOfDepartment(record.year_enrollment.departement.id)
                    ? colorTextDisabled
                    : "",
              }}
            >
              {record.year_enrollment.class_year.acronym}{" "}
              {record.year_enrollment.departement.name}
            </Typography.Text>
          ),
        },
        {
          key: "check",
          title: "",
          render: (_, record) =>
            !isPartOfDepartment(record.year_enrollment.departement.id) ? (
              <Tag
                color="error"
                style={{ marginRight: 0, width: "100%" }}
                bordered={false}
                icon={<CloseCircleOutlined/>}
              >
                Pas concerné(e)
              </Tag>
            ) : existsInCourseEnrollments(record.id) ? (
              <Tag
                color="success"
                style={{ marginRight: 0, width: "100%" }}
                bordered={false}
                icon={<CheckCircleFilled />}
              >
                Déjà inscrit
              </Tag>
            ) : (
              ""
            ),
          width: 132,
        },
      ]}
      rowSelection={{
        type: "checkbox",
        selectedRowKeys: selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
          setSelectedRowKeys(newSelectedRowKeys);
        },
        getCheckboxProps: (record) => ({
          disabled:
            existsInCourseEnrollments(record.id) ||
            !isPartOfDepartment(record.year_enrollment.departement.id),
          checked:
            existsInCourseEnrollments(record.id) ||
            !isPartOfDepartment(record.year_enrollment.departement.id),
        }),
      }}
      rowKey="id"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      scroll={{ y: "calc(100vh - 263px)" }}
      size="small"
      pagination={false}
      onRow={(record) => ({
        onClick: () => {
          if (
            !existsInCourseEnrollments(record.id) &&
            isPartOfDepartment(record.year_enrollment.departement.id)
          ) {
            const exist = selectedRowKeys.includes(record.id);
            if (exist) {
              setSelectedRowKeys((prev) => prev.filter((i) => i !== record.id));
            } else {
              setSelectedRowKeys((prev) => [...prev, record.id]);
            }
          }
        },
      })}
    />
  );
};
