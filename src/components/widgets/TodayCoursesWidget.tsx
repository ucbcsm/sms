"use client";

import { Card } from "antd";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";

const coursesByDay = [
  {
    date: new Date(),
    courses: [
      {
        time: "9h00",
        title: "Algorithmique",
        location: "Salle A1",
        teacher: "Prof. Jean",
      },
      {
        time: "14h00",
        title: "Mathématiques",
        location: "Salle B2",
        teacher: "Prof. Léa",
      },
    ],
  },
  {
    date: addDays(new Date(), 1),
    courses: [
      {
        time: "8h00",
        title: "Systèmes d’exploitation",
        location: "Salle C3",
        teacher: "Prof. Albert",
      },
    ],
  },
  {
    date: addDays(new Date(), 2),
    courses: [
      {
        time: "11h00",
        title: "Programmation web",
        location: "Salle A2",
        teacher: "Prof. Marie",
      },
      {
        time: "15h00",
        title: "Base de données",
        location: "Salle B1",
        teacher: "Prof. David",
      },
    ],
  },
];

export function TodayCoursesWidget() {
  return (
    <Card
      bordered={false}
      className="border border-gray-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6"
    >
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Calendrier des cours
        </h3>

        {coursesByDay.map((day, index) => (
          <div key={index} className="space-y-2">
            <div className="text-sm font-semibold text-blue-600">
              {format(day.date, "EEEE dd MMMM yyyy", { locale: fr })}
            </div>

            <div className="space-y-3">
              {day.courses.map((course, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 hover:shadow transition"
                >
                  <div className="flex justify-between text-sm mb-1 text-blue-700 font-medium">
                    <span>{course.time}</span>
                    <span>{course.location}</span>
                  </div>
                  <div className="text-gray-800 font-semibold text-sm md:text-base">
                    {course.title}
                  </div>
                  <div className="text-gray-600 italic text-xs md:text-sm">
                    {course.teacher}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}