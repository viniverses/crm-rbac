'use server';

import { revalidateTag } from 'next/cache';

import { getCurrentOrganization } from '@/auth/auth';
import { TableFormValues } from '@/components/schema-builder/schema';
import { FormState } from '@/hooks/use-hybrid-form';
import { createEntity, CreateEntityResponse } from '@/http/entities/create-entity';
import { updateEntity } from '@/http/entities/update-entity';
import { handleApiError } from '@/http/error-handler';

export async function createEntityAction(table: TableFormValues): Promise<FormState<CreateEntityResponse>> {
  try {
    const org = await getCurrentOrganization();

    const response = await createEntity({
      ...table,
      org: org!,
    });

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }

    revalidateTag('entities');

    return {
      message: 'Tabela criada com sucesso.',
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateEntityAction(table: TableFormValues): Promise<FormState<CreateEntityResponse>> {
  try {
    const org = await getCurrentOrganization();

    const response = await updateEntity({
      org: org!,
      ...table,
    });

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }

    revalidateTag('entities');
    revalidateTag('entity');

    return {
      message: 'Tabela atualizada com sucesso.',
      success: true,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
