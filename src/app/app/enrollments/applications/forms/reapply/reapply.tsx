"use client";
import { FC, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
  Modal,
  Result,
  Row,
  Select,
  Space,
  theme,
  Typography,
} from "antd";
import { Options, useQueryState } from "nuqs";
import { CloseOutlined, UserAddOutlined } from "@ant-design/icons";
import { SelectAStudent } from "./select-a-student";
import { Enrollment } from "@/types";
import { StudentEnrollments } from "./student-enrollments";
import { getClassesYearsAsOptions, getCurrentDepartmentsAsOptions, getCurrentFacultiesAsOptions } from "@/lib/api";
import { useFaculties } from "@/hooks/useFaculties";
import { useDepartments } from "@/hooks/useDepartments";
import { useClasses } from "@/hooks/useClasses";
import { useYid } from "@/hooks/use-yid";

type Props = {
  open: boolean;
  setOpen: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const ReapplyForm: FC<Props> = ({ open, setOpen }) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const { year } = useYid();
  const [cancel, setCancel] = useState<boolean>(false);
  const [search, setSearch] = useQueryState("search");
  const [selectedStudent, setSelectedStudent] = useState<
    Enrollment | undefined
  >();

  const facultyId = Form.useWatch("faculty", form);

  const { data: faculties, isPending: isPendingFaculties } = useFaculties();
  const { data: departments, isPending: isPendingDepartments } =
    useDepartments(facultyId);
  const { data: classes, isPending: isPendingClasses } = useClasses();

  const [previousEnrollments, setPreviousEnrollments] = useState<
    Enrollment[] | undefined
  >();

  const onClose = () => {
    setCancel(false);
    setOpen(false);
    setSearch(null);
    setSelectedStudent(undefined);
    form.resetFields();
  };

  const checkInPreviousEnrollments = (yearId?: number) => {
    if (!previousEnrollments || !yearId) return false;
    return previousEnrollments.some(
      (enrollment) => enrollment.academic_year.id === yearId
    );
  }

  const onFinish = (values: {}) => {};

  return (
    <Drawer
      width={`100%`}
      title={
        <Space>
          <Typography.Title
            level={5}
            style={{ marginBottom: 0, color: "#fff" }}
          >
            Réinscription :
          </Typography.Title>
          <SelectAStudent
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            search={search}
            setSearch={setSearch}
            variant="underlined"
            style={{ width: "100%", color: "#fff" }}
          />
        </Space>
      }
      onClose={onClose}
      open={open}
      closable={false}
      extra={
        <Space>
          <Button
            style={{ boxShadow: "none" }}
            onClick={() => {
              setCancel(true);
            }}
            icon={<CloseOutlined />}
            type="text"
          />
          <Modal
            title="Annuler la réinscription"
            open={cancel}
            onOk={onClose}
            okButtonProps={{ style: { boxShadow: "none" } }}
            cancelButtonProps={{ style: { boxShadow: "none" } }}
            onCancel={() => setCancel(false)}
            centered
          >
            <Alert
              message="Êtes-vous sûr de vouloir annuler cette réinscription ?"
              description="Vous allez perdre toutes les informations saisies."
              type="warning"
              showIcon
              style={{ marginBottom: 16, border: 0 }}
            />
          </Modal>
        </Space>
      }
      footer={
        <div className="flex">
          <div className="flex-1" />
          <Space>
            <Button
              onClick={() => setCancel(true)}
              style={{ boxShadow: "none" }}
              // disabled={}
            >
              Annuler
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ boxShadow: "none" }}
              onClick={() => {
                form.submit();
              }}
              disabled={
                !selectedStudent || checkInPreviousEnrollments(year?.id)
              }
            >
              Soumettre
            </Button>
          </Space>
        </div>
      }
      styles={{
        header: { background: colorPrimary, color: "white" },
      }}
    >
      {selectedStudent && (
        <div className=" max-w-7xl mx-auto">
          <Card variant="borderless" style={{ boxShadow: "none" }}>
            <Row gutter={[28, 28]}>
              <Col xs={24} sm={24} md={12} lg={8}>
                <Descriptions
                  column={1}
                  size="small"
                  bordered
                  title="Détails"
                  items={[
                    {
                      key: "matricule",
                      label: "Matricule",
                      children: selectedStudent?.user.matricule || "",
                    },
                    {
                      key: "first_name",
                      label: "Nom",
                      children: selectedStudent?.user.first_name || "",
                    },
                    {
                      key: "last_name",
                      label: "Postnom",
                      children: selectedStudent?.user.last_name || "",
                    },
                    {
                      key: "surname",
                      label: "Prénom",
                      children: selectedStudent?.user.surname || "",
                    },
                  ]}
                />
                <StudentEnrollments
                  matricule={selectedStudent.user.matricule}
                  setPreviousEnrollments={setPreviousEnrollments}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={16}>
                <Card
                  title="Nouvelle inscription"
                  variant="borderless"
                  style={{ boxShadow: "none" }}
                >
                  {!checkInPreviousEnrollments(year?.id) && (
                    <Form
                      layout="vertical"
                      name="reapply"
                      form={form}
                      onFinish={onFinish}
                    >
                      <Form.Item label="Année académique" name="academic_year">
                        <Input
                          placeholder={year?.name}
                          disabled
                          // variant="borderless"
                          value={year?.name}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Filière"
                        name="faculty"
                        rules={[
                          { required: true, message: "Ce champ est requis" },
                        ]}
                      >
                        <Select
                          placeholder="Faculté"
                          options={getCurrentFacultiesAsOptions(faculties)}
                          loading={isPendingFaculties}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Département"
                        name="departement"
                        rules={[
                          { required: true, message: "Ce champ est requis" },
                        ]}
                      >
                        <Select
                          placeholder="Département"
                          options={getCurrentDepartmentsAsOptions(departments)}
                          loading={isPendingDepartments}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Promotion"
                        name="class_year"
                        rules={[
                          { required: true, message: "Ce champ est requis" },
                        ]}
                      >
                        <Select
                          placeholder="Promotion ou classe"
                          options={getClassesYearsAsOptions({ classes })}
                          loading={isPendingClasses}
                        />
                      </Form.Item>
                    </Form>
                  )}
                  {checkInPreviousEnrollments(year?.id) && (
                    <Alert
                      description={year?.name}
                      message="L'étudiant a déjà une inscription pour cette année académique"
                      type="warning"
                      showIcon
                    />
                  )}
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      )}

      {!selectedStudent && (
        <Result
          title="Sélectionnez un étudiant à réinscrire"
          subTitle="Veuillez choisir un étudiant dans la liste pour commencer la réinscription."
          extra={
            <SelectAStudent
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              search={search}
              setSearch={setSearch}
            />
          }
          icon={<UserAddOutlined style={{ color: "GrayText" }} />}
        />
      )}
    </Drawer>
  );
};
