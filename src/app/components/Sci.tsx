import React from "react";
import "./sci.css";
import { scis } from "@/data/data";
import Link from "next/link";

export default function Sci() {
  return (
    <>
      {scis.map((sci) => (
        <Link href={sci.link} key={sci.id} target="_blank" className="mx-2">
          <span className={sci.icon}></span>
        </Link>
      ))}
    </>
  );
}
