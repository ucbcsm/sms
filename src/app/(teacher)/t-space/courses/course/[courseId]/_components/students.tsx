'use client'

import { getHSLColor, getPublicR2Url } from "@/lib/utils"
import { CourseEnrollment } from "@/types"
import { Avatar, List } from "antd"
import { FC } from "react"

type TeacherStudentsListProps={
    students?:CourseEnrollment[]
}
export const TeacherStudentsList:FC<TeacherStudentsListProps>=({students})=>{
    
    return (
      <List
        
        dataSource={students}
        renderItem={(student) => (
          <List.Item key={student.id}>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={getPublicR2Url(
                    student.student.year_enrollment.user.avatar
                  )}
                  style={{
                    backgroundColor: getHSLColor(
                      `${student.student.year_enrollment.user.surname} ${student.student.year_enrollment.user.last_name} ${student.student.year_enrollment.user.first_name}`
                    ),
                  }}
                >
                  {student.student.year_enrollment.user.first_name
                    ?.charAt(0)
                    .toUpperCase()}
                </Avatar>
              }
              title={`${student.student.year_enrollment.user.surname} ${student.student.year_enrollment.user.last_name} ${student.student.year_enrollment.user.first_name} (${student.student.year_enrollment.user.matricule})`}
              description={`${student.student.year_enrollment.class_year.acronym} ${student.student.year_enrollment.departement.name}`}
            />
          </List.Item>
        )}
      />
    );
}