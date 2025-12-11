"use client";

import { Dispatch, FC, SetStateAction, useMemo, useState } from "react";
import { Form, Radio, Select, Modal, App } from "antd";
import {
  downloadStudentImportTemplate,
  getCurrentCyclesAsOptions,
  getCurrentDepartmentsAsOptions,
  getCurrentFacultiesAsOptions,
  getCurrentFieldsAsOptions,
} from "@/lib/api";
import { Cycle, Faculty, Department, Class, Field } from "@/types";
import { filterOption } from "@/lib/utils";

type FormDataType = {
  cycle_id: number;
  field_id: number;
  faculty_id: number;
  department_id: number;
};

type ExportTemplateFormModalProps = {
  cycles?: Cycle[];
  fields?:Field[]
  faculties?: Faculty[];
  departments?: Department[];
  classes?: Class[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const ExportTemplateFormModal: FC<ExportTemplateFormModalProps> = ({
  cycles,
  fields,
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

  const filteredFields = useMemo(() => {
    const flds = fields?.filter((f) => f.cycle?.id === cycleId);
    if (flds && flds.length > 0) {
      return flds;
    }
  }, [cycleId]);

  const filteredFaculties = useMemo(() => {
    const facs = faculties?.filter((fac) => fac.field.id === fieldId);
    if (facs && facs.length > 0) {
      return facs;
    }
  }, [fieldId]);

  const filteredDepartments = useMemo(() => {
    const depts = departments?.filter((dep) => dep.faculty.id === facultyId);
    if (depts && depts.length > 0) {
      return depts;
    }
  }, [facultyId]);

  const onClose = () => {
    setIsLoading(false);
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async (values: FormDataType) => {
    const faculty = faculties?.find((fac) => fac.id === values.faculty_id);
    const cycle = cycles?.find((c) => c.id === values.cycle_id);
    const department = departments?.find((d) => d.id === values.department_id);
    const filteredClasses = classes?.filter(
      (cls) => values.cycle_id === cls.cycle?.id
    );

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
      title="Télécharger le modèle d'import des étudiants"
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
      forceRender
    >
      <Form.Item
        label="Cycle"
        name="cycle_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Radio.Group options={getCurrentCyclesAsOptions(cycles)} />
      </Form.Item>
      <Form.Item
        label="Domaine"
        name="field_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
        // hidden
      >
        <Select
          options={getCurrentFieldsAsOptions(filteredFields || fields)}
          showSearch={{ filterOption: filterOption }}
          placeholder="Séléctionner un domaine"
          onSelect={(value) => {
            const selectedField = fields?.find((f) => f.id === value);
            form.setFieldsValue({
              cycle_id: selectedField?.cycle?.id,
              faculty_id: undefined,
              department_id: undefined,
            });
          }}
        />
      </Form.Item>
      <Form.Item
        label="Filière"
        name="faculty_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          options={getCurrentFacultiesAsOptions(filteredFaculties || faculties)}
          showSearch={{ filterOption: filterOption }}
          placeholder="Séléctionner une filière"
          onSelect={(value) => {
            const selectedFac = faculties?.find((fac) => fac.id === value);
            form.setFieldsValue({
              cycle_id: selectedFac?.field.cycle?.id,
              field_id: selectedFac?.field.id,
              department_id: undefined,
            });
          }}
        />
      </Form.Item>
      <Form.Item
        label="Mention"
        name="department_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          placeholder="Séléctionner une mention"
          options={getCurrentDepartmentsAsOptions(
            filteredDepartments || departments
          )}
          onSelect={(value) => {
            const selectedDep = departments?.find((dep) => dep.id === value);
            const facId = selectedDep?.faculty.id;
            const selectedFac = faculties?.find((fac) => fac.id === facId);
            form.setFieldsValue({
              cycle_id: selectedFac?.field.cycle?.id,
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
