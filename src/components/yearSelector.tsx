"use client";

import { NewYearForm } from "@/app/console/years/forms/new";
import { useYid } from "@/hooks/use-yid";
import {
  getTeacherYears,
  getYears,
  getYearsAsOptions,
  getYearStatusColor,
  getYearStatusName,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Flex,
  Form,
  Image,
  Progress,
  Radio,
  Result,
  Select,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { Palette } from "./palette";
import { DataFetchErrorResult } from "./errorResult";
import { useSessionStore } from "@/store";
import { useInstitution } from "@/hooks/use-institution";
import { Year } from "@/types";
import { getPublicR2Url } from "@/lib/utils";
import Link from "next/link";
import { StopOutlined } from "@ant-design/icons";

const getRadioOptions = (years?: Year[]) => {
  return years?.map((year) => ({
    value: year.id,
    label: (
      <Space>
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          {year.name}
        </Typography.Title>
        <Tag color={getYearStatusColor(year.status)} style={{ border: 0 }}>
          {getYearStatusName(year.status)}
        </Tag>
      </Space>
    ),
  }));
};

type FormDataType = {
  yid: number;
};

type YearSelectorProps = {
  variant?: "default" | "student" | "teacher";
};

export function YearSelector({ variant = "default" }: YearSelectorProps) {
  const [form] = Form.useForm();
  const { yid, setYid } = useYid();
  const [percent, setPercent] = useState(-50);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const session = useSessionStore();
  const { data: institution } = useInstitution();

  const {
    data: years,
    isLoading:isPending,
    isError,
  } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
    enabled: !!(variant === "default"),
  });

  const {
    data: teacherYears,
    isLoading: isPendingTeacherYears,
    isError: isErrorTeacherYears,
  } = useQuery({
    queryKey: ["years", "teacher"],
    queryFn: getTeacherYears,
    enabled: !!(variant === "teacher"),
  });



  const onFinish = (values: FormDataType) => {
    setYid(values.yid);
    window.location.reload();
  };

  const checkYidInYears = () => {
    let exists: boolean | undefined = undefined;
    if(variant==="default"){
      exists = years?.some((y) => y.id === yid);
    }
    if(variant==="teacher"){
      exists = teacherYears?.some((y) => y.id === yid);
    }
    return typeof exists === "boolean" ? !exists : false;
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setPercent((prev) => {
        const nextPercent = prev + 5;
        return nextPercent > 150 ? 100 : nextPercent;
      });
    }, 200);
    return () => clearTimeout(timerRef.current!);
  }, [percent]);

  if (isError) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 99,
          height: "100vh",
          width: "100%",
        }}
      >
        <div style={{ width: 560, margin: "auto" }}>
          <DataFetchErrorResult />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className=""
        style={{
          display:
            isPending || isPendingTeacherYears || typeof yid === "undefined"
              ? "flex"
              : "none",
          flexDirection: "column",
          background: "#f5f5f5",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 99,
          height: "100vh",
          width: "100%",
        }}
      >
        {checkYidInYears() ? (
          <div style={{ width: 440, margin: "auto" }}>
            <Card>
              <Flex justify="space-between">
                <Typography.Title level={4}>Année</Typography.Title>
                {session.user?.is_superuser ? (
                  <NewYearForm buttonType="link" />
                ) : undefined}
              </Flex>
              <Form
                disabled={isPending || isPendingTeacherYears}
                key="select_year_id_as_yid"
                layout="vertical"
                form={form}
                name="select_year_id_as_id"
                onFinish={onFinish}
              >
                <Form.Item
                  name="yid"
                  // label="Année"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez sélectionner une année académique",
                    },
                  ]}
                >
                  <Radio.Group
                    style={{ display: "flex", flexDirection: "column" }}
                    options={getRadioOptions(
                      variant === "teacher" ? teacherYears : years
                    )}
                  />
                </Form.Item>
                <Flex justify="space-between" align="center">
                  <Palette />
                  <Form.Item noStyle>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ boxShadow: "none" }}
                      loading={isPending || isPendingTeacherYears}
                    >
                      OK
                    </Button>
                  </Form.Item>
                </Flex>
              </Form>
            </Card>
            <Typography.Text type="secondary">
              © {new Date().getFullYear()} {institution?.acronym}. Tous droits
              réservés.
            </Typography.Text>
          </div>
        ) : (
          <Flex
            vertical
            className=""
            style={{
              width: 340,
              margin: "auto",
              alignItems: "center",
            }}
          >
            <Image
              src={getPublicR2Url(institution?.logo) || undefined}
              alt="logo"
              height="auto"
              width={180}
              preview={false}
            />
            <Progress
              strokeColor={"#ED6851"}
              percent={percent}
              showInfo={false}
            />
            <Typography.Title type="secondary" level={3}>
              Academic Workspace
            </Typography.Title>
            <Typography.Text type="secondary">
              © {new Date().getFullYear()} {institution?.acronym}. Tous droits
              réservés.
            </Typography.Text>
          </Flex>
        )}
      </div>

      <div
        className=""
        style={{
          display: teacherYears && teacherYears.length === 0 ? "flex" : "none",
          flexDirection: "column",
          background: "#f5f5f5",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 99,
          height: "100vh",
          width: "100%",
          padding: 28,
        }}
      >
        <div style={{ maxWidth: 780, margin: "auto" }}>
          <Card loading={isPendingTeacherYears}>
            <Result
              title="Aucune année académique"
              subTitle="Bien que vous êtes staff, aucun cours ne vous est associé
                dans les années académiques du système comme enseignant."
              extra={
                <Link href={"/"}>
                  <Button
                    type="primary"
                    style={{ boxShadow: "none" }}
                  >
                    Consulter tes applications
                  </Button>
                </Link>
              }
              icon={<StopOutlined style={{color:"GrayText"}}/>}
            />
          </Card>
          <Typography.Text
            type="secondary"
            style={{ textAlign: "center", display: "block", marginTop: 28 }}
          >
            © {new Date().getFullYear()} {institution?.acronym}. Tous droits
            réservés.
          </Typography.Text>
        </div>
      </div>

      {!isPending || !isPendingTeacherYears ? (
        <Select
          value={yid}
          variant="outlined"
          options={getYearsAsOptions(
            variant === "teacher" ? teacherYears : years
          )}
          style={{ width: 108 }}
          onSelect={(value) => {
            setYid(value);
            window.location.reload();
          }}
        />
      ) : (
        <Form>
          <Skeleton.Input size="default" block active />
        </Form>
      )}
    </>
  );
}
