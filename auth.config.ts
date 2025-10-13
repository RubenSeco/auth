import Credentials from '@auth/core/providers/credentials';
import { db, eq, User } from 'astro:db';
import { defineConfig } from 'auth-astro';
import bcrypt from 'bcryptjs';

export default defineConfig({
  providers: [
    // TODO:
    // GitHub({
    //   clientId: import.meta.env.GITHUB_CLIENT_ID,
    //   clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    // }),
    Credentials({
      name: 'Credentials',
      credentials: {
        // username: { label: 'Username', type: 'text' },
        email: { label: "Email", type: "email" },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async ({ email, password }) => {
        const [user] = await db.select().from(User).where(eq(User.email, `${email}`));
        if (!user) {
          throw new Error("User not found");
        }

        if (!bcrypt.compareSync(password as string, user.password)) {
          throw new Error("Invalid password");

        }

        const { password: _, ...rest } = user;

        console.log({ rest });

        return rest;
      }
    })
  ],
});
