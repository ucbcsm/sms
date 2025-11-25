"use client";

import { Dispatch, FC, SetStateAction, useMemo, useState } from "react";
import { Form, Radio, Select, Modal, App } from "antd";
import {
  downloadStudentImportTemplate,
  getCurrentCyclesAsOptions,
  getCurrentDepartmentsAsOptions,
  getCurrentFacultiesAsOptions,
} from "@/lib/api";
import { Cycle, Faculty, Department, Class } from "@/types";
import { filterOption } from "@/lib/utils";

type FormDataType = {
  cycle_id: number;
  faculty_id: number;
  department_id: number;
};

type ExportTemplateFormModalProps = {
  cycles?: Cycle[];
  faculties?: Faculty[];
  departments?: Department[];
  classes?: Class[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const ExportTemplateFormModal: FC<ExportTemplateFormModalProps> = ({
  cycles,
  faculties,
  departments,
  classes,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cycleId = Form.useWatch("cycle_id", form);
  const fieldId = Form.useWatch("field_id", form);
  const facultyId = Form.useWatch("faculty_id", form);
  console.log(`departments`, departments);

  const filteredFaculties = useMemo(() => {
    return faculties?.filter((fac) => fac.field.id === fieldId);
  }, [fieldId]);

  const filteredDepartments = useMemo(() => {
    return departments?.filter((dep) => dep.faculty.id === facultyId);
  }, [facultyId]);

  const onClose = () => {
    setIsLoading(false);
    setOpen(false);
    form.resetFields();
  };
console.log("Departments", departments)
  const onFinish = async (values: FormDataType) => {
    const faculty = faculties?.find((fac) => fac.id === values.faculty_id);
    const cycle = cycles?.find((c) => c.id === values.cycle_id);
    const department = departments?.find((d) => d.id === values.department_id);
    const filteredClasses= classes?.filter(cls=> values.cycle_id === cls.cycle?.id);

    if (cycle && faculty && department && filteredClasses) {
      await downloadStudentImportTemplate({
        inputs: {
          faculty: faculty,
          department: department,
          cycle: cycle,
          classes: filteredClasses,
        },
        fileName: `${department.acronym.toUpperCase()}_students_form${
          department.id
        }.xlsx`,
        onStart: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          message.success("Modèle téléchargé avec succès !");
          onClose();
        },
      });
    }
  };

  return (
    <Modal
      open={open}
      title="Télécharger le modèle d'import des étudiant"
      centered
      okText="Télécharger"
      cancelText="Annuler"
      okButtonProps={{
        autoFocus: true,
        htmlType: "submit",
        style: { boxShadow: "none" },
        disabled: isLoading,
        loading: isLoading,
      }}
      cancelButtonProps={{
        style: { boxShadow: "none" },
        disabled: isLoading,
      }}
      onCancel={onClose}
      destroyOnHidden
      closable={{ disabled: isLoading }}
      maskClosable={!isLoading}
      modalRender={(dom) => (
        <Form
          form={form}
          layout="vertical"
          name="export_template_form"
          onFinish={onFinish}
          disabled={isLoading}
        >
          {dom}
        </Form>
      )}
    >
      <Form.Item
        label="Cycle"
        name="cycle_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Radio.Group options={getCurrentCyclesAsOptions(cycles)} />
      </Form.Item>
      <Form.Item
        label="Filière"
        name="faculty_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          options={getCurrentFacultiesAsOptions(faculties)}
          showSearch
          filterOption={filterOption}
        />
      </Form.Item>
      <Form.Item
        label="Département"
        name="department_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          placeholder="Département"
          options={getCurrentDepartmentsAsOptions(departments)}
          onSelect={(value) => {
            const selectedDep = departments?.find((dep) => dep.id === value);
            const facId = selectedDep?.faculty.id;
            const selectedFac = faculties?.find((fac) => fac.id === facId);
            form.setFieldsValue({
              faculty_id: facId,
              field_id: selectedFac?.field.id,
            });
          }}
          showSearch
        />
      </Form.Item>
    </Modal>
  );
};
