import { gql } from "@apollo/client";

export const getProducts = gql`
  query getProducts($id: bigint = "") {
    products_product(order_by: { id: asc }) {
      id
      name
      price
      description
    }
    tables_table_by_pk(id: $id) {
      alias
      capacity
      id
      visits_visits(
        where: { table_id: { _eq: $id }, status: { _eq: "started" } }
      ) {
        id
      }
    }
  }
`;
