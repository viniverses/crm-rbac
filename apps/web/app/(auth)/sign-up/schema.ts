import * as z from 'zod';

export const signUpFormSchema = z
  .object({
    name: z
      .string()
      .min(1, {
        message: 'Full name is required',
      })
      .refine((value) => value.trim().split(/\s+/).length > 1, {
        message: 'Please enter your full name',
      }),
    email: z
      .string()
      .email({
        message: 'Please enter a valid email address',
      })
      .min(1, {
        message: 'Email is required',
      }),
    password: z.string().min(6, {
      message: 'Password must contain at least 6 characters',
    }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export type SignUpForm = z.infer<typeof signUpFormSchema>;
