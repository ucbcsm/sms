"use client";
import { useYid } from "@/hooks/useYid";
import { Step7ApplicationFormDataType } from "@/lib/types";
import {
  getClasses,
  getCurrentClassesAsOptions,
  getCurrentCyclesAsOptions,
  getCurrentDepartmentsAsOptions,
  getCurrentFacultiesAsOptions,
  getCurrentFieldsAsOptions,
  getCurrentPeriodsAsOptions,
  getCycles,
  getDepartments,
  getFaculties,
  getFields,
  getPeriods,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Select, Space, Radio, InputNumber } from "antd";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { Options } from "nuqs";
import { FC, useEffect } from "react";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const Step7: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<Step7ApplicationFormDataType>();
  const {yid}=useYid()

  const { data: cycles } = useQuery({
    queryKey: ["cycles"],
    queryFn: getCycles,
  });

  const { data: faculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });

  const { data: fields } = useQuery({
    queryKey: ["fields"],
    queryFn: getFields,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });

  const { data: periods } = useQuery({
    queryKey: ["periods"],
    queryFn: getPeriods,
  });
console.log(departments)
  useEffect(() => {
    const savedData = localStorage.getItem("d7");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({ ...data, year_id:yid });
    }
  }, [yid]);
  return (
    <Form
      
      form={form}
      style={{ width: 500 }}
      onFinish={(values) => {
        console.log(values)
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify(values)
        );
        localStorage.setItem("d7", compressedData);
        setStep(7);
      }}
    >
      <Form.Item label="Année académique" name="year_id">
        <InputNumber placeholder={`${yid}`} disabled variant="borderless" />
      </Form.Item>
      <Form.Item
        label="Cycle"
        name="cycle_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
        
      >
        <Radio.Group options={getCurrentCyclesAsOptions(cycles)} />
      </Form.Item>
      <Form.Item
        label="Filière ou Domaine"
        name="field_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select options={getCurrentFieldsAsOptions(fields)} disabled />
      </Form.Item>
      <Form.Item
        label="Faculté"
        name="faculty_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          placeholder="Faculté"
          options={getCurrentFacultiesAsOptions(faculties)}
         disabled
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
          onSelect={(value)=>{
            const selectedDep=departments?.find(dep=>dep.id===value)
            const facId=selectedDep?.faculty.id
            const selectedFac= faculties?.find(fac=>fac.id===facId)
            form.setFieldsValue({faculty_id:facId,field_id:selectedFac?.field.id})
          }}
        />
      </Form.Item>
      <Form.Item
        label="Promotion"
        name="class_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          placeholder="Promotion ou classe"
          options={getCurrentClassesAsOptions(classes)}
        />
      </Form.Item>
      <Form.Item
        label="Période"
        name="period_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          placeholder="Période"
          options={getCurrentPeriodsAsOptions(periods)}
        />
      </Form.Item>
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
    </Form>
  );
};
