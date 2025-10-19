
import { defineAction } from 'astro:actions';
import { db, eq, inArray, Product, ProductImage } from 'astro:db';
import { z } from 'astro:schema';
import type { CartItem } from '~/interfaces/cart-item.interface';



// Ejemplo de acción del lado del servidor
export const loadProductsFromCart = defineAction({
  accept: "json",

  // Lógica principal del servidor
  handler: async (_, { cookies }) => {
    
    // Ejemplo: consultar en una base de datos o API

    const cart = JSON.parse(cookies.get("cart")?.value ?? "[]") as CartItem[];

    if (cart.length === 0) return [];

    const productIds = cart.map((item) => item.productId);

    const dbProducts = await db.select().from(Product).innerJoin(ProductImage, eq(Product.id, ProductImage.productId)).where(inArray(Product.id, productIds));


    return cart.map((item) => {
      const product = dbProducts.find((p) => p.Product.id === item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }

      const { title, price, slug } = product.Product;
      const image = product.ProductImage.image;

      return {
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        slug,
        title,
        price,
        image: image.startsWith("http") ? image : `${import.meta.env.PUBLIC_URL}/images/products/${image}`

      };

    });
  },
});

