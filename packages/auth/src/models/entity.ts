import { z } from 'zod';

export const entitySchema = z.object({
  __typename: z.literal('Entity').default('Entity'),
  id: z.string(),
  createdBy: z.string().uuid(),
});

export type Entity = z.infer<typeof entitySchema>;
