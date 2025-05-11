import { Flex, Skeleton, Space } from "antd";
import { FC } from "react";

type DataFetchPendingSkeletonProps = {
  variant?: "default" | "table";
  size?: "default" | "small" | "large";
};

export const DataFetchPendingSkeleton: FC<DataFetchPendingSkeletonProps> = ({
  variant = "default",
  size = "default",
}) => {
  if (variant === "table") {
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 16,
            marginTop: 8,
          }}
        >
          <Space>
            <Skeleton.Input size={size} />
          </Space>
          <div className="flex-1" />
          <Space>
            <Skeleton.Button size={size} />
            <Skeleton.Button size={size} />
            <Skeleton.Button size={size} />
          </Space>
        </div>
        <Flex vertical gap="middle">
          <Skeleton.Input block size={size} />
          <Skeleton.Input block size={size} />
          <Skeleton.Input block size={size} />
          <Skeleton.Input block size={size} />
        </Flex>
      </>
    );
  }

  return (
    <Flex vertical gap="middle">
      <Skeleton.Input block size={size} />
      <Skeleton.Input block size={size} />
      <Skeleton.Input block size={size} />
      <Skeleton.Input block size={size} />
    </Flex>
  );
};
