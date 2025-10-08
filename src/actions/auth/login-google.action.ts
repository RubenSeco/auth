


import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { firebase } from '~/firebase/config';

// Ejemplo de acción del lado del servidor
export const loginWhithGoogle = defineAction({
  accept: "json",

  input: z.any(),

  // Lógica principal del servidor
  handler: async (credentials) => {

    const credential = GoogleAuthProvider.credentialFromResult(credentials);

    if (!credential) {
      throw new Error("Google SignIn falló");
    }
    await signInWithCredential(firebase.auth, credential);    // Ejemplo: consultar en una base de datos o API
    return { ok: true };
  },
});

