import { api } from '@/http/api';

interface GetPresignedUrlRequest {
  name: string;
  contentType: string;
}

interface GetPresignedUrlResponse {
  id: string;
  publicUrl: string;
  signedUrl: string;
}

export async function getPresignedUrl({ name, contentType }: GetPresignedUrlRequest): Promise<GetPresignedUrlResponse> {
  const response = await api.post('uploads/get-presigned-url', {
    json: {
      name,
      contentType,
    },
  });

  return response.json<GetPresignedUrlResponse>();
}
