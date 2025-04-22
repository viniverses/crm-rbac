'use server';

import { getPresignedUrl } from '@/http/uploads/get-presigned-url';

export async function uploadFile(file: File): Promise<string | undefined> {
  try {
    const { signedUrl, publicUrl } = await getPresignedUrl({
      name: file.name,
      contentType: file.type,
    });

    const response = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload file.');
    }

    return publicUrl;
  } catch (error) {
    console.error('Exception while uploading file', error);
  }
}
