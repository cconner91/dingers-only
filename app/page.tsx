"use client";

import { useState } from "react";
import AddParlay from "@/components/AddParlay";
import Tracker from "@/components/Tracker";
import TopNav from "@/components/TopNav";

export default function Home() {
  const [refresh, setRefresh] = useState(0);

  return (
    <>
      <TopNav />

      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">
          Dingers Only ⚾
        </h1>

        <AddParlay onAdd={() => setRefresh(refresh + 1)} />

        <Tracker key={refresh} />
      </div>
    </>
  );
}