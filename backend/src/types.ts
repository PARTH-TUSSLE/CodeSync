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

export const updationSchema = z.object({
  username: z
    .string()
    .min(3, { message: "The username should atleast contain three characters" })
    .max(50)
    .optional(),
  bio: z.string().max(200).optional(),
  profilePic: z
    .string()
    .refine(
      (value) => {
        if (!value.trim()) return true;
        const isHttpUrl = /^https?:\/\//i.test(value.trim());
        const isDataImage = /^data:image\/[a-zA-Z0-9.+-]+;base64,/i.test(
          value.trim(),
        );
        return isHttpUrl || isDataImage;
      },
      { message: "Profile picture must be a valid URL or uploaded image data" },
    )
    .optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(6, { message: "Old password must be atleast 6 characters" }),
  newPassword: z
    .string()
    .min(6, { message: "The password must be atleast 6 characters" }),
  confirmNewPassword: z
    .string()
    .min(6, { message: "Confirm password must be atleast 6 characters" }),
});
