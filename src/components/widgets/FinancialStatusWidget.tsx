"use client";

import { Card } from "antd";

export function FinancialStatusWidget() {
  return (
    <Card
      variant="borderless"
      className="bg-gradient-to-br from-white via-[#fdf6f2] to-[#fdeee4] rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6"
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Statut financier
        </h3>
        <p className="text-4xl font-extrabold text-[#cc5200]">
          200 USD
        </p>
        <span className="text-sm text-gray-500">
          Solde disponible
        </span>
        <div className="mt-2 w-full h-1 bg-[#cc5200]/20 rounded-full">
          <div className="h-full w-2/3 bg-[#cc5200] rounded-full transition-all duration-500"></div>
        </div>
      </div>
    </Card>
  );
}
