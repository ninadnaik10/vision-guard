"use client";
import { useAtom } from "jotai";
import React from "react";
import { usersAtom } from "@/atoms/UserAtom";

export default function Home() {
  const [user] = useAtom(usersAtom);

  return (
    <div className=" items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold">Hello, {user?.[0]?.name}</h1>
      <div className="">Welcome to the dashboard!</div>
    </div>
  );
}
