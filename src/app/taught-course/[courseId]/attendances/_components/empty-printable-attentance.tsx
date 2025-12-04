'use client';

import { DocHeader } from "@/components/doc-header";
import { CourseEnrollment, TaughtCourse } from "@/types";
import { BulbOutlined, CloseOutlined, PrinterOutlined } from "@ant-design/icons";
import { Alert, Button, Descriptions, Drawer, Form, InputNumber, Space, Table, theme, Typography } from "antd";
import { Dispatch, FC, SetStateAction, useRef } from "react";
import { useReactToPrint } from "react-to-print";

type EmptyPrintableAttendanceProps = {
    course?:TaughtCourse;
    students?:CourseEnrollment[],
    open:boolean;
    setOpen:Dispatch<SetStateAction<boolean>>;
};

export const EmptyPrintableAttendance: FC<EmptyPrintableAttendanceProps> = ({
  course,
  students,
  open,
  setOpen,
}) => {
  const {
    token: { colorBgLayout },
  } = theme.useToken();
const [form] = Form.useForm();
const numberOfSessions = Form.useWatch("number_of_sessions", form);
  const refToPrint = useRef<HTMLDivElement | null>(null);
  
     const printList = useReactToPrint({
       contentRef: refToPrint,
       documentTitle: `Fiche-de-presence-${course?.available_course.name.replaceAll(
         " ",
         "-"
       )}-${course?.academic_year?.name}`,
     });

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const onFinish = (values: any) => {
    printList();
  }

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        destroyOnHidden
        maskClosable={false}
        closable={false}
        width="100%"
        styles={{
          body: { background: colorBgLayout },
        }}
        title={
          <Space>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Fiche de présences vide -
            </Typography.Title>
            <Typography.Title
              level={5}
              style={{ marginBottom: 0 }}
              type="success"
            >
              {course?.available_course.name}
            </Typography.Title>
          </Space>
        }
        extra={
          <Space>
            <Form form={form} layout="inline" onFinish={onFinish}>
              <Form.Item
                label="Nombre de séances"
                name="number_of_sessions"
                rules={[{ required: true }]}
                initialValue={15}
              >
                <InputNumber min={1} max={60} />
              </Form.Item>
              <Form.Item>
                <Button
                  icon={<PrinterOutlined />}
                  type="primary"
                  style={{ boxShadow: "none" }}
                  htmlType="submit"
                >
                  Imprimer la fiche
                </Button>
              </Form.Item>
            </Form>
            <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
          </Space>
        }
      >
        <Table
          size="small"
          bordered
          dataSource={students}
          columns={[
            {
              title: "N°",
              dataIndex: "index",
              key: "index",
              render: (_value, _record, index) => index + 1,
              width: 52,
              align: "right",
              fixed: "left",
            },
            {
              title: "Noms",
              dataIndex: "name",
              key: "name",
              render: (_, record, __) =>
                `${record.student.year_enrollment.user.surname} ${record.student.year_enrollment.user.last_name} ${record.student.year_enrollment.user.first_name}`,
              fixed: "left",
            },
            {
              key: "gender",
              title: "Genre",
              dataIndex: "gender",
              render: (_, record, __) =>
                record.student.year_enrollment.user.gender,
              width: 58,
              align: "center",
              fixed: "left",
            },
            {
              title: "Matricule",
              dataIndex: "matricule",
              key: "matricule",
              width: 80,
              render: (_, record, __) =>
                record.student.year_enrollment.user.matricule,
              fixed: "left",
            },
            {
              title: "Promotion",
              dataIndex: "class_year",
              key: "class_year",
              render: (_, record, __) =>
                `${record.student.year_enrollment.class_year.acronym} ${record.student.year_enrollment.departement.acronym}`,
              width: 120,
              fixed: "left",
            },
            {
              title: "Date, Heure et Signature",
              dataIndex: "dates",
              key: "dates",
              children: Array.from({ length: numberOfSessions }).map(
                (_, i) => ({
                  dataIndex: `day_${i + 1}`,
                  key: `day_${i + 1}`,
                  title: `...... / ...... / ............. à ..... H .....`,
                  width: 24,
                  onHeaderCell: () => ({
                    style: {
                      writingMode: "sideways-lr",
                      textOrientation: "mixed",
                    },
                  }),
                })
              ),
            },
          ]}
          pagination={false}
          rowKey="id"
          scroll={{ x: "max-content", y: "calc(100vh - 348px)" }}
        />
      </Drawer>
      <div className="hidden">
        <div ref={refToPrint} className=" ">
          <DocHeader
            serviceName={course?.faculty.name}
            showContactInfo={false}
          />
          <Descriptions
            bordered
            size="small"
            title="Fiche de présences"
            column={2}
            style={{ marginBottom: 28 }}
            styles={{
              title: {
                textTransform: "uppercase",
                textAlign: "center",
              },
            }}
            items={[
              {
                key: "course",
                label: "Cours",
                children: `${course?.available_course.name || ""}`,
              },
              {
                key: "code",
                label: "Code",
                children: course?.available_course.code || "",
              },
              {
                key: "credits",
                label: "Crédits",
                children: course?.credit_count || "",
              },
              {
                key: "year",
                label: "Année académique",
                children: course?.academic_year?.name || "",
              },
              {
                key: "period",
                label: "Période",
                children: `${course?.period?.name || ""} (${
                  course?.period?.acronym || ""
                })`,
              },
              {
                key: "faculty",
                label: "Filière",
                children: course?.faculty?.name || "",
              },
              {
                key: "department",
                label: "Mention(s)",
                children: course?.departements
                  .map((dep) => dep.name)
                  .join(", "),
              },
            ]}
          />
          <Alert
            type="info"
            message="Cette fiche de présences est vide. Elle est destinée à être remplie manuellement lors des séances."
            description={`Une fois remplie manuellement, cette fiche devra être retournée à la filière ${course?.faculty.name} pour encodage dans le système de gestion académique.`}
            style={{ marginBottom: 24 }}
            showIcon
            icon={<BulbOutlined />}
          />
          <Table
            size="small"
            bordered
            dataSource={students}
            columns={[
              {
                title: "N°",
                dataIndex: "index",
                key: "index",
                render: (_value, _record, index) => index + 1,
                width: 52,
                align: "right",
              },
              {
                title: "Noms",
                dataIndex: "name",
                key: "name",
                render: (_, record, __) =>
                  `${record.student.year_enrollment.user.surname} ${record.student.year_enrollment.user.last_name} ${record.student.year_enrollment.user.first_name}`,
              },
              {
                key: "gender",
                title: "Genre",
                dataIndex: "gender",
                render: (_, record, __) =>
                  record.student.year_enrollment.user.gender,
                width: 58,
                align: "center",
              },
              {
                title: "Matricule",
                dataIndex: "matricule",
                key: "matricule",
                width: 80,
                render: (_, record, __) =>
                  record.student.year_enrollment.user.matricule,
              },
              {
                title: "Promotion",
                dataIndex: "class_year",
                key: "class_year",
                render: (_, record, __) =>
                  `${record.student.year_enrollment.class_year.acronym} ${record.student.year_enrollment.departement.acronym}`,
                width: 120,
              },
              {
                title: "Date, Heure et Signature",
                dataIndex: "dates",
                key: "dates",
                children: Array.from({ length: numberOfSessions || 0 }).map(
                  (_, i) => ({
                    dataIndex: `day_${i + 1}`,
                    key: `day_${i + 1}`,
                    title: `...... / ...... / ............. à ..... H .....`,
                    width: 24,
                    onHeaderCell: () => ({
                      style: {
                        writingMode: "sideways-lr",
                        textOrientation: "mixed",
                        fontSize: 10,
                      },
                    }),
                  })
                ),
              },
            ]}
            pagination={false}
            rowKey="id"
          />
        </div>
      </div>
    </>
  );
};
   
        