'use client';

import { Button } from "antd";
import Link from "next/link";

export const AppsButton = () => {
    const appsIcon = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
        >
            <g fill="currentColor">
                <circle cx="6" cy="6" r="2" />
                <circle cx="12" cy="6" r="2" />
                <circle cx="18" cy="6" r="2" />
                <circle cx="6" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="18" cy="12" r="2" />
                <circle cx="6" cy="18" r="2" />
                <circle cx="12" cy="18" r="2" />
                <circle cx="18" cy="18" r="2" />
            </g>
        </svg>
    );

    return (
      <Link href="/">
        <Button
        //   icon={appsIcon}
          type="text"
          title="Applications"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          {appsIcon}
        </Button>
      </Link>
    );
}