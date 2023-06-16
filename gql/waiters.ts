import { gql } from "@apollo/client";

export const getWaiters = gql`
  query getWaiters {
    waiters_waiter {
      name
      id
    }
  }
`;
