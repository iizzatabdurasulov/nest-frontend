import ProductsList from "@/components/Products";
import React, { Suspense } from "react";

const Products = () => {
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <ProductsList />
      </Suspense>
    </div>
  );
};

export default Products;
