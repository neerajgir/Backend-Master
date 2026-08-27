import z from "zod";

export const signupSchema = z.object({
    email: z.string().email({message: "Invalid email format"}),
    fullName: z.string().min(8, { message: "Full name must be at least 8 characters long" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })

})
