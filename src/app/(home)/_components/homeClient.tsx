"use client";

import Link from "next/link";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Empty,
  Image,
  Layout,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import { FC } from "react";
import { AppItem, User } from "@/types";
import { useInstitution } from "@/hooks/use-institution";
import { SupportDrawer } from "@/components/support-drawer";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { UserProfileButton } from "@/components/userProfileButton";
import { AppsButton } from "@/components/appsButton";
import { Palette } from "@/components/palette";
import { getGreeting, getPublicR2Url } from "@/lib/utils";
import { getRoleName } from "@/lib/api";
import { CheckOutlined, CrownOutlined, UserOutlined } from "@ant-design/icons";

type HomeClientProps = {
  apps: AppItem[];
  user?: User | null;
};

export const HomeClient: FC<HomeClientProps> = ({ apps, user }) => {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const { data: institution } = useInstitution();

  return (
    <main className="min-h-screen ">
      <Layout>
        <Layout.Header
          style={{
            background: colorBgContainer,
            borderBottom: `1px solid ${colorBorderSecondary}`,
            paddingLeft: 32,
            paddingRight: 32,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Space>
            <Link href={`/`} style={{ display: "flex", alignItems: "center" }}>
              <div className="flex items-center pr-3">
                <Image
                  src={getPublicR2Url(institution?.logo) || undefined}
                  alt="Logo"
                  width="auto"
                  height={36}
                  preview={false}
                />
              </div>
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                {institution?.acronym}
              </Typography.Title>
            </Link>
            <Divider orientation="vertical" />
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Apps
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <LanguageSwitcher />
            <SupportDrawer />
            <AppsButton />
            <UserProfileButton />
          </Space>
        </Layout.Header>
        <Layout.Content
          style={{
            //  background: colorBgContainer,
            overflowY: "auto",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <div className="pt-6 pb-10 px-4 sm:px-6 lg:px-8">
            <header className="mb-8 ">
              <Card>
                <Typography.Title level={3}>
                  {getGreeting()} {user?.first_name || "User"} 👋
                </Typography.Title>

                <Typography.Text
                  type="secondary"
                  className="mt-2 text-sm text-gray-600"
                >
                  D&apos;après vos rôles, voici les applications auxquelles vous
                  avez accès.
                </Typography.Text>

                <div>
                  <Space wrap>
                    <Typography.Text>Roles: </Typography.Text>
                    {user?.is_superuser && (
                      <Tag
                        key="admin"
                        bordered={false}
                        style={{ borderRadius: 10 }}
                        icon={<CrownOutlined />}
                        color="red"
                      >
                        Super admin
                      </Tag>
                    )}
                    {user?.is_staff && (
                      <Tag
                        key="staff"
                        bordered={false}
                        style={{ borderRadius: 10 }}
                        icon={<UserOutlined />}
                        color="blue"
                      >
                        Staff
                      </Tag>
                    )}
                    {user?.is_student && (
                      <Tag
                        key="student"
                        bordered={false}
                        style={{ borderRadius: 10 }}
                        icon={<CheckOutlined />}
                        color="blue"
                      >
                        Étudiant
                      </Tag>
                    )}

                    {user?.roles.map((r) => (
                      <Tag
                        key={r.id}
                        bordered={false}
                        style={{ borderRadius: 10 }}
                        icon={<CheckOutlined />}
                        color="success"
                      >
                        {getRoleName(r.name)}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </Card>
            </header>

            <section aria-labelledby="apps-heading">
              <h2 id="apps-heading" className="sr-only">
                Applications disponibles
              </h2>
              {apps.length === 0 ? (
                <Card className="">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Aucune application disponible pour votre profil."
                  />
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {apps.map((app) => (
                    <Link key={app.id} href={app.href} className="group">
                      <Card>
                        <article className="relative h-full flex flex-col">
                          <div className="flex items-start justify-between gap-4 ">
                            <Avatar
                              icon={app.icon}
                              size={48}
                              shape="square"
                              style={{ background: app.color }}
                            />
                            {/* <div
                                className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-lg ${app.color} bg-opacity-100`}
                              >
                                {app.icon}
                              </div> */}
                            <div className=" ml-3 flex-1 min-w-0 ">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {app.name}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {app.description}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3">
                            <div className="flex flex-wrap gap-2">
                              {/* {app.roles.map((role) => (
                              <span
                                key={role}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                              >
                                {roleLabel(role)}
                              </span>
                            ))} */}
                            </div>

                            <Button
                              color="primary"
                              variant="dashed"
                              className="group-hover:underline"
                              style={{ boxShadow: "none" }}
                            >
                              Ouvrir →
                            </Button>
                          </div>

                          {/* subtle focus ring for keyboard users */}
                          <span className="absolute inset-0 rounded-xl ring-0 focus-within:ring-2 focus-within:ring-indigo-400" />
                        </article>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>
            <div className="flex mt-7 md:mt-16 justify-between items-center">
              <Typography.Text type="secondary">
                © {new Date().getFullYear()} {institution?.acronym}. Tous droits
                réservés.
              </Typography.Text>
              <Palette />
            </div>
          </div>
        </Layout.Content>
      </Layout>
    </main>
  );
};
