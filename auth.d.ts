import { DefaultSession, DefaultUser } from "@auth/core/types";
import { Role } from './.astro/integrations/astro_db/db';

declare module "@auth/core/types" {

  interface User extends DefaultUser {
    role: string;

  }

  interface Session extends DefaultSession {
    user: User;
  }
}
