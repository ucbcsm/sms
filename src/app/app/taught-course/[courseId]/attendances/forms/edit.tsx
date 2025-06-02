"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Drawer,
  Flex,
  Form,
  message,
  Modal,
  Row,
  Space,
  theme,
  DatePicker,
  Descriptions,
  Tag,
} from "antd";
import { parseAsBoolean, useQueryState } from "nuqs";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { AttendanceList, TaughtCourse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAttendanceList,
  getCourseTypeName,
  getTeachingUnitCategoryName,
  getYearStatusName,
} from "@/lib/api";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { ListAttendanceListItem } from "./list";

type NewAttendanceListFormProps = {
  course?: TaughtCourse;
  attendanceList: AttendanceList;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditAttendanceListForm: FC<NewAttendanceListFormProps> = ({
  course,
  open,
  setOpen,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { courseId } = useParams();

  const [cancel, setCancel] = useState<boolean>(false);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const onClose = () => {
    setOpen(false);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createAttendanceList,
  });

  const onFinish = (values: any) => {
    mutateAsync(
      {
        ...values,
        course_id: Number(courseId),
        date: dayjs(values.date).format("YYYY-MM-DD"),
        student_ids: selectedStudents,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["attendance-lists"] });
          messageApi.success("Liste de présence créée avec succès !");
          setOpen(false);
          form.resetFields();
          setSelectedStudents([]);
        },
        onError: () => {
          messageApi.error(
            "Erreur lors de la création de la liste de présence."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Drawer
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        width={`100%`}
        title="Modification d'une liste de présence"
        onClose={onClose}
        open={open}
        closable={false}
        extra={
          <Space>
            <Button
              style={{ boxShadow: "none", color: "#fff" }}
              onClick={() => setCancel(true)}
              icon={<CloseOutlined />}
              type="text"
            />
            <Modal
              title="Annuler les modifications"
              open={cancel}
              onOk={() => {
                setOpen(false);
                setCancel(false);
                setSelectedStudents([]);
              }}
              okButtonProps={{ style: { boxShadow: "none" } }}
              cancelButtonProps={{ style: { boxShadow: "none" } }}
              onCancel={() => setCancel(false)}
              centered
            >
              <Alert
                message="Êtes-vous sûr de vouloir annuler la modification de cette liste de présence ?"
                description="Toutes les modifications apportées seront perdues."
                type="warning"
                showIcon
                style={{ marginBottom: 16, border: 0 }}
              />
            </Modal>
          </Space>
        }
      >
        <div style={{ maxWidth: 1400, margin: "auto" }}>
          <Alert
            type="warning"
            message="Vous modifiez une liste de présence existante."
            description="Modifiez la date si nécessaire, puis mettez à jour avec précision les étudiants présents et absents."
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
          <Row gutter={[24, 24]}>
            <Col span={6}>
              <Descriptions
                title="Détails du cours"
                column={1}
                items={[
                  {
                    key: "name",
                    label: "Intitulé",
                    children: course?.available_course.name || "",
                  },
                  {
                    key: "code",
                    label: "Code du cours",
                    children: course?.available_course.code || "",
                  },
                  {
                    key: "category",
                    label: "Catégorie",
                    children:
                      getCourseTypeName(course?.available_course.code!) || "",
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
                      `(${course?.teaching_unit?.code})`
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
                        }).format(new Date(`${course.end_date}`))
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
            </Col>
            <Col span={12}>
              <Card>
                <ListAttendanceListItem
                //  items={}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Informations complémentaires">
                <Form
                  form={form}
                  name="form_new-attendance-list"
                  initialValues={{
                    date: dayjs(),
                  }}
                  onFinish={onFinish}
                  disabled={isPending}
                >
                  <Form.Item
                    name="date"
                    label="Date de la séance"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez renseigner la date.",
                      },
                    ]}
                  >
                    <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                  </Form.Item>

                  <Flex justify="flex-end" align="center">
                    <Form.Item>
                      <Space>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={isPending}
                          style={{ boxShadow: "none" }}
                        >
                          Sauvegarder
                        </Button>
                      </Space>
                    </Form.Item>
                  </Flex>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </Drawer>
    </>
  );
};
