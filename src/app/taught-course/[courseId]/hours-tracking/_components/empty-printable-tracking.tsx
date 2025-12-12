"use client";

import { DocHeader } from "@/components/doc-header";
import { TaughtCourse } from "@/types";
import { BulbOutlined, CloseOutlined, PrinterOutlined } from "@ant-design/icons";
import {
    Alert,
  Button,
  Descriptions,
  Drawer,
  Form,
  InputNumber,
  Space,
  Table,
  theme,
  Typography,
} from "antd";
import { Dispatch, SetStateAction, useRef } from "react";
import { useReactToPrint } from "react-to-print";

type EmptyPrintableTrackingProps = {
  course?: TaughtCourse;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EmptyPrintableTracking: React.FC<EmptyPrintableTrackingProps> = ({
  course,
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
    documentTitle: `Suivie-des-heures-${course?.available_course.name.replaceAll(
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
  };
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
              Fiche de suivi des heures :
            </Typography.Title>
            <Typography.Title
              level={5}
              style={{ marginBottom: 0 }}
              type="success"
            >
              {course?.available_course?.name}
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
          title={() => (
            <div className="flex justify-between">
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                Séances
              </Typography.Title>
              <Space></Space>
            </div>
          )}
          bordered
          size="small"
          dataSource={Array.from({ length: numberOfSessions || 0 }, (_, i) => ({
            id: i + 1,
          }))}
          columns={[
            {
              title: "N°",
              dataIndex: "session_number",
              key: "session_number",
              render: (_, record, index) => index + 1,
              width: 48,
              align: "right",
            },
            {
              title: "Date",
              dataIndex: "date",
              key: "date",
              render: (_, record, __) => "",
              width: 120,
            },
            {
              title: "Matière",
              dataIndex: "subject",
              key: "subject",
              render: (_, record, __) => "",
            },
            {
              title: "Heures",
              key: "hours",
              children: [
                {
                  title: "Début",
                  dataIndex: "start_time",
                  key: "start_time",
                  render: (_, record, __) => "",
                  width: 64,
                },
                {
                  title: "Fin",
                  dataIndex: "end_time",
                  key: "end_time",
                  render: (_, record, __) => "",
                  width: 64,
                },
              ],
            },
            {
              key: "hours_completed",
              title: "Heures prestées",
              dataIndex: "hours_completed",
              render: (_, record, __) => "",
              width: 64,
            },
            {
              title: "Type d'activité",
              dataIndex: "activity_type",
              key: "activity_type",
              render: (_, record, __) => "",
            },
            {
              title: "Signature CP",
              dataIndex: "cp_validation",
              key: "cp_validation",
              render: (_, record, __) => "",
              width: 100,
            },
            {
              title: "Signature enseignant",
              dataIndex: "teacher_validation",
              key: "teacher_validation",
              render: (_, record, __) => "",
              width: 100,
            },
          ]}
          rowKey="id"
          pagination={false}
          scroll={{ x: "max-content", y: "calc(100vh - 236px)" }}
        />
      </Drawer>
      <div className="hidden">
        <div ref={refToPrint}>
          <DocHeader
            serviceName="Secrétariat General académique "
            showContactInfo={false}
          />
          <Descriptions
            title="Fiche de suivi des heures"
            styles={{
              title: { textTransform: "uppercase", textAlign: "center" },
            }}
            size="small"
            bordered
            column={3}
            style={{ marginBottom: 28 }}
            items={[
              {
                key: "course",
                label: "Cours",
                children: `${course?.available_course.name}`,
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
                key: "hours",
                label: "Heures totales",
                children:
                  Number(course?.practical_hours) +
                    Number(course?.theoretical_hours) || "",
              },
              {
                key: "practical_hours",
                label: "Heures pratiques",
                children: course?.practical_hours || "",
              },
              {
                key: "theoretical_hours",
                label: "Heures théoriques",
                children: course?.theoretical_hours || "",
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
                children: course?.departements.map((dep) => dep.name).join(","),
              },
              {
                key: "instructor",
                label: "Enseignant(e)",
                children: `${course?.teacher?.user.surname || ""} ${
                  course?.teacher?.user.last_name || ""
                } ${course?.teacher?.user.first_name || ""}`,
              },
              {
                key: "education_level",
                label: "Niveau d'étude",
                children: course?.teacher?.education_level || "",
              },
              {
                key: "academic_grade",
                label: "Grade académique",
                children: course?.teacher?.academic_grade || "",
              },
              {
                key: "field_of_study",
                label: "Domaine de formation",
                children: course?.teacher?.field_of_study || "",
              },
            ]}
          />
          <Alert
            title="Cette fiche de suivi des heures est vide. Elle est destinée à être remplie manuellement lors des séances."
            description={`Une fois remplie manuellement, cette fiche devra être retournée à la filière ${course?.faculty.name} pour encodage dans le système de gestion académique.`}
            type="info"
            icon={<BulbOutlined />}
            showIcon
            style={{ marginBottom: 24 }}
            banner
          />
          <Table
            title={() => (
              <div className="flex justify-between">
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  Séances
                </Typography.Title>
                <Space></Space>
              </div>
            )}
            bordered
            size="small"
            dataSource={Array.from(
              { length: numberOfSessions || 0 },
              (_, i) => ({
                id: i + 1,
              })
            )}
            columns={[
              {
                title: "N°",
                dataIndex: "session_number",
                key: "session_number",
                render: (_, record, index) => index + 1,
                width: 48,
                align: "right",
              },
              {
                title: "Date",
                dataIndex: "date",
                key: "date",
                render: (_, record, __) => "",
                width: 120,
              },
              {
                title: "Matière",
                dataIndex: "subject",
                key: "subject",
                render: (_, record, __) => "",
              },
              {
                title: "Heures",
                key: "hours",
                children: [
                  {
                    title: "Début",
                    dataIndex: "start_time",
                    key: "start_time",
                    render: (_, record, __) => "",
                    width: 64,
                  },
                  {
                    title: "Fin",
                    dataIndex: "end_time",
                    key: "end_time",
                    render: (_, record, __) => "",
                    width: 64,
                  },
                ],
              },
              {
                key: "hours_completed",
                title: "Heures prestées",
                dataIndex: "hours_completed",
                render: (_, record, __) => "",
                width: 64,
              },
              {
                title: "Type d'activité",
                dataIndex: "activity_type",
                key: "activity_type",
                render: (_, record, __) => "",
              },
              {
                title: "Signature CP",
                dataIndex: "cp_validation",
                key: "cp_validation",
                render: (_, record, __) => "",
                width: 100,
              },
              {
                title: "Signature enseignant",
                dataIndex: "teacher_validation",
                key: "teacher_validation",
                render: (_, record, __) => "",
                width: 100,
              },
            ]}
            rowKey="id"
            pagination={false}
            style={{ marginBottom: 28 }}
          />
        </div>
      </div>
    </>
  );
};
