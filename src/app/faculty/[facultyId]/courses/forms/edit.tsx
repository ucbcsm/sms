"use client";

import React, { Dispatch, SetStateAction } from "react";
import { App, Col, Form, Input, Modal, Row, Select } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateCourse,
  getCourseTypesAsOptions,
  getCurrentFacultiesAsOptions,
  getCoursesAsOptions,
  getTeachingUnitsAsOptions,
} from "@/lib/api";
import { Course, Faculty, TeachingUnit } from "@/types";
import { filterOption } from "@/lib/utils";

type FormDataType = Omit<
  Course,
  "id" | "faculties" | "prerequisite_courses" | "teaching_unit"
> & {
  faculties: number[];
  prerequisite_courses: number[];
  teaching_unit: number;
};

type EditCourseFormProps = {
  course: Course;
  faculties?: Faculty[];
  courses?: Course[];
  teachingUnits?: TeachingUnit[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditCourseForm: React.FC<EditCourseFormProps> = ({
  course,
  faculties,
  courses,
  teachingUnits,
  open,
  setOpen,
}) => {
  const {message} = App.useApp();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateCourse,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { id: course.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["courses"] });
          queryClient.invalidateQueries({ queryKey: ["all-courses"] });
          message.success("Cours modifié avec succès !");
          setOpen(false);
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
                "Une erreur s'est produite lors de la modification du cours."
            );
          }
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      title="Modifier le cours"
      centered
      okText="Enregistrer"
      cancelText="Annuler"
      okButtonProps={{
        autoFocus: true,
        htmlType: "submit",
        style: { boxShadow: "none" },
        loading: isPending,
      }}
      cancelButtonProps={{
        style: { boxShadow: "none" },
      }}
      onCancel={() => setOpen(false)}
      destroyOnHidden
      maskClosable={!isPending}
      modalRender={(dom) => (
        <Form
          disabled={isPending}
          key="edit_course"
          layout="vertical"
          form={form}
          name="edit_course"
          initialValues={{
            ...course,
            faculties: course.faculties.map((fac) => fac.id),
            prerequisite_courses: course.prerequisite_courses.map((c) => c.id),
            teaching_unit: course.teaching_unit?.id,
          }}
          onFinish={onFinish}
        >
          {dom}
        </Form>
      )}
    >
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Form.Item
            name="name"
            label="Nom du cours"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le nom du cours",
              },
            ]}
          >
            <Input placeholder="Nom du cours" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="code"
            label="Code"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le code du cours",
              },
            ]}
          >
            <Input placeholder="Code du cours" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="course_type"
        label="Nature du cours"
        rules={[
          {
            required: true,
            message: "Veuillez sélectionner un type de cours",
          },
        ]}
      >
        <Select options={getCourseTypesAsOptions} />
      </Form.Item>
      <Form.Item name="teaching_unit" label="Unité d'enseignement">
        <Select
          placeholder="Sélectionnez une UE"
          showSearch
          options={getTeachingUnitsAsOptions(teachingUnits)}
          filterOption={filterOption}
          allowClear
        />
      </Form.Item>
      <Form.Item name="prerequisite_courses" label="Prérequis du cours">
        <Select
          placeholder="Sélectionnez les cours prérequis"
          showSearch
          options={getCoursesAsOptions(courses)}
          mode="multiple"
          filterOption={filterOption}
          allowClear
        />
      </Form.Item>
      <Form.Item
        name="faculties"
        label="Pour facultés"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Sélectionnez une faculté"
          showSearch
          options={getCurrentFacultiesAsOptions(faculties)}
          mode="multiple"
          filterOption={filterOption}
          disabled
        />
      </Form.Item>
    </Modal>
  );
};
