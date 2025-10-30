'use client'

import { Teacher } from "@/types"
import { Alert, Typography } from "antd"
import { FC } from "react"

type SecretarySignaturePlaceholderProps = {
  data?:Teacher[]
}

export const SecretarySignaturePlaceholder:FC<SecretarySignaturePlaceholderProps> = ({data}) => {
    return (
      <div className="">
        {data?.length === 1 ? (
          <div className="flex flex-col items-center">
            <Typography.Text
              strong
              underline
            >{`${data?.[0].user.surname} ${data?.[0].user.last_name}{" "}
                            ${data?.[0].user.first_name}
                            `}</Typography.Text>
            <Typography.Text>{data?.[0].academic_title}</Typography.Text>
          </div>
        ) : (
          <Alert
            message="Signature indisponible"
            description={
              data?.length === 0 ? (
                "Aucun secrétaire général académique n'est défini dans le système. Veuillez contacter l'administration pour résoudre ce problème."
              ) : (
                <div>
                  Plusieurs secrétaires généraux académique sont définis dans le
                  système (
                  {data?.map((teacher) => (
                    <Typography.Text strong>
                      {teacher.user.surname} {teacher.user.last_name}
                    </Typography.Text>
                  ))}
                  ). Veuillez contacter l&apos;administration pour résoudre ce
                  problème.
                </div>
              )
            }
            type="warning"
            showIcon
            style={{ border: 0 }}
          />
        )}
      </div>
    );
}