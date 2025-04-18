"use client";

import { Card } from "antd";

export function NotificationWidget() {

  return (
    <Card
      variant="borderless"
      className="bg-gradient-to-br from-white via-gray-100 to-indigo-50 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6"
    >
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">Notifications</h3>

        <span className="bg-indigo-100 text-indigo-700 font-semibold text-base px-4 py-1 rounded-full">nouvelles</span>
      </div>
    </Card>
  );
}