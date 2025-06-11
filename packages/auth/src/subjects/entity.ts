import { z } from 'zod';

import { entitySchema } from '../models/entity';

export const entitySubject = z.tuple([
  z.union([z.literal('create'), z.literal('update'), z.literal('delete'), z.literal('get')]),
  z.union([z.literal('Entity'), entitySchema]),
]);

export type EntitySubject = z.infer<typeof entitySubject>;
