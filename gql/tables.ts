import { gql } from "@apollo/client";

export const getTables = gql`
  query getTables {
    tables_table(order_by: { id: asc }) {
      alias
      status
      capacity
      id
    }
  }
`;

export const makeTableBusy = gql`
  mutation MakeTableBusyMutation(
    $table_id: bigint = ""
    $waiter_id: bigint = ""
  ) {
    update_tables_table(
      where: { id: { _eq: $table_id } }
      _set: { status: "busy" }
    ) {
      returning {
        id
        alias
        status
      }
      affected_rows
    }
    insert_visits_visit(
      objects: { table_id: $table_id, waiter_id: $waiter_id }
    ) {
      affected_rows
      returning {
        id
        status
        table_id
        waiter_id
      }
    }
  }
`;
