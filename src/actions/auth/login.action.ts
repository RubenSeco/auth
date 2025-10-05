


import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { signInWithEmailAndPassword, type AuthError } from 'firebase/auth';
import { firebase } from '~/firebase/config';

// Ejemplo de acción del lado del servidor
export const loginUser = defineAction({
  accept: "form",
  input: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional()
  }),
  // Lógica principal del servidor
  handler: async ({ email, password, remember_me }, { cookies }) => {

    if (remember_me) {
      cookies.set("email", email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: "/"

      });
    } else {
      cookies.delete("email", {
        path: "/"
      });
    }

    try {
      const user = await signInWithEmailAndPassword(firebase.auth, email, password);
      return user;

    } catch (error) {
      console.log(error);
      const firebaseError = error as AuthError
      if (firebaseError.code === "auth/email-already-in-use") {
        throw new Error ("El correo ya existe")
      }
      throw new Error("No se pudo realizar el ingreso")
    }
    // Ejemplo: consultar en una base de datos o API
  },
});
