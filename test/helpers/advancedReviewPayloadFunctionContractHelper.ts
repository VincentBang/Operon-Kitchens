import {
  AdvancedReviewPayloadFunctionRequest,
  handleAdvancedReviewPayloadFunctionRequest,
  readAdvancedReviewPayloadFunctionJson,
} from '../../src/lib/advancedReviewPayloadFunction';
import { advancedReviewPayloadFunctionPath } from '../../src/lib/advancedReviewStorage';

export interface AdvancedReviewPayloadContractRequestOptions {
  method?: string;
  body?: unknown;
  contentType?: string;
}

export function createAdvancedReviewPayloadContractRequest(
  options: AdvancedReviewPayloadContractRequestOptions = {},
): AdvancedReviewPayloadFunctionRequest & { url: string } {
  const method = options.method ?? 'POST';
  const contentType = options.contentType ?? 'application/json';
  const rawBody = options.body === undefined
    ? undefined
    : typeof options.body === 'string'
      ? options.body
      : JSON.stringify(options.body);

  return {
    method,
    url: `https://operon-kitchens.test${advancedReviewPayloadFunctionPath}`,
    headers: {
      get(name: string) {
        return name.toLowerCase() === 'content-type' ? contentType || null : null;
      },
    },
    async json() {
      if (rawBody === undefined) return undefined;
      return JSON.parse(rawBody);
    },
  };
}

export {
  handleAdvancedReviewPayloadFunctionRequest as handleAdvancedReviewPayloadContractRequest,
  readAdvancedReviewPayloadFunctionJson as readAdvancedReviewPayloadContractJson,
};
