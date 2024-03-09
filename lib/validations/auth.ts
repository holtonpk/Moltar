import * as z from "zod";

export const userAuthSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be 8 or more characters long" }),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be 8 or more characters long" }),
  firstName: z.string(),
  lastName: z.string(),
});
