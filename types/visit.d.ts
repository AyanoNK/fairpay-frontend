interface CustomerVisit {
  id: number;
  customer: number;
  tax_percentage: number;
  visits_customervisitproducts: CustomerVisitProduct[];
}

interface CustomerVisitProduct {
  id: number;
  customer_visit: number;
  product_id: number;
  products_product: Product;
}

interface NewCustomerVisitProduct {}
