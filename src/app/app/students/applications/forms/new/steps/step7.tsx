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
    return fields?.filter((f) => f.cycle?.id === cycleId);
  }, [cycleId]);

  const filteredFaculties = useMemo(() => {
    return faculties?.filter((fac) => fac.field.id === fieldId);
  }, [fieldId]);

  const filteredDepartments = useMemo(() => {
    return departments?.filter((dep) => dep.faculty.id === facultyId);
  }, [facultyId]);

  const filteredClasses = useMemo(() => {
    return classes?.filter((c) => c.cycle?.id === cycleId);
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
      <Alert
        showIcon
        icon={<BulbOutlined />}
        description="Respecter l'ordre de remplissage pour une bonne cohérence des données"
        closable
        style={{ marginBottom: 16 }}
      />
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
          options={getCurrentFieldsAsOptions(filteredFields)}
          showSearch
        />
      </Form.Item>
      <Form.Item
        label="Filière"
        name="faculty_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          options={getCurrentFacultiesAsOptions(filteredFaculties)}
          showSearch
        />
      </Form.Item>
      <Form.Item
        label="Département"
        name="department_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          placeholder="Département"
          options={getCurrentDepartmentsAsOptions(filteredDepartments)}
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

      <Form.Item
        label="Promotion"
        name="class_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          placeholder="Promotion ou classe"
          options={getCurrentClassesAsOptions(filteredClasses)}
          showSearch
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
