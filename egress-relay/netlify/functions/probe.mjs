import { processProbeRequest } from '../../lib/probe-handler.js';

export default async function handler(request) {
  const result = await processProbeRequest({
    method: request.method,
    headers: request.headers,
    rawBody: await request.text()
  });

  return new Response(result.body, {
    status: result.status,
    headers: result.headers
  });
}

export const config = {
  path: '/api/probe'
};
