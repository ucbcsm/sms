"use client";
import React, { Dispatch, SetStateAction } from "react";
import { Button, Form, Drawer, message, Space, theme } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Application, Institute } from "@/types";
import { Palette } from "@/components/palette";
import type { GetProp, UploadFile, UploadProps } from "antd";

type FormDataType = Partial<Omit<Institute, "id">>;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type EditApplicationFormProps = {
  application: Application;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditApplicationForm: React.FC<EditApplicationFormProps> = ({
  application,
  open,
  setOpen,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values: FormDataType) => {
    // mutateAsync(
    //   { id: Number(institution?.id), params: values },
    //   {
    //     onSuccess: () => {
    //       queryClient.invalidateQueries({ queryKey: ["institution"] });
    //       messageApi.success("Institution mise à jour avec succès.");
    //       setOpen(false);
    //     },
    //     onError: () => {
    //       messageApi.error(
    //         "Une erreur est survenue lors de la mise à jour de l'institution."
    //       );
    //     },
    //   }
    // );
  };

  return (
    <>
      {contextHolder}

      <Drawer
        open={open}
        title={<div className="text-white">Candidature</div>}
        width="100%"
        closable={false}
        onClose={() => setOpen(false)}
        destroyOnClose
        styles={{ header: { background: colorPrimary } }}
        extra={
          <Space>
            <Button
              style={{ boxShadow: "none", color: "#fff" }}
              onClick={() => {
                setOpen(false);
              }}
              icon={<CloseOutlined />}
              type="text"
              //   disabled={isPending}
            />
          </Space>
        }
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 24px",
            }}
          >
            <Palette />
            <Space>
              <Button
                onClick={() => setOpen(false)}
                style={{ boxShadow: "none" }}
                // disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                // loading={isPending}
                style={{ boxShadow: "none" }}
              >
                Sauvegarder
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          // layout="vertical"
          form={form}
          name="form_in_drawer"
          initialValues={{}}
          onFinish={onFinish}
          //   disabled={isPending}
          style={{ maxWidth: 720, margin: "auto" }}
        ></Form>
      </Drawer>
    </>
  );
};
