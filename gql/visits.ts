import { gql } from "@apollo/client";

export const getVisitSummary = gql`
  query getVisitSummary($table_id: bigint = "") {
    visits_customervisit(
      where: {
        visits_visit: {
          table_id: { _eq: $table_id }
          status: { _eq: "started" }
        }
      }
    ) {
      visits_customervisitproducts {
        products_product {
          id
          price
          name
        }
      }
      id
      customer
      visit_id
    }
  }
`;

export const addBulkCustomerVisit = gql`
  mutation addBulkCustomerVisit(
    $objects: [visits_customervisit_insert_input!] = {}
  ) {
    insert_visits_customervisit(objects: $objects) {
      returning {
        id
        customer
      }
    }
  }
`;

export const addBulkCustomerVisitProducts = gql`
  mutation addBulkCustomerVisitProducts(
    $objects: [visits_customervisitproduct_insert_input!] = []
  ) {
    insert_visits_customervisitproduct(objects: $objects) {
      affected_rows
    }
  }
`;

export const finishVisit = gql`
  mutation finishVisit($table_id: bigint = "", $visit_id: bigint = "") {
    update_tables_table_by_pk(
      pk_columns: { id: $table_id }
      _set: { status: "available" }
    ) {
      id
      status
    }
    update_visits_visit_by_pk(
      pk_columns: { id: $visit_id }
      _set: { status: "finished" }
    ) {
      status
      id
    }
  }
`;
