'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';

import { clearAuthToken } from '@/auth/session';
import { organizationFormSchema, type OrganizationFormValues } from '@/components/organization/schema';
import { createOrganization as createOrganizationRequest } from '@/services/organization/create-organization';
import { getOrganizations } from '@/services/organization/get-organizations';
import { uploadFile } from '@/services/uploads/upload-file';

const MAX_AVATAR_SIZE_BYTES = 4 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function createOrganization(input: OrganizationFormValues, avatarFile?: File) {
  const result = organizationFormSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false as const,
      message: null,
      errors: result.error.flatten().fieldErrors,
    };
  }

  if (avatarFile && (avatarFile.size > MAX_AVATAR_SIZE_BYTES || !ALLOWED_AVATAR_TYPES.includes(avatarFile.type))) {
    return {
      success: false as const,
      message: null,
      errors: { avatarUrl: ['File must be JPG, PNG, GIF or WEBP and up to 4MB.'] },
    };
  }

  try {
    const avatarUrl = avatarFile ? await uploadFile(avatarFile) : null;
    const { slug } = await createOrganizationRequest({
      name: result.data.name,
      domain: result.data.domain || null,
      shouldAttachUsersByDomain: result.data.shouldAttachUsersByDomain,
      avatarUrl,
    });

    (await cookies()).set('@crm-organization', slug, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { success: true as const, message: null, errors: null };
  } catch (error) {
    if (!isAxiosError<{ message?: string }>(error)) {
      console.error(error);
    }

    return {
      success: false as const,
      message: isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? 'Could not create organization. Please try again.')
        : 'Could not create organization. Please try again.',
      errors: null,
    };
  }
}

export async function selectOrganization(slug: string) {
  const organizations = await getOrganizations();

  if (!organizations.some((organization) => organization.slug === slug)) {
    return { success: false as const };
  }

  (await cookies()).set('@crm-organization', slug, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return { success: true as const };
}

export async function signOut() {
  await clearAuthToken();

  redirect('/sign-in');
}
