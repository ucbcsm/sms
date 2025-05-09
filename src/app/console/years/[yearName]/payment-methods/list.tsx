"use client";

import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input, List, message, Space, Switch, Typography } from "antd";

import { getPaymentMethods, updatePaymentMethod } from "@/utils";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { FC, useState } from "react";
import { NewPaymentMethodForm } from "./forms/new";
import { PaymentMethod } from "@/types";
import { EditPaymentMethodForm } from "./forms/edit";
import { DeletePaymentMethodForm } from "./forms/delete";

type ListItemProps = {
  item: PaymentMethod;
};

const ListItem: FC<ListItemProps> = ({ item }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updatePaymentMethod,
  });

  return (
    <>
      {contextHolder}
      <List.Item
        key={item.id}
        extra={
          <Space>
            <Switch
              checked={item.enabled}
              loading={isPending}
              onChange={(checked) => {
                mutateAsync(
                  {
                    id: item.id,
                    params: {
                      enabled: checked,
                      name: item.name,
                      description: item.description,
                    },
                  },
                  {
                    onSuccess: () => {
                      queryClient.invalidateQueries({
                        queryKey: ["payment-methods"],
                      });
                      messageApi.success(
                        "Méthode de paiement modifiée avec succès !"
                      );
                    },
                    onError: () => {
                      messageApi.error(
                        "Une erreur s'est produite lors de la modification de la méthode de paiement."
                      );
                    },
                  }
                );
              }}
            />
            <EditPaymentMethodForm
              paymentMethod={item}
              open={openEdit}
              setOpen={setOpenEdit}
            />
            <DeletePaymentMethodForm
              paymentMethod={item}
              open={openDelete}
              setOpen={setOpenDelete}
            />
            <Dropdown
              menu={{
                items: [
                  { key: "edit", label: "Modifier", icon: <EditOutlined /> },
                  {
                    key: "delete",
                    label: "Supprimer",
                    danger: true,
                    icon: <DeleteOutlined />,
                  },
                ],
                onClick: ({ key }) => {
                  if (key === "edit") {
                    setOpenEdit(true);
                  } else if (key === "delete") {
                    setOpenDelete(true);
                  }
                },
              }}
            >
              <Button icon={<MoreOutlined />} type="text" />
            </Dropdown>
          </Space>
        }
      >
        <List.Item.Meta title={item.name} description={item.description} />
      </List.Item>
    </>
  );
};

export function ListPaymentMethods() {
  const { data: paymentMethods, isPending } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethods,
  });

  return (
    <List
      header={
        <header className="flex pb-3">
          <Space>
            <Typography.Title level={5} style={{marginBottom:0}}>Méthodes de paiement</Typography.Title>
            {/* <Input.Search placeholder="Rechercher un méthode de paiement ..." /> */}
          </Space>
          <div className="flex-1" />
          <Space>
            <NewPaymentMethodForm />
          </Space>
        </header>
      }
      loading={isPending}
      dataSource={
        paymentMethods
        // [
        // {
        //   id: "1",
        //   name: "Carte Bancaire",
        //   description: "Paiement via carte bancaire (Visa, MasterCard, etc.)",
        //   status: "disabled",
        // },
        // {
        //   id: "2",
        //   name: "PayPal",
        //   description: "Paiement via compte PayPal",
        //   status: "disabled",
        // },
        // {
        //   id: "3",
        //   name: "Virement Bancaire",
        //   description: "Paiement par transfert bancaire",
        //   status: "enabled",
        // },
        // {
        //   id: "4",
        //   name: "Espèces",
        //   description: "Paiement en espèces au bureau",
        //   status: "enabled",
        // },
        // {
        //   id: "5",
        //   name: "Chèques",
        //   description: "Paiement par chèques bancaires",
        //   status: "enabled",
        // },
        //   ]
      }
      renderItem={(item) => <ListItem key={item.id} item={item} />}
    />
  );
}
