"use client";
import { UserAddOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Flex,
  Layout,
  Result,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import { Options, parseAsBoolean, useQueryState } from "nuqs";
import { ListNewApplications } from "./applications/lists/new_applications";
import { ListReApplications } from "./applications/lists/reapplications";
import { ReapplyForm } from "./applications/forms/reapply";
import { NewApplicationForm } from "./applications/forms/new/new";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";

type EnrollButtonProps = {
  setReapply: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  SetNewApplication: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

const EnrollButton: FC<EnrollButtonProps> = ({
  setReapply,
  SetNewApplication,
}) => {
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "reapply",
            label: "Réinscrire (Pour les anciens)",
            icon: <UserOutlined />,
          },
          {
            key: "newApplication",
            label: "Nouvelle candidature",
            icon: <UserAddOutlined />,
          },
        ],
        onClick: ({ key }) => {
          if (key === "reapply") {
            setReapply(true);
          } else if (key === "newApplication") {
            SetNewApplication(true);
          }
        },
      }}
    >
      <Button
        icon={<UserAddOutlined />}
        color="primary"
        style={{ boxShadow: "none" }}
        variant="dashed"
      >
        Inscrire
      </Button>
    </Dropdown>
  );
};
export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const router = useRouter();

  const [reapply, setReapply] = useQueryState(
    "reapply",
    parseAsBoolean.withDefault(false)
  );
  const [newApplication, SetNewApplication] = useQueryState(
    "new",
    parseAsBoolean.withDefault(false)
  );

  const [selectedTag, setSelectedTag] = useState<"new" | "old">("new");

  return (
    <Layout>
      <Layout.Sider
        width={360}
        theme="light"
        style={{ borderRight: `1px solid ${colorBorderSecondary}` }}
      >
        <Flex
          justify="space-between"
          align="center"
          style={{ paddingLeft: 28, paddingRight: 28, paddingTop: 16 }}
        >
          <Typography.Title level={3} className="">
            Candidatures
          </Typography.Title>
          <EnrollButton
            setReapply={setReapply}
            SetNewApplication={SetNewApplication}
          />
        </Flex>

        <Flex gap={4} wrap align="center"  style={{ paddingLeft: 28, paddingRight: 28, paddingTop: 12 }}>
          <Tag.CheckableTag
            key="new"
            checked={selectedTag === "new"}
            onChange={(checked) => setSelectedTag("new")}
            style={{ borderRadius: 12 }}
          >
            Nouveaux
          </Tag.CheckableTag>

          <Tag.CheckableTag
            key="old"
            checked={selectedTag === "old"}
            onChange={(checked) => setSelectedTag("old")}
            style={{ borderRadius: 12 }}
          >
            Anciens
          </Tag.CheckableTag>
        </Flex>
        {selectedTag==="new" && <ListNewApplications /> }
        {selectedTag==="old" && <ListReApplications />}
        {/* <Tabs
          tabBarStyle={{ paddingLeft: 28, marginBottom: 0 }}
          items={[
            {
              key: "waiting",
              label: "Nouveaux étudiants",
              children: <ListNewApplications />,
            },
            {
              key: "accepted",
              label: "Anciens étudiants",
              children: <ListReApplications />,
            },
          ]}
        /> */}
        <ReapplyForm open={reapply} setOpen={setReapply} />
        <NewApplicationForm open={newApplication} setOpen={SetNewApplication} />
      </Layout.Sider>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          background: colorBgContainer,
          overflowY: "auto",
          height: "calc(100vh - 64px)",
        }}
      >
        <div
          className="flex flex-col justify-center"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <Result
            status="info"
            title="Aucune candidature sélectionnée"
            subTitle="Veuillez sélectionner une candidature dans la liste pour afficher les détails."
            icon={<UserAddOutlined style={{ color: "GrayText" }} />}
            extra={
              <Space>
                <Button
                  type="link"
                  style={{ boxShadow: "none" }}
                  onClick={() => router.push(`/app/students`)}
                >
                  Gérer les étudiants
                </Button>
                <EnrollButton
                  setReapply={setReapply}
                  SetNewApplication={SetNewApplication}
                />
              </Space>
            }
          />
        </div>
      </Layout.Content>
    </Layout>
  );
}
