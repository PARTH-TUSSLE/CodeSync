import z from "zod";

export const SignupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "The username should atleast contain three characters" })
    .max(50),
  email: z.string(),
  password: z.string().min(6, { message: "Atleast 6 characters are required" }),
});

export const SignInSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().optional(),
  password: z
    .string()
    .min(6, { message: "The password must be atleast 6 characters" }),
});
