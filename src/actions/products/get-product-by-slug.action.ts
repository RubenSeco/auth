



import { defineAction } from 'astro:actions';
import { db, eq, Product, ProductImage } from 'astro:db';
import { z } from 'astro:schema';
import type { ProductWithImages } from '~/interfaces/product-with-images.interface';



// Ejemplo de acción del lado del servidor
export const getProductBySlug = defineAction({
  accept: "json",
  input: z.string(),

  // Lógica principal del servidor
  handler: async (slug) => {

    const [product] = await db.select().from(Product).where(eq(Product.slug, slug));
    if (!product) {
      throw new Error(`Product with slug ${slug} not found`);
    }

    const images = await db.select().from(ProductImage).where(eq(ProductImage.productId, product.id));

    return {
      product: product as ProductWithImages,
      images: images.map((i) => i.image)
    };
  },
});
