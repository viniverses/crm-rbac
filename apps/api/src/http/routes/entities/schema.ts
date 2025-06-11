import z from 'zod';

export const fieldSchema = z.array(
  z.object({
    id: z.string().uuid(),
    name: z.string().min(4, { message: 'Name must be at least 4 characters long' }),
    dataType: z.string(),
    isPrimaryKey: z.boolean(),
    isRequired: z.boolean(),
    isNullable: z.boolean(),
    isUnique: z.boolean(),
    defaultValue: z.string().nullable().optional(),
    indexType: z.enum(['none', 'index', 'unique'], {
      message: 'Invalid index type',
    }),
    isInvisible: z.boolean(),
  }),
);

export const relationshipSchema = z.array(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    targetTableId: z.string(),
    sourceFieldId: z.string(),
    targetFieldId: z.string(),
    relationshipType: z.enum(['one-to-one', 'one-to-many', 'many-to-many']),
  }),
);
