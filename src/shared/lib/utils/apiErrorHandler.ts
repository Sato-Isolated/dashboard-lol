// src/utils/apiErrorHandler.ts
import { NextResponse } from 'next/server';

export function apiErrorHandler(e: unknown) {
  let status = 500;
  const message =
    (e as { message?: string })?.message || 'Internal server error';
  if (message.includes('Unauthorized')) {status = 401;}
  else if (message.includes('Forbidden')) {status = 403;}
  else if (message.includes('not found')) {status = 404;}
  else if (message.includes('Rate limit')) {status = 429;}
  else if (message.includes('Unsupported')) {status = 415;}
  else if (message.includes('Service unavailable')) {status = 503;}
  else if (message.includes('Gateway timeout')) {status = 504;}
  else if (message.includes('Bad gateway')) {status = 502;}
  else if (message.includes('Method not allowed')) {status = 405;}
  return NextResponse.json({ error: message }, { status });
}
