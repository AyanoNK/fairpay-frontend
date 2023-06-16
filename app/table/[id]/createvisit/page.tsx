"use client";

import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { gql, useMutation, useQuery } from "@apollo/client";

import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { makeTableBusy } from "@/gql/tables";
import { getWaiters } from "@/gql/waiters";
import { createVisitSchema } from "@/schemas/createvisit";

interface Props {
  params: {
    id: number;
  };
}

interface IFormInput {
  waiter: number;
}

export default function Page({ params }: Props) {
  const router = useRouter();
  const { data, loading } = useQuery(getWaiters);
  const [mutate] = useMutation(makeTableBusy);

  const { register, handleSubmit, setValue, watch } = useForm<IFormInput>({
    resolver: yupResolver(createVisitSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (myData: IFormInput) => {
    await mutate({
      variables: {
        table_id: params.id,
        waiter_id: myData.waiter,
      },
    });

    router.push(`/table/${params.id}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <div className="flex flex-col items-center py-8">
          <p className="mb-6 max-w-2xl font-light text-gray-500 md:text-lg lg:mb-8 lg:text-xl">
            Who will be the managing waiter?
          </p>
          {loading && <p className="col-span-3">Loading...</p>}

          <div className="justify-center space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
            {data &&
              data.waiters_waiter.map((waiter: Waiter) => (
                <button
                  key={waiter.name}
                  value={waiter.id}
                  type="button"
                  onClick={() => setValue("waiter", waiter.id)}
                  className={`flex flex-col items-center justify-center rounded border p-3  text-center hover:border-blue-700
                  ${watch("waiter") === waiter.id && "border-blue-700"}
                `}
                >
                  <h3 className="text-xl font-bold ">{waiter.name}</h3>
                </button>
              ))}
          </div>
        </div>
        <button
          type="submit"
          className="delay-50 min-w-32 min-h-12 inline-flex h-full items-center justify-center rounded-xl border border-blue-400 bg-blue-400 px-6 py-2.5 text-center text-lg text-white transition-colors hover:enabled:bg-blue-700"
        >
          {`Start serving at table ${params.id}`}
        </button>
      </form>
    </div>
  );
}
