"use client";

import { NewYearForm } from "@/app/console/years/forms/new";
import { useYid } from "@/hooks/useYid";
import {
  getYears,
  getYearsAsOptions,
  getYearStatusColor,
  getYearStatusName,
} from "@/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Form,
  Modal,
  Radio,
  Select,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";

type FormDataType = {
  yid: number;
};

export function YearSelector() {
  const [form] = Form.useForm();
  const { yid, setYid } = useYid();
  const { data: years, isPending } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
  });

  const onFinish = (values: FormDataType) => {
    setYid(values.yid);
    window.location.reload();
  };

  return (
    <>
      <Modal
        open={!isPending && yid ? false : true}
        loading={isPending}
        title={
          !isPending ? (
            <header style={{ display: "flex", alignItems: "center" }}>
              <Space>
                <Typography.Title level={2} style={{ marginBottom: 0 }}>
                  Année
                </Typography.Title>
              </Space>
              <div className="flex-1" />{" "}
              <Space>
                <NewYearForm buttonType="link" />
              </Space>
            </header>
          ) : (
            <Skeleton.Input block size="small" />
          )
        }
        centered
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          loading: isPending,
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
        destroyOnClose
        closable={false}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="select_year_id_as_yid"
            layout="vertical"
            form={form}
            name="select_year_id_as_id"
            onFinish={onFinish}
          >
            {dom}
          </Form>
        )}
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
            options={years?.map((year) => ({
              value: year.id,
              label: (
                <Space>
                  <Typography.Title level={5} style={{ marginBottom: 0 }}>
                    {year.name}
                  </Typography.Title>
                  <Tag
                    color={getYearStatusColor(year.status)}
                    style={{ border: 0 }}
                  >
                    {getYearStatusName(year.status)}
                  </Tag>
                </Space>
              ),
            }))}
          />
        </Form.Item>
      </Modal>
      {!isPending ? (
        <Select
          value={yid}
          variant="filled"
          options={getYearsAsOptions(years)}
          style={{ width: 108 }}
          onSelect={(value) => {
            setYid(value);
            window.location.reload();
          }}
        />
      ) : (
        <Form>
          <Skeleton.Input size="default" block />
        </Form>
      )}
    </>
  );
}
