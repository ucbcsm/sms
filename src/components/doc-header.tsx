"use client";

import { useInstitution } from "@/hooks/use-institution";
import { Image, Typography } from "antd";
import { FC } from "react";

export const DocHeader: FC = () => {
  const { data } = useInstitution();
  return (
    <div className="flex gap-20 justify-between items-center pb-8 border-b-2 border-[#008367] mb-8 ">
      <div className="flex flex-1 gap-7 items-center">
        <Image
          src={data?.logo || "/ucbc-logo.png"}
          alt="logo"
          height={128}
          width="auto"
        />
        <div className="flex-1">
          <Typography.Title
            level={3}
            style={{
              color: "#ED6851",
              textTransform: "uppercase",
              marginTop: 0,
            }}
          >
            {data?.name || "Nom de l'institution"}
          </Typography.Title>
          <p className=" uppercase text-[#008367]">{data?.motto || ""}</p>
        </div>
      </div>

      <div className="flex items-stretch">
        <div className="w-1 mr-6 flex flex-col">
          <div className="flex-1 bg-[#3aa890]" />
          <div className="flex-1 bg-[#ED6851]" />
          <div className="flex-1 bg-[#FCB34C]" />
        </div>
        <div className="flex flex-col">
          <Typography.Text>
            {data?.phone_number_1 || "Téléphone"}
          </Typography.Text>
          <Typography.Text>{data?.email_address || "Email"}</Typography.Text>
          <Typography.Text>{data?.web_site || "Site web"}</Typography.Text>
          <Typography.Text>{data?.address || "Adresse"}</Typography.Text>
        </div>
      </div>
    </div>
  );
};
