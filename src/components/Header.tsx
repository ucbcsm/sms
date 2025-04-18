"use client";

import { Avatar, Select, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Image from "next/image";
import React from "react";

const { Option } = Select;

export default function Header() {
  const profileItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div>
          <p className="font-semibold">Kavira Kas</p>
          <p className="text-xs text-gray-500">Matricule : UCBC20230001</p>
          <p className="text-xs text-gray-500">Email : kaskavira@ucbc.cd</p>
          <p className="text-xs text-gray-500">Statut : Étudiant actif</p>
          <p className="text-xs text-gray-500">Département : Génie Informatique</p>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <button className="text-red-600 font-medium w-full text-left">
          Se déconnecter
        </button>
      ),
    },
  ];

  return (
    <header className="bg-[#008367] text-white px-6 py-4 flex flex-wrap items-center shadow gap-4">
      {/* Logo UCBC */}
      <div className="flex items-center gap-4">
        <Image src="/logo-ucbc.png" alt="UCBC Logo" width={40} height={40} />
        <h1 className="text-2xl font-bold">SMS-UCBC</h1>
      </div>

      {/* Infos académiques */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-white ml-8">
        <div>
          <label className="text-xs block mb-1">Année académique</label>
          <Select defaultValue="2024-2025" style={{ width: 130 }} dropdownStyle={{ zIndex: 9999 }}>
            <Option value="2022-2023">2022-2023</Option>
            <Option value="2023-2024">2023-2024</Option>
            <Option value="2024-2025">2024-2025</Option>
            <Option value="2025-2026">2025-2026</Option>
          </Select>
        </div>

        <div>
          <label className="text-xs block mb-1">Cycle</label>
          <div className="font-medium">Licence</div>
        </div>

        <div>
          <label className="text-xs block mb-1">Faculté</label>
          <div className="font-medium">Sciences & Technologies</div>
        </div>

        <div>
          <label className="text-xs block mb-1">Département</label>
          <div className="font-medium">Génie Informatique</div>
        </div>

        <div>
          <label className="text-xs block mb-1">Promotion</label>
          <Select defaultValue="L2" style={{ width: 80 }} dropdownStyle={{ zIndex: 9999 }}>
            <Option value="L0">L0</Option>
            <Option value="L1">L1</Option>
            <Option value="L2">L2</Option>
            <Option value="L3">L3</Option>
            <Option value="L4">L4</Option>
          </Select>
        </div>
      </div>

      {/* Profil étudiant complètement à droite */}
      <div className="ml-auto flex items-center gap-2">
        <Dropdown menu={{ items: profileItems }} placement="bottomRight" arrow>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar src="/student-photo.avif" size="large" />
            <div className="text-right leading-tight">
              <p className="text-sm font-medium">
                Kavira Kas <DownOutlined className="ml-1 text-xs" />
              </p>
              <p className="text-xs">Matricule : UCBC20230001</p>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}