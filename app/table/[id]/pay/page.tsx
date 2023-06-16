"use client";

import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";

import {
  addBulkCustomerVisit,
  finishVisit,
  getVisitSummary,
} from "@/gql/visits";
import { BaseSyntheticEvent, useEffect, useState } from "react";

interface Props {
  params: {
    id: number;
  };
}

interface IDiscountPerCustomer {
  [key: number]: number;
}

export default function Page({ params }: Props) {
  const router = useRouter();
  const { data, loading } = useQuery(getVisitSummary, {
    variables: { table_id: params.id },
  });
  const [mutate, { error: finishVisitError }] = useMutation(finishVisit);

  const [tipPerCustomer, setTipPerCustomer] = useState<IDiscountPerCustomer>(
    {}
  );

  useEffect(() => {
    if (data) {
      const customers = data.visits_customervisit.map(
        (customerVisit: CustomerVisit) => ({
          [customerVisit.customer]: 10,
        })
      );
      setTipPerCustomer(Object.assign({}, ...customers));
    }
  }, [data]);

  const handleSetTipPerCustomer = (e: BaseSyntheticEvent, customer: number) => {
    setTipPerCustomer((prev) => ({
      ...prev,
      [customer]: parseInt(e.target.value),
    }));
  };

  const finalizeVisit = async () => {
    await mutate({
      variables: {
        table_id: params.id,
        visit_id: data.visits_customervisit[0].visit_id,
      },
    });
    if (!finishVisitError) {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {loading && <p className="col-span-3">Loading...</p>}

      <div className="grid grid-cols-2 gap-4">
        {data &&
          data.visits_customervisit.map((customerVisit: CustomerVisit) => (
            <div className="col-span-2 md:col-span-1 flex flex-col gap-3 rounded border p-4">
              <span className="font-bold text-lg">
                Customer {customerVisit.customer}
              </span>
              <div className="flex flex-col gap-1">
                {customerVisit.visits_customervisitproducts.map(
                  (customerVisitProduct: CustomerVisitProduct) => (
                    <div className="flex flex-row flex-wrap gap-1">
                      <span>{customerVisitProduct.products_product.name}</span>
                      <span>{`\$${customerVisitProduct.products_product.price}`}</span>
                    </div>
                  )
                )}
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-row flex-wrap gap-2 items-center">
                    <span>Tip of</span>
                    <select
                      onChange={(e) =>
                        handleSetTipPerCustomer(e, customerVisit.customer)
                      }
                      className="border rounded p-1"
                      value={tipPerCustomer[customerVisit.customer]}
                    >
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={10}>10%</option>
                      <option value={15}>15%</option>
                    </select>
                  </div>
                  <div className="flex flex-row flex-wrap gap-1">
                    <span>Total</span>
                    <span>
                      {`\$${
                        customerVisit.visits_customervisitproducts.reduce(
                          (acc: number, curr: CustomerVisitProduct) =>
                            acc + curr.products_product.price,
                          0
                        ) *
                        (1 + tipPerCustomer[customerVisit.customer] / 100)
                      }`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="py-4">
        <button
          onClick={finalizeVisit}
          className="delay-50 min-w-32 min-h-12 inline-flex h-full items-center justify-center rounded-xl border border-blue-400 bg-blue-400 px-6 py-2.5 text-center text-lg text-white transition-colors hover:enabled:bg-blue-700"
        >
          Finish Visit
        </button>
      </div>
    </div>
  );
}
