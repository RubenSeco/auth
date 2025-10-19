



import { defineAction } from 'astro:actions';
import { db, Product, eq } from 'astro:db';
import { z } from 'astro:schema';
import { getSession } from 'auth-astro/server';
import { v4 as UUID } from 'uuid';


// Ejemplo de acción del lado del servidor
export const createUpdateProduct = defineAction({
  accept: "form",
  input: z.object({

    id: z.string().optional(),
    description: z.string(),
    gender: z.string(),
    price: z.number(),
    sizes: z.string(),
    slug: z.string(),
    tags: z.string(),
    title: z.string(),
    type: z.string(),
    stock: z.number(),
  }),

  // Lógica principal del servidor
  handler: async (form, { request }) => {
    // Ejemplo: consultar en una base de datos o API

    const session = await getSession(request);

    const user = session?.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { id = UUID(), ...rest } = form;
    rest.slug = rest.slug.toLowerCase().replaceAll(" ", "-").trim();

    const product = {
      id,
      user: user.id!,
      ...rest,
    };

    await db.update(Product).set(product).where(eq(Product.id, id));

    return product;
  },
});
