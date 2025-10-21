



import { defineAction } from 'astro:actions';
import { db, Product, eq, ProductImage } from 'astro:db';
import { z } from 'astro:schema';
import { getSession } from 'auth-astro/server';
import { v4 as UUID } from 'uuid';
import { ImageUpload } from '~/utils/image-upload';

const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  "image/webp",
  "image/svg+xml"
];


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

    imageFiles: z.array(
      z.instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, "Max image size 5MB")
        .refine((file) => {
          if (file.size === 0) return true;
          return ACCEPTED_IMAGE_TYPES.includes(file.type);
        }, `Only supported image types file are valid, ${ACCEPTED_IMAGE_TYPES.join(",")}`)
    ).optional()
  }),

  // Lógica principal del servidor
  handler: async (form, { request }) => {
    // Ejemplo: consultar en una base de datos o API

    const session = await getSession(request);

    const user = session?.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { id = UUID(), imageFiles, ...rest } = form;
    rest.slug = rest.slug.toLowerCase().replaceAll(" ", "-").trim();

    const product = {
      id,
      user: user.id!,
      ...rest,
    };

    const queries: any = [];

    if (!form.id) {
      queries.push(db.insert(Product).values(product));
    } else {
      queries.push(db.update(Product).set(product).where(eq(Product.id, id)));
    }

    // Imagenes
    const secureUrls: string[] = [];

    if (form.imageFiles && form.imageFiles.length > 0 && form.imageFiles[0].size > 0) {
      const urls = await Promise.all(form.imageFiles.map((file) => ImageUpload.upload(file)));
      secureUrls.push(...urls);
    }
    secureUrls.forEach((imageUrl) => {
      const imageObj = {
        id: UUID(),
        productId: product.id,
        image: imageUrl,
      };
      queries.push(db.insert(ProductImage).values(imageObj));
    });
    

    // imageFiles?.forEach(async (imageFile) => {
    //   if (imageFile.size <= 0) return;

    //   const url = await ImageUpload.upload(imageFile);
    // });

    await db.batch(queries);

    return product;
  },
});
