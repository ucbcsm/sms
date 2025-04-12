import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Row,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

type FormData = {
  startDate: string;
  endDate: string;
  name: string;
  cycles: string[];
};

export const NewYearForm: React.FC = () => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<FormData>();
  const [open, setOpen] = useState(false);

  const onCreate = (values: FormData) => {
    console.log("Received values of form: ", values);
    setFormValues(values);
    setOpen(false);
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
        Nouvelle année
      </Button>
      <Modal
        open={open}
        title="Nouvelle année"
        centered
        okText="Créer"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
        }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            key="form"
            layout="vertical"
            form={form}
            name="form_in_modal"
            initialValues={{ modifier: "public" }}
            clearOnDestroy
            onFinish={(values) => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startDate"
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
              name="endDate"
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
          name="name"
          label="Nom de l'année"
          rules={[
            { required: true, message: "Veuillez entrer le nom de l'année" },
          ]}
        >
          <Input placeholder="YYYY-YYYY" />
        </Form.Item>
        <Form.Item
          name="cycles"
          label="Cycles organisés"
          rules={[
            { required: true, message: "Veuillez choisir au moins un cycle" },
          ]}
        >
          <Checkbox.Group
            options={[
              { value: "licence", label: "Licence" },
              { value: "master", label: "Master" },
              { value: "doctorat", label: "Doctorat" },
            ]}
            defaultValue={[]}
          />
        </Form.Item>
      </Modal>
    </>
  );
};
