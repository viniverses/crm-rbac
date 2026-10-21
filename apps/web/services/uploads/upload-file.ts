import { api } from '@/services/api';

interface PresignedUrlResponse {
  signedUrl: string;
  publicUrl: string;
}

export async function uploadFile(file: File) {
  const { data } = await api.post<PresignedUrlResponse>('/uploads/get-presigned-url', {
    name: file.name,
    contentType: file.type,
  });

  const response = await fetch(data.signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!response.ok) {
    throw new Error('Failed to upload organization logo');
  }

  return data.publicUrl;
}
