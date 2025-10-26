"use client";

import { useYid } from "@/hooks/use-yid";
import {
  getAppeals,
  getFacultiesAAsOptionsWithAcronym,
} from "@/lib/api";
import { filterOption } from "@/lib/utils";
import {
  AppstoreOutlined,
  CloseOutlined,
  FileTextOutlined,
  FontSizeOutlined,
  FormOutlined,
  MailOutlined,
  MenuOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Divider,
  Dropdown,
  Form,
  Image,
  Layout,
  Menu,
  Select,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";
import { ListLetterGradings } from "./[facultyId]/letter-gradings/_components/list-letter-gradings";
import { useJury } from "@/hooks/useJury";
import { UserProfileButton } from "@/components/userProfileButton";
import { AppsButton } from "@/components/appsButton";
import { useInstitution } from "@/hooks/use-institution";
import { SupportDrawer } from "@/components/support-drawer";
import { LanguageSwitcher } from "@/components/languageSwitcher";

export default function FacultyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { juryId, facultyId } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [openLetterGrading, setOpenLetterGrading] = useQueryState(
    "letter_gradings",
    parseAsBoolean.withDefault(false)
  );
  const {data:institution}=useInstitution();

  const { yid } = useYid();

  const { data: jury, isPending } = useJury(Number(juryId));

  const {
    data: appealsData,
    isPending: isPendingAppeals,
    isError: isErrorAppeals,
  } = useQuery({
    queryKey: ["appeals", yid, juryId, facultyId, "submitted"],
    queryFn: ({ queryKey }) =>
      getAppeals({
        yearId: Number(yid),
        juryId: Number(queryKey[1]),
        facultyId: Number(queryKey[2]),
        status: "submitted",
      }),
    enabled: !!yid && !!juryId && !!facultyId,
  });

  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          // borderBottom: `1px solid ${colorBorderSecondary}`,
          paddingLeft: 12,
          paddingRight: 12,
        }}
      >
        <Space>
          <Link
            href={`/jury/${juryId}`}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className="flex items-center pr-3">
              <Image
                src={institution?.logo || "/ucbc-logo.png"}
                alt="Logo"
                width={36}
                height="auto"
                preview={false}
              />
            </div>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              {institution?.acronym}
            </Typography.Title>
          </Link>
          <Divider type="vertical" />
          {!isPending ? (
            <Typography.Text type="secondary">{jury?.name}</Typography.Text>
          ) : (
            <Form>
              <Skeleton.Input size="small" active />
            </Form>
          )}
          {facultyId && <Divider type="vertical" />}
          {facultyId && (
            <Typography.Text type="secondary">Filière:</Typography.Text>
          )}

          {facultyId &&
            (!isPending ? (
              <Select
                value={Number(facultyId)}
                showSearch
                variant="filled"
                filterOption={filterOption}
                options={getFacultiesAAsOptionsWithAcronym(jury?.faculties)}
                // style={{ width: 128 }}
                loading={isPending}
                onSelect={(value) => {
                  router.push(`/jury/${juryId}/${value}/grade-entry`);
                }}
              />
            ) : (
              <Form>
                <Skeleton.Input size="small" active />
              </Form>
            ))}
        </Space>

        <div className="flex-1" />
        <Space>
          <Dropdown
            menu={{
              items: [
                {
                  key: "change-year",
                  label: "Changer l'année",
                  onClick: () => {
                    router.push("/jury");
                  },
                },
              ],
            }}
          >
            <Typography.Title
              level={5}
              type="secondary"
              style={{ marginBottom: 0 }}
            >
              {jury?.academic_year.name}
            </Typography.Title>
          </Dropdown>
          <LanguageSwitcher />
          <SupportDrawer />
          <AppsButton />
          <UserProfileButton />
          {/* <Button
            type="text"
            icon={<CloseOutlined />}
            title="Fermer"
            onClick={() => {
             
            }}
          /> */}
          {/* <LanguageSwitcher /> */}
        </Space>
      </Layout.Header>
      <Layout>
        <Layout.Content>
          <div
            style={{
              background: colorBgContainer,
              minHeight: 280,
              borderRadius: borderRadiusLG,
            }}
          >
            <div>
              <Menu
                disabled={isPending}
                mode="horizontal"
                theme="light"
                defaultSelectedKeys={[pathname]}
                selectedKeys={[pathname]}
                overflowedIndicator={<MenuOutlined />}
                items={[
                  {
                    key: `/jury/${juryId}`,
                    label: <Link href={`/jury/${juryId}`}>Aperçu</Link>,
                    icon: <AppstoreOutlined />,
                  },
                  {
                    key: `/jury/${juryId}/${facultyId}/grade-entry`,
                    label: (
                      <Link href={`/jury/${juryId}/${facultyId}/grade-entry`}>
                        Saisie des notes
                      </Link>
                    ),
                    icon: <FormOutlined />,
                    disabled: typeof facultyId === "undefined",
                  },
                  {
                    key: `/jury/${juryId}/${facultyId}/deliberations`,
                    label: (
                      <Link href={`/jury/${juryId}/${facultyId}/deliberations`}>
                        Publications
                      </Link>
                    ),
                    icon: <FileTextOutlined />,
                    disabled: typeof facultyId === "undefined",
                  },
                  {
                    key: `/jury/${juryId}/${facultyId}/appeals`,
                    label: (
                      <Badge
                        count={appealsData?.results?.length}
                        overflowCount={9}
                      >
                        <Link href={`/jury/${juryId}/${facultyId}/appeals`}>
                          Recours
                        </Link>
                      </Badge>
                    ),
                    icon: <MailOutlined />,
                    disabled: typeof facultyId === "undefined",
                  },
                  {
                    key: `/jury/${juryId}/${facultyId}/courses-to-retake`,
                    label: (
                      <Link
                        href={`/jury/${juryId}/${facultyId}/courses-to-retake`}
                      >
                        Cours à reprendre
                      </Link>
                    ),
                    icon: <RedoOutlined />,
                    disabled: typeof facultyId === "undefined",
                  },
                  {
                    key: `/jury/${juryId}/${facultyId}/letter-gradings`,
                    label: "Notation en lettres",
                    icon: <FontSizeOutlined />,
                  },
                ]}
                onClick={({ key }) => {
                  if (key === `/jury/${juryId}/${facultyId}/letter-gradings`) {
                    setOpenLetterGrading((prev) => !prev);
                  }
                }}
              />
              <ListLetterGradings
                open={openLetterGrading}
                setOpen={setOpenLetterGrading}
              />
            </div>
            {children}
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
