import { z } from 'zod';

export class ZodValidationError extends Error {
  constructor(
    public errors: Record<string, string[]>,
    public fields: Record<string, string>,
  ) {
    super('Invalid form data');
    this.name = 'ZodValidationError';
    this.fields = fields;
    this.errors = errors;
  }
}

export function parseFormData<T extends z.ZodType>(schema: T, formData: FormData): z.infer<T> {
  const fields: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    fields[key] = value.toString();
  }

  try {
    return schema.parse(fields);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      for (const [key, value] of Object.entries(error.flatten().fieldErrors)) {
        if (value) {
          errors[key] = value;
        }
      }
      throw new ZodValidationError(errors, fields);
    }

    throw error;
  }
}
