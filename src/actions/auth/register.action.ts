import { defineAction } from "astro:actions";

import { z } from "astro:schema";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { firebase } from '../../firebase/config';

export const registerUser = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),

  }),
  handler: async ({ name, email, password, remember_me }, { cookies }) => {

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

      const user = await createUserWithEmailAndPassword(firebase.auth, email, password);

      // Actualizar el nombre (displayName)
      updateProfile(firebase.auth.currentUser!, {
        displayName: name,

      });

      // Verificar el correo electrónico

      await sendEmailVerification(firebase.auth.currentUser!, {
        url: "http://localhost:4321/protected?emailVerified=true"
      });

      return {
        uid: user.user.uid,
        email: user.user.email,
        displayName: name
      };

    } catch (error) {
      console.log(error);
      throw new Error("Auxilio! algo salió mal");

    }

  }

});

