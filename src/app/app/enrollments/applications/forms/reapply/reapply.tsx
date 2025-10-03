"use client";
import { FC, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Form,
  message,
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
import {
  createReapplication,
  getClassesYearsAsOptions,
  getCurrentCyclesAsOptions,
  getCurrentDepartmentsAsOptions,
  getCurrentFacultiesAsOptions,
  getCurrentFieldsAsOptions,
} from "@/lib/api";
import { useFaculties } from "@/hooks/useFaculties";
import { useDepartments } from "@/hooks/useDepartments";
import { useClasses } from "@/hooks/useClasses";
import { useYid } from "@/hooks/use-yid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFields } from "@/hooks/useFields";
import { useCycles } from "@/hooks/useCycles";

type FormDataType={
  yearId: number;
  facultyId: number;
  fieldId: number;
  departmentId: number;
  classId: number;
  cycleId: number;
  enrollmentFees: "paid" | "unpaid" | "partially_paid";
  status:"pending" | "validated" | "rejected";
}

type ReapplyFormProps = {
  open: boolean;
  setOpen: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const ReapplyForm: FC<ReapplyFormProps> = ({ open, setOpen }) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const { year } = useYid();
  const [cancel, setCancel] = useState<boolean>(false);
  const [search, setSearch] = useQueryState("search");
  const [selectedStudent, setSelectedStudent] = useState<
    Enrollment | undefined
  >();

  const facultyId = Form.useWatch("faculty", form);
  const fieldId = Form.useWatch("fieldId", form);
  const cycleId = Form.useWatch("cycleId", form);

  const { data: cycles, isPending: isPendingCycles } = useCycles();
  const { data: fields, isPending: isPendingFields } = useFields(cycleId);
  const { data: faculties, isPending: isPendingFaculties } = useFaculties(fieldId);
  const { data: departments, isPending: isPendingDepartments } =
    useDepartments(facultyId);
  const { data: classes, isPending: isPendingClasses } = useClasses();

  const [previousEnrollments, setPreviousEnrollments] = useState<
    Enrollment[] | undefined
  >();

  const queryClient= useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createReapplication,
  });

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
  };

  useEffect(()=>{
    if(selectedStudent){
      form.setFieldsValue({
        yearId:year?.id,
        cycleId: selectedStudent.cycle.id,
        fieldId: selectedStudent.field.id,
        facultyId: selectedStudent.faculty.id,
        departmentId:selectedStudent.departement.id,
      });
    }
  },[selectedStudent])

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      {
        yearId: values.yearId,
        cycleId: values.cycleId,
        fieldId: values.fieldId,
        facultyId: values.facultyId,
        departmentId: values.departmentId,
        classId: values.classId,
        enrollmentFees: values.enrollmentFees,
        status: values.status,
        yearEnrollmentId: Number(selectedStudent?.id),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["applications"] });
          messageApi.success("La réinscription a été créée avec succès");
          onClose();
        },
        onError: (error) => {
          messageApi.error(
            (error as any).response.data.message ||
              "Une erreur est survenue lors de la création de la réinscription, veuillez réessayer."
          );
        }
      }
    );
  };

  return (
    <>
      {contextHolder}
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
              style={{ boxShadow: "none", color: "#fff" }}
              onClick={() => {
                setCancel(true);
              }}
              icon={<CloseOutlined />}
              type="text"
              disabled={isPending}
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
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ boxShadow: "none" }}
                loading={isPending}
                onClick={() => {
                  form.submit();
                }}
                disabled={
                  !selectedStudent ||
                  checkInPreviousEnrollments(year?.id) ||
                  isPending
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
                    style={{ boxShadow: "none" }}
                  >
                    {!checkInPreviousEnrollments(year?.id) && (
                      <Form
                        layout="horizontal"
                        name="reapply"
                        form={form}
                        onFinish={onFinish}
                        disabled={isPending || !previousEnrollments}
                      >
                        <Form.Item
                          label="Année académique"
                          name="yearId"
                          rules={[{ required: true }]}
                        >
                          <Select
                            placeholder={year?.name}
                            disabled
                            options={[
                              {
                                value: year?.id,
                                label: year?.name,
                              },
                            ]}
                          />
                        </Form.Item>
                        <Form.Item
                          name="cycleId"
                          label="Cycle"
                          rules={[{ required: true }]}
                        >
                          <Select
                            placeholder="Sélectioner un cycle"
                            options={getCurrentCyclesAsOptions(cycles)}
                            loading={isPendingCycles}
                            disabled
                          />
                        </Form.Item>
                        <Form.Item
                          name="fieldId"
                          label="Domaine"
                          rules={[{ required: true }]}
                        >
                          <Select
                            placeholder="Sélectionner un domaine"
                            options={getCurrentFieldsAsOptions(fields)}
                            loading={isPendingFields}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Filière"
                          name="facultyId"
                          rules={[{ required: true }]}
                        >
                          <Select
                            placeholder="Faculté"
                            options={getCurrentFacultiesAsOptions(faculties)}
                            loading={isPendingFaculties}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Département"
                          name="departmentId"
                          rules={[{ required: true }]}
                        >
                          <Select
                            placeholder="Département"
                            options={getCurrentDepartmentsAsOptions(
                              departments
                            )}
                            loading={isPendingDepartments}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Promotion"
                          name="classId"
                          rules={[{ required: true }]}
                        >
                          <Select
                            placeholder="Promotion ou classe"
                            options={getClassesYearsAsOptions({ classes })}
                            loading={isPendingClasses}
                          />
                        </Form.Item>
                        <Form.Item
                          name="enrollmentFees"
                          label="Frais d'inscription"
                          rules={[{ required: true }]}
                        >
                          <Select
                            options={[
                              { value: "paid", label: "Payé" },
                              {
                                value: "partially_paid",
                                label: "Partiellement payé",
                              },
                              { value: "unpaid", label: "Non payé" },
                            ]}
                          />
                        </Form.Item>
                        <Form.Item
                          name="status"
                          label="Status de l'inscription"
                          rules={[{ required: true }]}
                          initialValue="validated"
                        >
                          <Select
                            options={[
                              { value: "validated", label: "Validé" },
                              { value: "pending", label: "En attente" },
                              { value: "rejected", label: "Rejeté" },
                            ]}
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
    </>
  );
};
