"use client";

import React, { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Cycle, Period } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPeriod,
  getCurrentCyclesAsOptions,
  getPeriodTypesAsOptions,
} from "@/lib/api";
import { useParams } from "next/navigation";

type FormDataType = Omit<Period, "id" | "academic_year" | "cycle"> & {
  year_id: number;
  cycle_id: number;
};

type NewPeriodFormProps = {
  cycles?: Cycle[];
};
export const NewPeriodForm: React.FC<NewPeriodFormProps> = ({ cycles }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { yearId } = useParams();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createPeriod,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(
      { ...values, year_id: Number(yearId) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["periods"] });
          messageApi.success("Période créée avec succès !");
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
                "Une erreur s'est produite lors de la création de la période."
            );
          }
        }
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="shadow-none"
        title="Ajouter un période"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouvelle période"
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
        onCancel={() => setOpen(false)}
        destroyOnHidden
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="create_new_period"
            // layout="vertical"
            form={form}
            name="create_new_period"
            onFinish={onFinish}
            clearOnDestroy
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="type_of_period"
          label="Type de période"
          rules={[
            {
              required: true,
            },
          ]}
          style={{ marginTop: 24 }}
        >
          <Select
            placeholder="Sélectionner un type de période"
            options={getPeriodTypesAsOptions}
          />
        </Form.Item>
        <Form.Item
          name="order_number"
          label="No d'ordre"
          tooltip="Entrez une valeur multiple de 0.5 (ex: 1, 1.5, 2, 2.5...)"
          rules={[
            { required: true, message: "Veuillez entrer le No d'ordre" },
            {
              validator: (_, value) => {
                if (value === undefined || value === null)
                  return Promise.resolve();
                if (value % 0.5 !== 0) {
                  return Promise.reject(
                    new Error(
                      "La valeur doit être un multiple de 0.5 (ex: 1, 1.5, 2...)"
                    )
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber min={1} step={0.5} placeholder="Ex.: 2.5" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Nom de la période"
          rules={[{ required: true }]}
        >
          <Input placeholder="Nom de la période" />
        </Form.Item>
        <Form.Item
          name="acronym"
          label="Code de la période"
          rules={[{ required: true }]}
        >
          <Input placeholder="Ex: S1, S2, BS1, ..." style={{ width: 120 }} />
        </Form.Item>
        <Form.Item
          name="cycle_id"
          label="Cycle"
          rules={[
            { required: true, message: "Veuillez sélectionner un cycle" },
          ]}
        >
          <Select
            placeholder="Sélectionnez un cycle"
            options={getCurrentCyclesAsOptions(cycles)}
          />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="start_date"
              label="Date de début"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer la date de début",
                },
              ]}
            >
              <DatePicker
                placeholder="DD/MM/YYYY"
                format={{ format: "DD/MM/YYYY", type: "mask" }}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="end_date"
              label="Date de fin"
              rules={[
                { required: true, message: "Veuillez entrer la date de fin" },
              ]}
            >
              <DatePicker
                placeholder="DD/MM/YYYY"
                format={{ format: "DD/MM/YYYY", type: "mask" }}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="status"
          label="Statut des inscriptions"
          rules={[
            { required: true, message: "Veuillez sélectionner un statut" },
          ]}
        >
          <Select
            placeholder="Sélectionnez un statut"
            options={[
              { value: "pending", label: "En attente" },
              { value: "progress", label: "En cours" },
              { value: "finished", label: "Terminé" },
              { value: "suspended", label: "Suspendu" },
            ]}
          />
        </Form.Item>
      </Modal>
    </>
  );
};
