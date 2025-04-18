"use client";

import { Card } from "antd";

export function CoursesCountWidget() {
  return (
    <Card
      variant="borderless"
      className="bg-gradient-to-br from-white via-[#f2fdfb] to-[#e1f8f1] rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6"
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Nombre de cours
        </h3>
        <p className="text-5xl font-extrabold text-[#008367]">12</p>
        <span className="text-sm text-gray-500">
          Cours enregistrés pour cette année académique
        </span>
        <div className="mt-2 w-full h-1 bg-[#008367]/20 rounded-full">
          <div className="h-full w-3/4 bg-[#008367] rounded-full transition-all duration-500"></div>
        </div>
      </div>
    </Card>
  );
}