import * as z from 'zod';

export const fieldSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(4, { message: 'Nome do campo é obrigatório' }),
  dataType: z.string().min(1, { message: 'Tipo de dado é obrigatório' }),
  isPrimaryKey: z.boolean(),
  isRequired: z.boolean(),
  isNullable: z.boolean(),
  isUnique: z.boolean(),
  defaultValue: z.string().nullable().optional(),
  indexType: z.enum(['none', 'index', 'unique'], {
    message: 'Tipo de índice inválido',
  }),
  isInvisible: z.boolean(),
});

export const relationshipSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  targetTableId: z.string(),
  sourceFieldId: z.string(),
  targetFieldId: z.string(),
  relationshipType: z.enum(['one-to-one', 'one-to-many', 'many-to-many']),
});

export const tableSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: 'O nome da tabela é obrigatório' }),
  tableName: z
    .string()
    .min(1, { message: 'Nome da tabela é obrigatório' })
    .regex(/^[a-zA-Z_][a-zA-Z_]*$/, {
      message: 'Nome da tabela deve começar com letra ou underscore e conter apenas letras, números e underscores',
    })
    .max(63, { message: 'Nome da tabela deve ter no máximo 63 caracteres' })
    .refine((name) => !name.startsWith('pg_'), {
      message: "Nome da tabela não pode começar com 'pg_' (prefixo reservado)",
    }),
  fields: z.array(fieldSchema),
  relationships: z.array(relationshipSchema),
});

export type TableFormValues = z.infer<typeof tableSchema>;
