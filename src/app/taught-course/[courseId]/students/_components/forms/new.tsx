"use client";

import { FC, useState } from "react";
import {
  Alert,
  Button,
  Drawer,
  Form,
  Modal,
  Space,
  Select,
  theme,
  Typography,
  Row,
  Col,
  Flex,
  Card,
  Statistic,
  Switch,
  App,
  Divider,
  Tag,
} from "antd";
import { parseAsBoolean, useQueryState } from "nuqs";
import {
  CloseOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Class, CourseEnrollment, Department, PeriodEnrollment, TaughtCourse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourseEnrollment, getTaughtCoursAsOptions } from "@/lib/api";
import { ListNewCourseEnrollments } from "./list-new-enrollments";
import { filterOption } from "@/lib/utils";

type NewCourseEnrollmentFormProps = {
  course?: TaughtCourse;
  periodEnrollments?: PeriodEnrollment[];
  courseEnrollments?:CourseEnrollment[]
  departments?: Department[];
    classes?: Class[]; // Promotions
};

export const NewCourseEnrollmentForm: FC<NewCourseEnrollmentFormProps> = ({
  course,
  periodEnrollments,
  courseEnrollments,
  departments,
  classes
}) => {
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const [form] = Form.useForm();
  const {message} = App.useApp();
  const [openNewEnrollments, setOpenNewEnrollments] = useQueryState(
    "new_enrollments",
    parseAsBoolean.withDefault(false)
  );
  const [cancel, setCancel] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [departmentFilterValueId, setDepartmentFilterValueId] =
    useState<number>(0);
  const [classFilterValueId, setClassFilterValueId] = useState<number>(0);
  const queryClient = useQueryClient();

  const onClose = () => {
    setOpenNewEnrollments(false);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCourseEnrollment,
  });

  const onFinish = (values: {
    course_id: number;
    status: "pending" | "validated" | "rejected";
    exempted_on_attendance: boolean;
  }) => {
    const data = selectedRowKeys.map((key) => ({
      student: key as number,
      courses: [values.course_id],
      status: values.status,
      exempted_on_attendance: values.exempted_on_attendance,
    }));
    mutateAsync(
      {
        payload: data,
      },
      {
        onSuccess: () => {
          message.success("Étudiants inscrits au cours avec succès !");
          queryClient.invalidateQueries({
            queryKey: ["course_enrollments"],
          });
          setSelectedRowKeys([]);
          setClassFilterValueId(0);
          setDepartmentFilterValueId(0);
          form.resetFields();
          setOpenNewEnrollments(false);
        },
        onError: (error) => {
          if ((error as any).status === 403) {
            message.error(
              `Vous n'avez pas la permission d'effectuer cette action`
            );
          } else if ((error as any).status === 401) {
            message.error(
              "Vous devez être connecté pour effectuer cette action."
            );
          } else {
            message.error(
              (error as any)?.response?.data?.message ||
                "Erreur lors de l'inscription. Veuillez réessayer."
            );
          }
        }
      }
    );
  };

  return (
    <>
      <Button
        title="Inscrire les étudiants à ce cours"
        type="primary"
        icon={<UserAddOutlined />}
        style={{ boxShadow: "none" }}
        onClick={() => setOpenNewEnrollments(true)}
      >
        Inscrire
      </Button>
      <Drawer
        styles={{
          // header: { background: colorPrimary, color: "#fff" },
          body: { background: colorBgLayout },
        }}
        width={`100%`}
        title={
          <Space>
            Inscription au cours :{" "}
            <Typography.Title
              level={5}
              type="success"
              style={{ marginBottom: 0 }}
            >
              {course?.available_course.name ?? ""}
            </Typography.Title>
          </Space>
        }
        onClose={onClose}
        open={openNewEnrollments}
        closable={false}
        destroyOnHidden
        extra={
          <Space>
            <Typography.Text type="secondary">
              Mention (s) concernée (s) :
            </Typography.Text>
            {course?.departements.map((dep) => (
              <Tag
                key={dep.id}
                bordered
                style={{ marginRight: 0, borderRadius: 10 }}
              >
                {dep.acronym}
              </Tag>
            ))}
            <Divider orientation="vertical" />
            <Button
              style={{ boxShadow: "none" }}
              onClick={() => setCancel(true)}
              icon={<CloseOutlined />}
              type="text"
            />
            <Modal
              title="Annuler l'inscription"
              open={cancel}
              onOk={() => {
                setOpenNewEnrollments(false);
                form.resetFields();
                setCancel(false);
                setSelectedRowKeys([]);
                setClassFilterValueId(0);
                setDepartmentFilterValueId(0);
              }}
              okButtonProps={{ style: { boxShadow: "none" } }}
              cancelButtonProps={{ style: { boxShadow: "none" } }}
              onCancel={() => setCancel(false)}
              centered
            >
              <Alert
                title="Êtes-vous sûr de vouloir annuler cette inscription ?"
                description="Toutes les informations saisies seront perdues."
                type="warning"
                showIcon
                style={{ marginBottom: 16, border: 0 }}
              />
            </Modal>
          </Space>
        }
      >
        <div style={{ maxWidth: 1400, margin: "auto" }}>
          <Row gutter={[24, 24]}>
            <Col span={16}>
              <Card>
                <ListNewCourseEnrollments
                  course={course}
                  periodEnrollments={periodEnrollments}
                  courseEnrollements={courseEnrollments}
                  selectedRowKeys={selectedRowKeys}
                  setSelectedRowKeys={setSelectedRowKeys}
                  departmentFilterValueId={departmentFilterValueId}
                  setDepartmentFilterValueId={setDepartmentFilterValueId}
                  classFilterValueId={classFilterValueId}
                  setClassFilterValueId={setClassFilterValueId}
                  departments={departments}
                  classes={classes}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Flex vertical gap={16}>
                <Card>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="Cours"
                      name="course_id"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      initialValue={course?.id}
                    >
                      <Select
                        showSearch={{ filterOption: filterOption }}
                        placeholder=""
                        disabled
                        options={
                          course && getTaughtCoursAsOptions([{ ...course }])
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      label="Statut de l'inscription"
                      name="status"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      initialValue={"validated"}
                    >
                      <Select
                        placeholder=""
                        disabled={isPending}
                        options={[
                          { value: "pending", label: "En attente" },
                          { value: "validated", label: "Validé" },
                          { value: "rejected", label: "Réjeté" },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Exempter d'assiduité?"
                      name="exempted_on_attendance"
                      initialValue={false}
                      hidden
                    >
                      <Switch
                        checkedChildren="Oui"
                        unCheckedChildren="Non"
                        disabled={isPending || selectedRowKeys.length === 0}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isPending}
                        style={{ boxShadow: "none" }}
                        block
                        disabled={isPending || selectedRowKeys.length === 0}
                      >
                        Sauvegarder
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
                <Card>
                  <Statistic
                    loading={isPending}
                    title="Séléctions"
                    value={selectedRowKeys.length}
                  />
                </Card>
              </Flex>
            </Col>
          </Row>
        </div>
      </Drawer>
    </>
  );
};
