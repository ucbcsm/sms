"use client";

import React, { useState } from "react";
import {
  App,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCourse,
  getCoursesAsOptions,
  getCourseTypesAsOptions,
  getCurrentFacultiesAsOptions,
  getTeachingUnitsAsOptions,
} from "@/lib/api";
import { Course, Faculty, TeachingUnit } from "@/types";
import { filterOption } from "@/lib/utils";
import { useParams } from "next/navigation";

type FormDataType = Omit<
  Course,
  "id" | "faculties" | "prerequisite_courses" | "teaching_unit"
> & {
  faculties: number[];
  prerequisite_courses: number[];
  teaching_unit: number;
};

type NewCourseFormProps = {
  faculties?: Faculty[];
  courses?: Course[];
  teachingUnits?: TeachingUnit[];
};
export const NewCourseForm: React.FC<NewCourseFormProps> = ({
  faculties,
  courses,
  teachingUnits,
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { facultyId } = useParams();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCourse,
  });

  const onclose = () => {
    form.resetFields();
    setOpen(false);
  };

  const onFinish = (values: FormDataType) => {
    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        queryClient.invalidateQueries({ queryKey: ["all-courses"] });
        message.success("Cours créé avec succès !");
        onclose();
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
              "Une erreur s'est produite lors de la création du cours."
          );
        }
      },
    });
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="shadow-none"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Nouveau cours
      </Button>
      <Modal
        open={open}
        title="Nouveau cours"
        centered
        okText="Créer"
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
        onCancel={onclose}
        destroyOnHidden
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="create_new_course"
            layout="vertical"
            form={form}
            name="create_new_course"
            onFinish={onFinish}
            clearOnDestroy
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
          initialValue={[Number(facultyId)]}
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
    </>
  );
};
