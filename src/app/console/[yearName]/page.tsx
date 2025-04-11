'use client'

import { useParams, useSearchParams } from "next/navigation"

export default function Page(){
    const params=useParams()
    const searchParams=useSearchParams()
    return <div>
      {params.yearName}
      {searchParams.get("search")}
    </div>
}