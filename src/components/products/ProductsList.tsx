import type { ProductWithImages } from "~/interfaces/product-with-images.interface";
import { ProductCard } from "./ProductCard";

interface Props {
  products: ProductWithImages[];
}

export const ProductsList = ({ products }: Props) => {


  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 place-content-center">
        {
          products.map((product) => (

            <ProductCard key= {product.id} product={product}/>
           ))
        }
      </div>
    </>
  );
};
