import { z } from 'zod';

export const loginFormSchema = z.object({
	email: z.string().email({
		pattern: /^[a-zA-Z0-9._%+-]+@cvsu\.edu\.ph$/,
		error: "invalid email"
	}),
	password: z.string().min(8, "password must be at least 8 characters"),
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>

