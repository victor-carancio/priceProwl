import { z } from "zod";

const emailSchema = z.string().email({ message: "Invalid email address" });
const usernameSchema = z
  .string()
  .min(3, { message: "Username must be 3 or more characters long" });

export const userLoginSchema = z.object({
  identifier: z.string().refine(
    (value) => {
      return (
        emailSchema.safeParse(value).success ||
        usernameSchema.safeParse(value).success
      );
    },
    { message: "Must provide a valid email or username" },
  ),
  password: z.string().min(8, { message: "Must be 8 or more character long!" }),
});

export const userSignUpSchema = z.object({
  username: usernameSchema.optional(),
  email: z.string().email(),
  password: z.string().min(8, { message: "Must be 8 or more character long!" }),
});
