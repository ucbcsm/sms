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
            description="Soit aucun secrétaire général académique n'est défini, soit plusieurs sont définis. Veuillez contacter l'administration pour résoudre ce problème."
            type="warning"
            showIcon
            style={{border:0}}
          />
        )}
      </div>
    );
}