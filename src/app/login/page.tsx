"use client";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Layout,
  Space,
  theme,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().nonempty("L'email ou le matricule est requis."),
  password: z.string().nonempty("Le mot de passe est requis."),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const router = useRouter();

  const onFinish = (values: FormSchema) => {
    router.push("/app");
  };
  return (
    <Layout>
      <Layout.Content
        style={{
          backgroundImage: `url("/ucbc-front.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      ></Layout.Content>
      <Layout.Sider
        theme="light"
        width={300}
        style={{
          borderLeft: `1px solid ${colorBorderSecondary}`,
          background: colorBgContainer,
          height: `100vh`,
          overflow: "auto",
        }}
      >
        <div className="flex flex-col h-full">
          <Layout.Header
            style={{
              background: colorBgContainer,
              paddingLeft: 32,
              paddingRight: 32,
            }}
          >
            <Space>
              <Typography.Title level={4} style={{ marginBottom: 0 }}>
                CI-UCBC
              </Typography.Title>
            </Space>
          </Layout.Header>
          <div className="flex-1 flex flex-col justify-center p-8">
            <div className="">
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                Bienvenue!
              </Typography.Title>
              <Typography.Text type="secondary">
                Veuillez vous connecter pour accéder à votre compte.
              </Typography.Text>
            </div>
            <div className="mt-8">
              <Form
                name="login"
                initialValues={{ remember: true }}
                style={{ maxWidth: 360 }}
                onFinish={onFinish}
                
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Email ou Matricule"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true},
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Mot de passe"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    style={{ boxShadow: "none" }}
                  >
                    Connexion
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button block type="link">
                    Mot de passe oublié
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
          <Layout.Footer
            style={{
              background: colorBgContainer,
              paddingLeft: 32,
              paddingRight: 32,
              borderTop: `1px solid ${colorBorderSecondary}`,
            }}
          >
            <Typography.Text type="secondary">
              © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
            </Typography.Text>
          </Layout.Footer>
        </div>
      </Layout.Sider>
    </Layout>
  );
}
