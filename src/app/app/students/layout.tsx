"use client";

import { useYid } from "@/hooks/use-yid";
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
import { useQuery } from "@tanstack/react-query";
import { Flex, Layout, Splitter, Tag, theme, Typography } from "antd";
import { EnrollButton } from "./applications/enrollButton";
import { NewApplicationForm } from "./applications/forms/new/new";
import { ListNewApplications } from "./applications/lists/new_applications";
import { ListReApplications } from "./applications/lists/reapplications";
import { ReapplyForm } from "./applications/forms/reapply/reapply";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";
import { ViewEditApplicationForm } from "./applications/view";
import { useClasses } from "@/hooks/useClasses";
import { useFields } from "@/hooks/useFields";
import { useFaculties } from "@/hooks/useFaculties";
import { useDepartments } from "@/hooks/useDepartments";
import { useCycles } from "@/hooks/useCycles";

export default function StudentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, colorBgLayout },
  } = theme.useToken();
  const { yid } = useYid();
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

  const { data: cycles } = useCycles()

  const { data: faculties } = useFaculties()
  const { data: fields } = useFields() 
  const { data: departments } = useDepartments();
  const { data: classes } = useClasses() 

  return (
    <Splitter>
      <Splitter.Panel min={360} max={400} style={{background:colorBgContainer}}>
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
            Inscriptions
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
        <NewApplicationForm
          open={newApplication}
          setOpen={SetNewApplication}
          isFormer={false}
        />
        <NewApplicationForm
          open={newFormer}
          setOpen={SetNewFormer}
          isFormer={true}
        />
      </Splitter.Panel>

      <Splitter.Panel style={{ padding: "0 28px", background: colorBgLayout }}>
        {view > 0 && (
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
            isPendingApplication={isPendingApplication}
            isErrorApplication={isErrorApplication}
          />
        )}
        {view === 0 && children}
      </Splitter.Panel>
    </Splitter>
  );
}
