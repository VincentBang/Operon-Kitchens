import {
  AdvancedReviewPayloadFunctionResponse,
  handleAdvancedReviewPayloadFunctionRequest,
} from '../../src/lib/advancedReviewPayloadFunction';
import { createAdvancedReviewSupabaseStorageAdapter } from '../../src/lib/advancedReviewSupabaseStorage';

declare const Netlify: {
  env: {
    get(key: string): string | undefined;
  };
};

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

async function toNetlifyResponse(response: AdvancedReviewPayloadFunctionResponse) {
  return new Response(await response.text(), {
    status: response.status,
    headers: jsonHeaders,
  });
}

export default async function handler(request: Request) {
  const response = await handleAdvancedReviewPayloadFunctionRequest(
    request,
    createAdvancedReviewSupabaseStorageAdapter({
      supabaseUrl: Netlify.env.get('OPERON_KITCHENS_SUPABASE_URL'),
      serviceRoleKey: Netlify.env.get('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY'),
    }),
  );

  return toNetlifyResponse(response);
}
