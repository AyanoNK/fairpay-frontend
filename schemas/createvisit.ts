import * as yup from "yup";

export const createVisitSchema = yup
  .object({
    waiter: yup.number().positive().integer().required(),
  })
  .required();
