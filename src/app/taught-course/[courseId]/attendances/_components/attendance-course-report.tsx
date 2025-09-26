"use client";

import {
  getAttendanceCourseReport,
  getCourseTypeName,
  getTeachingUnitCategoryName,
  getYearStatusName,
} from "@/lib/api";
import { TaughtCourse } from "@/types";
import {
  CheckCircleOutlined,
  CloseOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Result,
  Row,
  Select,
  Space,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { FC, useRef } from "react";
import { PrintableAttendanceReport } from "./printable-attendance-report";
import { useReactToPrint } from "react-to-print";

type AttendanceCourseReportProps = {
  course?: TaughtCourse;
};

export const AttendanceCourseReport: FC<AttendanceCourseReportProps> = ({
  course,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const { courseId } = useParams();
  const [open, setOpen] = useQueryState(
    "view-report",
    parseAsBoolean.withDefault(false)
  );

  const [reached, setReached] = useQueryState(
    "attendance_reached",
    parseAsString.withDefault("all")
  );

  const refToPrint = useRef<HTMLDivElement | null>(null);

   const printList = useReactToPrint({
     contentRef: refToPrint,
     documentTitle: `Rapport-presence-${course?.available_course.name.replaceAll(
       " ",
       "-"
     )}-${course?.academic_year?.name}`,
   });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["attendance-course-report", courseId, reached],
    queryFn: ({ queryKey }) =>
      getAttendanceCourseReport({
        courseId: Number(courseId),
        attendance_reached:
          reached === "all" ? undefined : reached === "true" ? true : false,
      }),
    enabled: !!courseId,
  });

  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        variant="dashed"
        color="primary"
        icon={<CheckCircleOutlined />}
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Rapport d&apos;assiduité
      </Button>
      <Drawer
        open={open}
        onClose={onClose}
        destroyOnHidden
        maskClosable={false}
        closable={false}
        width="100%"
        styles={{
          header: { background: colorPrimary, color: "#fff" },
          body: {},
        }}
        title={
          <Space>
            <Typography.Title level={5} style={{ color: "#fff" }}>
              Rapport de présences
            </Typography.Title>
          </Space>
        }
        extra={
          <Space>
            <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
          </Space>
        }
      >
        <div
          className=" max-w-7xl mx-auto"
          style={{ display: !isError ? "block" : "none" }}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={24} lg={6}>
              <Card
                style={{ borderRadius: 0, boxShadow: "none" }}
                variant="borderless"
              >
                <Descriptions
                  title="Détails du cours"
                  column={1}
                  items={[
                    {
                      key: "",
                      label: "Code",
                      children: course?.available_course.code || "",
                    },
                    {
                      key: "",
                      label: "Intitulé",
                      children: course?.available_course.name || "",
                    },
                    {
                      key: "category",
                      label: "Catégorie",
                      children: course
                        ? getCourseTypeName(
                            course?.available_course.course_type
                          )
                        : "",
                    },
                    {
                      key: "credits",
                      label: "Crédits",
                      children: course?.credit_count || "",
                    },
                    {
                      key: "max",
                      label: "Note maximale",
                      children: course?.max_value || "",
                    },
                    {
                      key: "hours",
                      label: "Heures",
                      children:
                        course?.theoretical_hours! + course?.practical_hours! ||
                        "",
                    },
                    {
                      key: "theoretical_hours",
                      label: "Heures théoriques",
                      children: course?.theoretical_hours || "",
                    },
                    {
                      key: "practical_hours",
                      label: "Heures pratiques",
                      children: course?.practical_hours || "",
                    },
                    {
                      key: "teaching_unit",
                      label: "UE",
                      children: `${course?.teaching_unit?.name} ${
                        course?.teaching_unit?.code &&
                        `(${course.teaching_unit?.code})`
                      }`,
                    },
                    {
                      key: "teaching_unit_category",
                      label: "Catgorie UE",
                      children: getTeachingUnitCategoryName(
                        course?.teaching_unit?.category!
                      ),
                    },
                    {
                      key: "start_date",
                      label: "Date de début",
                      children: course?.start_date
                        ? new Intl.DateTimeFormat("fr", {
                            dateStyle: "long",
                          }).format(new Date(`${course.start_date}`))
                        : "",
                    },
                    {
                      key: "end_date",
                      label: "Date de fin",
                      children: course?.end_date
                        ? new Intl.DateTimeFormat("fr", {
                            dateStyle: "long",
                          }).format(new Date(`${course?.end_date}`))
                        : "",
                    },
                    {
                      key: "status",
                      label: "Statut",
                      children: (
                        <Tag bordered={false}>
                          {getYearStatusName(course?.status!)}
                        </Tag>
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={18}>
              <Card style={{}} styles={{ body: {} }}>
                <Table
                  title={() => (
                    <header className="flex pb-3">
                      <Space>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                          Étudiants
                        </Typography.Title>
                      </Space>
                      <div className="flex-1" />
                      <Space>
                        <Select
                          variant="filled"
                          value={reached}
                          options={[
                            { value: "all", label: "Tous" },
                            { value: "true", label: "Requis" },
                            { value: "false", label: "Non requis" },
                          ]}
                          style={{ width: 120 }}
                          onSelect={(value) => {
                            setReached(value);
                          }}
                        />
                        <Button
                          icon={<PrinterOutlined />}
                          color="primary"
                          variant="dashed"
                          disabled={isPending || !data || data.length === 0}
                          style={{ boxShadow: "none" }}
                          onClick={printList}
                        >
                          Imprimer
                        </Button>
                      </Space>
                    </header>
                  )}
                  dataSource={data}
                  columns={[
                    {
                      key: "matricule",
                      dataIndex: "matricule",
                      title: "Maticule",
                      width: 72,
                      align: "right",
                    },
                    {
                      title: "Noms",
                      dataIndex: "name",
                      key: "date",
                      render: (_, record, __) => record.student,
                    },
                    {
                      key: "class_year",
                      dataIndex: "class_year",
                      title: "Promotion",
                      render: (_, record, __) =>
                        `${record.class_year} ${record.departement}`,
                    },
                    {
                      key: "percentage",
                      dataIndex: "percentage",
                      title: "Assiduité",
                      render: (value) => `${value || 0}%`,
                      width: 74,
                      align: "right",
                    },
                    {
                      key: "required_attendance_reached",
                      dataIndex: "required_attendance_reached",
                      title: "Requis",
                      render: (_, record, __) => (
                        <Tag
                          color={
                            record.required_attendance_reached
                              ? "success"
                              : "error"
                          }
                          bordered={false}
                          style={{ marginRight: 0, width: "100%" }}
                        >
                          {record.required_attendance_reached ? "OUI" : "NON"}
                        </Tag>
                      ),
                      width: 64,
                    },
                  ]}
                  rowKey="id"
                  rowClassName={`bg-[#f5f5f5] odd:bg-white`}
                  scroll={{ y: "calc(100vh - 262px)" }}
                  loading={isPending}
                  size="small"
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </div>
        {isError && (
          <Result
            title="Erreur de récupération des données"
            subTitle={
              error
                ? (error as any)?.response?.data?.message
                : "Une erreur est survenue lors de la tentative de récupération des données depuis le serveur. Veuillez réessayer."
            }
            status={"error"}
            extra={
              <Button
                type="link"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Réessayer
              </Button>
            }
          />
        )}
      </Drawer>
      <PrintableAttendanceReport ref={refToPrint} data={data} course={course} />
    </>
  );
};
