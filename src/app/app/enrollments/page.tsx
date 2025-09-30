"use client";
import {
  PlusCircleOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
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
import {
  Options,
  parseAsBoolean,
  parseAsInteger,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";
import { ListNewApplications } from "./applications/lists/new_applications";
import { ListReApplications } from "./applications/lists/reapplications";
import { ReapplyForm } from "./applications/forms/reapply/reapply";
import { NewApplicationForm } from "./applications/forms/new/new";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  getApplication,
  getClasses,
  getCycles,
  getDepartments,
  getEnabledRequiredDocuments,
  getEnabledTestCourses,
  getFaculties,
  getFields,
} from "@/lib/api";
import { ViewEditApplicationForm } from "./view";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import Link from "next/link";
import { FormerApplicationForm } from "./applications/forms/former-student-application";

type EnrollButtonProps = {
  setReapply: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  SetNewApplication: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  SetNewFormer: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

const EnrollButton: FC<EnrollButtonProps> = ({
  setReapply,
  SetNewApplication,
  SetNewFormer
}) => {
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "newApplication",
            label: "Nouvelle candidature",
            icon: <PlusCircleOutlined />,
          },
          {
            key: "reapply",
            label: "Réinscrire (Anciens étudiants)",
            icon: <UserOutlined />,
          },
          {
            key: "divider-1",
            type: "divider",
          },
          {
            key: "formerStudent",
            label: "Enregistrement (Anciens étudiants)",
            icon: <UserAddOutlined />,
          },
        ],
        onClick: ({ key }) => {
          if (key === "reapply") {
            setReapply(true);
          } else if (key === "newApplication") {
            SetNewApplication(true);
          } else if (key === "formerStudent") {
            SetNewFormer(true);
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

  const [newFormer, SetNewFormer] = useQueryState(
    "new-former",
    parseAsBoolean.withDefault(false)
  );


  const [selectedTab, setSelectedTab] = useQueryState(
    "tab",
    parseAsStringEnum(["new", "old"]).withDefault("new")
  );

  const [view, setView] = useQueryState("view", parseAsInteger.withDefault(0));

  const {
    data: application,
    isPending: isPendingApplication,
    isError: isErrorApplication,
  } = useQuery({
    queryKey: ["applications", `${view}`],
    queryFn: ({ queryKey }) => getApplication(Number(queryKey[1])),
    enabled: !!(view > 0),
  });

  const { data: test_courses } = useQuery({
    queryKey: ["test_courses", "enabled"],
    queryFn: getEnabledTestCourses,
  });

  const { data: required_documents } = useQuery({
    queryKey: ["required_documents", "enabled"],
    queryFn: getEnabledRequiredDocuments,
  });

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
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 16,
            marginBottom: 16,
          }}
        >
          <Typography.Title level={3} className="" style={{ marginBottom: 0 }}>
            Candidatures
          </Typography.Title>
          <EnrollButton
            setReapply={setReapply}
            SetNewApplication={SetNewApplication}
            SetNewFormer={SetNewFormer}
          />
        </Flex>

        <Flex
          gap={4}
          wrap
          align="center"
          style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12 }}
        >
          <Tag.CheckableTag
            key="new"
            checked={selectedTab === "new"}
            onChange={(checked) => setSelectedTab("new")}
            style={{ borderRadius: 12 }}
          >
            Nouveaux
          </Tag.CheckableTag>

          <Tag.CheckableTag
            key="old"
            checked={selectedTab === "old"}
            onChange={(checked) => setSelectedTab("old")}
            style={{ borderRadius: 12 }}
          >
            Anciens
          </Tag.CheckableTag>
        </Flex>
        {selectedTab === "new" && <ListNewApplications />}
        {selectedTab === "old" && <ListReApplications />}
        <ReapplyForm open={reapply} setOpen={setReapply} />
        <NewApplicationForm open={newApplication} setOpen={SetNewApplication} />
        <FormerApplicationForm open={newFormer} setOpen={SetNewFormer} />
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
        {isPendingApplication && view > 0 && (
          <div className="px-0 py-7" style={{ height: "calc(100vh - 64px)" }}>
            <DataFetchPendingSkeleton />
          </div>
        )}

        {!isPendingApplication && view > 0 && (
          <ViewEditApplicationForm
            application={application}
            courses={test_courses}
            documents={required_documents}
            cycles={cycles}
            faculties={faculties}
            fields={fields}
            departments={departments}
            classes={classes}
            setView={setView}
          />
        )}
        {view === 0 && (
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
                  <Link href={`/app/students`}>
                    <Button type="link" style={{ boxShadow: "none" }}>
                      Gérer les étudiants
                    </Button>
                  </Link>
                  <EnrollButton
                    setReapply={setReapply}
                    SetNewApplication={SetNewApplication}
                    SetNewFormer={SetNewFormer}
                  />
                </Space>
              }
            />
          </div>
        )}
      </Layout.Content>
    </Layout>
  );
}
