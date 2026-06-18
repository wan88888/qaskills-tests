import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export class BaseApiClient {
  protected readonly request: APIRequestContext;
  protected readonly basePath: string;

  constructor(request: APIRequestContext, basePath: string) {
    this.request = request;
    this.basePath = basePath;
  }

  protected url(path: string, params?: Record<string, string>): string {
    const suffix = params
      ? `${path}?${new URLSearchParams(params).toString()}`
      : path;
    return `${this.basePath}${suffix}`;
  }

  protected get(path: string, params?: Record<string, string>): Promise<APIResponse> {
    return this.request.get(this.url(path, params));
  }

  protected post(path: string, data: unknown): Promise<APIResponse> {
    return this.request.post(this.url(path), { data });
  }

  protected put(path: string, data: unknown): Promise<APIResponse> {
    return this.request.put(this.url(path), { data });
  }

  protected patch(path: string, data: unknown): Promise<APIResponse> {
    return this.request.patch(this.url(path), { data });
  }

  protected delete(path: string): Promise<APIResponse> {
    return this.request.delete(this.url(path));
  }
}

export async function assertJsonResponse(
  response: APIResponse,
  expectedStatus: number,
): Promise<void> {
  expect(response.status()).toBe(expectedStatus);
  expect(response.headers()['content-type']).toContain('application/json');
}

export async function assertResponseWithin(
  responsePromise: Promise<APIResponse>,
  maxMs: number,
): Promise<APIResponse> {
  const start = Date.now();
  const response = await responsePromise;
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(maxMs);
  return response;
}
