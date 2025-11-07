"use client";

import { FC, useState } from "react";
import { Alert, Form, message, Modal, Select, Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Class, Course, Enrollment } from "@/types";
import {
  createStudentWithRetake
} from "@/lib/api/retake-course";
import { BulbOutlined, PlusOutlined } from "@ant-design/icons";
import { filterOption } from "@/lib/utils";
import {
  getCurrentClassesAsOptions,
} from "@/lib/api";
import { useParams } from "next/navigation";

type FormDataType = {
  courseIds: number[];
  reason: "low_attendance" | "missing_course" | "failed_course";
  classId: number;
  yearId: number;
};

type StudentWithRetakeFormProps = {
  courses?: Course[];
  classes?: Class[];
  yearEnrollments?: Enrollment[];
};

export const StudentWithRetakeForm: FC<StudentWithRetakeFormProps> = ({
  courses,
  classes,
  yearEnrollments,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const {facultyId}=useParams()
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [yearEnrollment, setYearEnrollment] = useState<Enrollment|undefined>();
  const { mutateAsync, isPending } =
    useMutation({
      mutationFn: createStudentWithRetake,
    });

  const onCancel = () => {
    setOpen(false);
    setYearEnrollment(undefined);
    form.resetFields();
  };

  const onFinish = (values: FormDataType) => {
    if(yearEnrollment){
    mutateAsync(
      {
        userId: yearEnrollment?.user.id!,
        facultyId: yearEnrollment.faculty.id!,
        departmentId: yearEnrollment?.departement.id!,
        retakeCourseAndReason: values.courseIds.map((courseId) => ({
          available_course: courseId,
          reason: values.reason,
          academic_year: yearEnrollment?.academic_year?.id!,
          class_year: yearEnrollment?.class_year?.id!,
        })),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["retake-courses"] });
          messageApi.success("Ajoutée avec succès !");
          form.resetFields();
          setYearEnrollment(undefined);
          setOpen(false);
        },
        onError: (error) => {
          if ((error as any).status === 403) {
            messageApi.error(
              `Vous n'avez pas la permission d'effectuer cette action`
            );
          } else if ((error as any).status === 401) {
            messageApi.error(
              "Vous devez être connecté pour effectuer cette action."
            );
          } else {
            messageApi.error(
              (error as any)?.response?.data?.message ||
                "Erreur lors de l'ajout."
            );
          }
        },
      }
    );
    } else {
      messageApi.error("Veuillez sélectionner un étudiant valide.");
    }
  };

  const getYearEnrollmentsAsOption = () =>{
    return yearEnrollments?.map((en) => ({
      label: `${en.academic_year?.name}`,
      value: en.academic_year.id,
    }));
  }

  return (
    <>
      {contextHolder}
      <Button
        icon={<PlusOutlined />}
        variant="dashed"
        color="primary"
        style={{ boxShadow: "none" }}
        title="Ajouter l'étudiant avec des cours à reprendre"
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title={"Ajouter un étudiant avec des cours à reprendre"}
        centered
        okText="Ajouter"
        cancelText="Annuler"
        styles={{ body: { paddingBottom: "24px" } }}
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
          loading: isPending,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
          disabled: isPending,
        }}
        onCancel={onCancel}
        destroyOnHidden
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="new_retake_reason_form"
            onFinish={onFinish}
            disabled={isPending}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          description="Sélectionnez les cours à reprendre et indiquez la raison pour laquelle l'étudiant doit reprendre les cours, ainsi que l'année académique et la promotion durant laquelle il a manqué ou échoué ces cours."
          type="info"
          showIcon
          icon={<BulbOutlined />}
          style={{ border: 0 }}
          closable
        />
        <Form.Item
          name="courseIds"
          label="Cours à reprendre"
          rules={[
            {
              required: true,
              message: "Veuillez sélectionner au moins un cours.",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Sélectionnez les cours"
            options={courses?.map((c) => ({
              label: `${c.name} (${c.code})`,
              value: c.id,
            }))}
            showSearch
            filterOption={filterOption}
          />
        </Form.Item>
        <Form.Item
          name="reason"
          label="Raison de la reprise"
          rules={[{ required: true, message: "Veuillez indiquer la raison." }]}
        >
          <Select
            placeholder="Sélectionnez une raison"
            options={[
              { value: "low_attendance", label: "Faible assiduité" },
              { value: "missing_course", label: "Cours manquant" },
              { value: "failed_course", label: "Échec au cours" },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="yearId"
          label="Année académique"
          rules={[
            { required: true, message: "Veuillez sélectionner une année." },
          ]}
          tooltip="L'année académique durant laquelle l'étudiant avait manqué ou échoué ce cours."
        >
          <Select
            options={getYearEnrollmentsAsOption()}
            onChange={(value, option) => {
              form.setFieldValue("classId", (option as any).class_year_id);
              const enrollment = yearEnrollments?.find(
                (en) => en.academic_year?.id === value
              );
              setYearEnrollment(enrollment);
              form.setFieldValue("classId", enrollment?.class_year?.id);
            }}
          />
        </Form.Item>
        <Form.Item
          name="classId"
          label="Promotion"
          rules={[
            { required: true, message: "Veuillez sélectionner une promotion." },
          ]}
          tooltip="La promotion durant laquelle l'étudiant avait manqué ou échoué ce cours."
        >
          <Select options={getCurrentClassesAsOptions(classes)} disabled />
        </Form.Item>
      </Modal>
    </>
  );
};
