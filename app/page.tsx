"use client";

import Link from "next/link";

import { gql, useQuery } from "@apollo/client";
import { Suspense, useCallback } from "react";
import Table from "@/components/Table";
import { getTables } from "@/gql/tables";

export default function Home() {
  const { data, loading } = useQuery(getTables);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="mx-auto grid max-w-screen-xl text-center ">
        <p className="mb-6 max-w-2xl font-light text-gray-500 md:text-lg lg:mb-8 lg:text-xl">
          Manage your tables and orders with ease.
        </p>
      </div>
      <section>
        <div className="justify-center grid grid-cols-3 gap-8">
          {loading && <p className="col-span-3">Loading...</p>}
          {data &&
            data.tables_table.map((table: Table) => (
              <Table key={table.alias} table={table} />
            ))}
        </div>
      </section>
    </div>
  );
}
