import z from "zod";

export const registerUserSchema = z.object({
    name: z.string().trim().min(1, "Name is Required").max(255, "Name must be less than 255 characters"),
    userName: z.string().trim().min(1, "Username is Required").max(255, "Name must be less than 255 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username can Only Contain Letters, Numbers, Underscores & Hyphens"),
    email: z.email("Valid Email Address is Required").trim().min(1, "Email is Required").max(255, "Name must be less than 255 characters").toLowerCase(),
    password: z.string().min(6, "Password is Required with Minimum 6 Characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain atleast one lowercase letter, one uppercase letter, one digit"),
    role: z.enum(["applicant", "employer"], { error: "Role must be Applicant or Employer"}).default("applicant"),
})

export type RegisterUserDataType = z.infer<typeof registerUserSchema>;

export const registerUserWithConfirmSchema = registerUserSchema.extend({
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords is not Matching",
    path: ["confirmPassword"],
})

export type RegisterUserWithConfirmDataType = z.infer<typeof registerUserWithConfirmSchema>;

export const loginUserSchema = z.object({
    email: z.email("Valid Email Address is Required").trim().min(1, "Email is Required").max(255, "Name must be less than 255 characters").toLowerCase(),
    password: z.string().min(6, "Password is Required with Minimum 6 Characters"),
})

export type LoginUserDataType = z.infer<typeof loginUserSchema>;


