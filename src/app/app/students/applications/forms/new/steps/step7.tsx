"use client";
import { useYid } from "@/hooks/use-yid";
import { Step7ApplicationFormDataType } from "@/types";
import {
  getClasses,
  getCurrentClassesAsOptions,
  getCurrentCyclesAsOptions,
  getCurrentDepartmentsAsOptions,
  getCurrentFacultiesAsOptions,
  getCurrentFieldsAsOptions,
  getCycles,
  getDepartments,
  getFaculties,
  getFields,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Form,
  Select,
  Space,
  Radio,
  Flex,
  Skeleton,
  Alert,
} from "antd";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { Options } from "nuqs";
import { FC, useEffect, useMemo } from "react";
import { Palette } from "@/components/palette";
import { BulbOutlined } from "@ant-design/icons";
import { filterOption } from "@/lib/utils";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const Step7: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<Step7ApplicationFormDataType>();
  const { yid } = useYid();
  const cycleId = Form.useWatch("cycle_id", form);
  const fieldId = Form.useWatch("field_id", form);
  const facultyId = Form.useWatch("faculty_id", form);

  const {
    data: cycles,
    isPending: isPendingCycles,
    isError: isErrorCycles,
  } = useQuery({
    queryKey: ["cycles"],
    queryFn: getCycles,
  });

  const {
    data: faculties,
    isPending: isPendingFaculties,
    isError: isErrorFaculties,
  } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });

  const {
    data: fields,
    isPending: isPendingFields,
    isError: isErrorFields,
  } = useQuery({
    queryKey: ["fields"],
    queryFn: getFields,
  });

  const {
    data: departments,
    isPending: isePendingDepartments,
    isError: isErrorDepartments,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const {
    data: classes,
    isPending: isPendingClasses,
    isError: isErrorClasses,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });

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

  const filteredClasses = useMemo(() => {
    const clas = classes?.filter((c) => c.cycle?.id === cycleId);
    if (clas && clas.length > 0) {
      return clas;
    }
  }, [cycleId]);

  useEffect(() => {
    const savedData = localStorage.getItem("d7");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({ ...data });
    }
  }, [yid]);

  if (
    isPendingCycles ||
    isPendingFields ||
    isPendingFaculties ||
    isePendingDepartments ||
    isPendingClasses
  ) {
    return <Skeleton active />;
  }

  if (
    isErrorCycles ||
    isErrorFields ||
    isErrorFaculties ||
    isErrorDepartments ||
    isErrorClasses
  ) {
    return (
      <Alert
        type="error"
        showIcon
        description="Erreur lors du chargement de resources necessaire pour ce formulaire. Veuillez Actualiser"
        action={
          <Button
            type="link"
            onClick={() => {
              window.location.reload();
            }}
            style={{ boxShadow: "none" }}
            size="small"
          >
            Actualiser
          </Button>
        }
      />
    );
  }

  return (
    <Form
      form={form}
      onFinish={(values) => {
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify({ ...values, year_id: yid })
        );
        localStorage.setItem("d7", compressedData);
        setStep(7);
      }}
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
      >
        <Select
          options={getCurrentFieldsAsOptions(filteredFields || fields)}
          showSearch
          filterOption={filterOption}
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
        label="Département"
        name="department_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          placeholder="Département"
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

      <Form.Item
        label="Promotion"
        name="class_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          placeholder="Promotion ou classe"
          options={getCurrentClassesAsOptions(filteredClasses || classes)}
          showSearch
          onSelect={(value) => {
            const selectedClass = classes?.find((c) => c.id === value);
            form.setFieldsValue({
              cycle_id: selectedClass?.cycle?.id,
            });
          }}
        />
      </Form.Item>
      <Flex justify="space-between" align="center">
        <Palette />
        <Form.Item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: 20,
          }}
        >
          <Space>
            <Button onClick={() => setStep(5)} style={{ boxShadow: "none" }}>
              Précédent
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ boxShadow: "none" }}
            >
              Suivant
            </Button>
          </Space>
        </Form.Item>
      </Flex>
    </Form>
  );
};
