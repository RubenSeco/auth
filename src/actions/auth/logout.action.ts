
import { defineAction } from 'astro:actions';
import { signOut } from 'firebase/auth';
import { firebase } from '../../firebase/config';

// Ejemplo de acción del lado del servidor
export const logout = defineAction({
  accept: "json",

  // Lógica principal del servidor
  handler: async (_, { cookies }) => {

    // Ejemplo: consultar en una base de datos o API
    return await signOut(firebase.auth)
  },
});

