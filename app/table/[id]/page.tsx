"use client";

import { useMutation, useQuery } from "@apollo/client";
import { getProducts } from "@/gql/products";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  addBulkCustomerVisit,
  addBulkCustomerVisitProducts,
} from "@/gql/visits";
import { Router } from "next/router";
import ProductPicker from "@/components/ProductPicker";

interface Props {
  params: {
    id: number;
  };
}

interface IOrder {
  [key: number]: {
    [key: number]: number;
  };
}

export default function Page({ params }: Props) {
  const router = useRouter();
  const { data, loading } = useQuery(getProducts, {
    variables: { id: params.id },
  });

  const [
    addBulkCustomerVisits,
    {
      data: addedCustomerVisits,
      error: addedCustomerVisitsError,
      loading: addedCustomerVisitsLoading,
    },
  ] = useMutation(addBulkCustomerVisit);
  const [addBulkCustomerProducts] = useMutation(addBulkCustomerVisitProducts);

  const [addedProducts, setAddedProducts] = useState<IOrder>({});
  const [selectedCustomer, setSelectedCustomer] = useState<number>(1);

  useEffect(() => {
    if (data) {
      const obj: IOrder = {};
      // this could use some work
      for (let i = 1; i <= data.tables_table_by_pk.capacity; i++) {
        obj[i] = {};
      }
      setAddedProducts(obj);
    }
  }, [data]);

  useEffect(() => {
    const modeledData = Object.assign({}, addedProducts);

    // for each not empty object in added products
    Object.keys(addedProducts).forEach(
      (value: string, index: number, array: string[]) => {
        if (Object.keys(addedProducts[parseInt(value)]).length === 0) {
          delete modeledData[parseInt(value)];
        }
      }
    );
    if (addedCustomerVisits && !addedCustomerVisitsLoading) {
      const addedCustomers =
        addedCustomerVisits.insert_visits_customervisit.returning.map(
          (customerVisit: CustomerVisit) => customerVisit.customer
        );

      const customersWithProducts = addedCustomers.filter(
        (customer: number) => {
          return Object.keys(modeledData).includes(customer.toString());
        }
      );

      const customerProducts: NewCustomerVisitProduct[] = [];

      customersWithProducts.forEach((customer: number) => {
        const products = modeledData[customer];
        return Object.keys(products).map((product: string) => {
          return Array.from({
            length: products[parseInt(product)],
          }).map(() => {
            const customer_visit: number =
              addedCustomerVisits.insert_visits_customervisit.returning.find(
                (res: CustomerVisit) => res.customer === customer
              ).id;
            customerProducts.push({
              customer_visit_id: customer_visit,
              product_id: parseInt(product),
            });
          });
        });
      });
      addBulkCustomerProducts({
        variables: {
          objects: customerProducts,
        },
      }).then(() => {
        router.push(`/table/${params.id}/pay`);
      });
    }
  }, [addedCustomerVisits, addedCustomerVisitsLoading]);

  const handleAddProduct = (productId: number) => {
    setAddedProducts((prev) => ({
      ...prev,
      [selectedCustomer]: {
        ...prev[selectedCustomer],
        [productId]:
          prev[selectedCustomer] && prev[selectedCustomer][productId]
            ? prev[selectedCustomer][productId] + 1
            : 1,
      },
    }));
  };

  const handleRemoveProduct = (productId: number) => {
    setAddedProducts((prev) => {
      const newProducts = { ...prev };
      newProducts[selectedCustomer][productId] -= 1;
      if (newProducts[selectedCustomer][productId] === 0) {
        delete newProducts[selectedCustomer][productId];
      }
      return newProducts;
    });
  };

  const onSubmit = async () => {
    const modeledData = Object.assign({}, addedProducts);

    // for each not empty object in added products
    Object.keys(addedProducts).forEach(
      (value: string, index: number, array: string[]) => {
        if (Object.keys(addedProducts[parseInt(value)]).length === 0) {
          delete modeledData[parseInt(value)];
        }
      }
    );

    const bulkData = Object.keys(modeledData).map((value: string) => {
      return {
        visit_id: data.tables_table_by_pk.visits_visits[0].id,
        customer: parseInt(value),
      };
    });
    await addBulkCustomerVisits({
      variables: {
        objects: bulkData,
      },
    });
    if (addedCustomerVisitsError) {
      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="mb-6 max-w-2xl font-light text-gray-500 md:text-lg lg:mb-8 lg:text-xl">
        Select the customers and their orders
      </p>
      {loading && <p className="col-span-3">Loading...</p>}
      <div className="flex flex-row flex-wrap gap-8">
        {data &&
          Array.from(
            { length: data.tables_table_by_pk.capacity },
            (_, i) => i + 1
          ).map((number: number) => (
            <button
              key={number}
              value={number}
              type="button"
              onClick={() => setSelectedCustomer(number)}
              className={`rounded border p-3 text-center hover:border-blue-700 ${
                selectedCustomer === number && "border-blue-700"
              }`}
            >
              <h3 className="text-xl font-bold">{number}</h3>
            </button>
          ))}
      </div>

      <div className="flex flex-col items-center justify-center">
        <p className="mb-6 max-w-2xl font-light text-gray-500  md:text-lg lg:mb-8 lg:text-xl">
          Products
        </p>
        <div className="grid grid-cols-2 gap-8">
          {data &&
            data.products_product.map((product: Product) => (
              <ProductPicker
                product={product}
                key={product.id}
                quantity={
                  (data &&
                    addedProducts[selectedCustomer] &&
                    addedProducts[selectedCustomer][product.id]) ||
                  0
                }
                disableDecrease={
                  !addedProducts[selectedCustomer] ||
                  !addedProducts[selectedCustomer][product.id]
                }
                handleAddProduct={handleAddProduct}
                handleRemoveProduct={handleRemoveProduct}
              />
            ))}
        </div>
      </div>
      <button
        onClick={onSubmit}
        className="delay-50 min-w-32 min-h-12 inline-flex h-full items-center justify-center rounded-xl border border-blue-400 bg-blue-400 px-6 py-2.5 text-center text-lg text-white transition-colors hover:enabled:bg-blue-700"
      >
        Take order
      </button>
    </div>
  );
}
