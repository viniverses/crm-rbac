import * as z from 'zod';

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(1, {
        message: 'Nome é obrigatório',
      })
      .refine((value) => value.split(' ').length > 1, {
        message: 'Insira seu nome completo',
      }),
    email: z
      .string()
      .email({
        message: 'Email inválido',
      })
      .min(1, {
        message: 'Email é obrigatório',
      }),
    password: z.string().min(6, {
      message: 'Senha deve conter pelo menos 6 caracteres',
    }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'As senhas não coincidem',
    path: ['passwordConfirmation'],
  });

export type RegisterForm = z.infer<typeof registerFormSchema>;
