import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger/logger';
import { ValidationError, AppError } from '@/lib/globalErrorHandler';

// Type for API handler with validated request
export type ValidatedApiHandler<T = Record<string, unknown>> = (
  req: NextRequest,
  validatedData: T,
  context: { params: Promise<Record<string, string>> }
) => Promise<NextResponse> | NextResponse;

// Create validation middleware
export function withValidation<T = Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  handler: ValidatedApiHandler<T>,
) {
  return async function validatedHandler(
    req: NextRequest,
    context: { params: Promise<Record<string, string>> },
  ): Promise<NextResponse> {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    try {
      logger.info('API request started', {
        requestId,
        method: req.method,
        url: req.url,
        userAgent: req.headers.get('user-agent'),
      });

      let dataToValidate: Record<string, unknown> = {}; // Validate query parameters
      if (req.method === 'GET') {
        const url = new URL(req.url);
        const queryParams: Record<string, unknown> = {};

        for (const [key, value] of url.searchParams.entries()) {
          // Keep all query parameters as strings - let Zod handle type conversion
          // Only convert explicit boolean strings
          if (value === 'true' || value === 'false') {
            queryParams[key] = value === 'true';
          } else {
            queryParams[key] = value;
          }
        }

        dataToValidate = queryParams;
      }

      // Validate request body for POST/PUT/PATCH
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        try {
          const body = await req.json();
          dataToValidate = body;
        } catch {
          logger.warn('Failed to parse request body as JSON', { requestId });
          throw new ValidationError('Invalid JSON in request body');
        }
      }

      // Validate path parameters (always a Promise in Next.js 15)
      const params = context.params ? await context.params : {};
      dataToValidate = { ...dataToValidate, ...params };

      // Perform validation
      const validatedData = schema.parse(dataToValidate);

      logger.debug('Request validation successful', {
        requestId,
        validatedData: JSON.stringify(validatedData).substring(0, 500),
      });

      // Call the actual handler
      const response = await handler(req, validatedData, context);

      const duration = Date.now() - startTime;

      logger.info('API request completed successfully', {
        requestId,
        method: req.method,
        url: req.url,
        status: response.status,
        duration,
      });

      // Add request ID to response headers
      response.headers.set('X-Request-ID', requestId);

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      if (error instanceof z.ZodError) {
        const validationError = new ValidationError(
          `Validation failed: ${error.errors
            .map(e => `${e.path.join('.')}: ${e.message}`)
            .join(', ')}`,
        );

        logger.warn('Request validation failed', {
          requestId,
          method: req.method,
          url: req.url,
          errors: error.errors,
          duration,
        });

        return NextResponse.json(
          {
            error: 'Validation Error',
            message: validationError.message,
            details: error.errors,
            requestId,
          },
          {
            status: 400,
            headers: { 'X-Request-ID': requestId },
          },
        );
      }

      if (error instanceof AppError) {
        logger.error('API request failed with application error', error, {
          requestId,
          method: req.method,
          url: req.url,
          duration,
        });

        return NextResponse.json(
          {
            error: error.name,
            message: error.message,
            errorCode: error.errorCode,
            requestId,
          },
          {
            status: error.statusCode,
            headers: { 'X-Request-ID': requestId },
          },
        );
      }

      // Unhandled error
      logger.error('API request failed with unhandled error', error as Error, {
        requestId,
        method: req.method,
        url: req.url,
        duration,
      });

      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
          requestId,
        },
        {
          status: 500,
          headers: { 'X-Request-ID': requestId },
        },
      );
    }
  };
}
// Rate limiting middleware (basic implementation)
interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(options: RateLimitOptions) {
  return function rateLimitMiddleware<T>(
    handler: ValidatedApiHandler<T>,
  ): ValidatedApiHandler<T> {
    return async function rateLimitedHandler(req, validatedData, context) {
      const clientId = getClientId(req);
      const now = Date.now();

      // Clean up expired entries
      for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetTime) {
          rateLimitStore.delete(key);
        }
      }

      const clientData = rateLimitStore.get(clientId);

      if (!clientData || now > clientData.resetTime) {
        // First request or window expired
        rateLimitStore.set(clientId, {
          count: 1,
          resetTime: now + options.windowMs,
        });
      } else if (clientData.count >= options.maxRequests) {
        // Rate limit exceeded
        const resetIn = Math.ceil((clientData.resetTime - now) / 1000);

        logger.warn('Rate limit exceeded', {
          clientId,
          count: clientData.count,
          limit: options.maxRequests,
          resetIn,
        });

        return NextResponse.json(
          {
            error: 'Rate Limit Exceeded',
            message: `Too many requests. Try again in ${resetIn} seconds.`,
            retryAfter: resetIn,
          },
          {
            status: 429,
            headers: {
              'Retry-After': resetIn.toString(),
              'X-RateLimit-Limit': options.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': clientData.resetTime.toString(),
            },
          },
        );
      } else {
        // Increment counter
        clientData.count++;
      }

      const response = await handler(req, validatedData, context);

      // Add rate limit headers
      const remaining = Math.max(
        0,
        options.maxRequests - (clientData?.count || 0),
      );
      response.headers.set('X-RateLimit-Limit', options.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      if (clientData) {
        response.headers.set(
          'X-RateLimit-Reset',
          clientData.resetTime.toString(),
        );
      }

      return response;
    };
  };
}

function getClientId(req: NextRequest): string {
  // Try to get user ID from headers or use IP
  const userId = req.headers.get('x-user-id');
  if (userId) {
    return `user:${userId}`;
  }

  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded
    ? forwarded.split(',')[0]
    : req.headers.get('x-real-ip') || 'unknown';
  return `ip:${ip}`;
}

// Combine multiple middlewares
export function withMiddleware<T>(
  validationSchema: z.ZodSchema<T>,
  options: {
    rateLimit?: RateLimitOptions;
  } = {},
) {
  return function middlewareComposer(handler: ValidatedApiHandler<T>) {
    let composedHandler = handler;

    // Apply rate limiting if specified
    if (options.rateLimit) {
      composedHandler = withRateLimit(options.rateLimit)(composedHandler);
    }

    // Apply validation (should be last)
    return withValidation(validationSchema, composedHandler);
  };
}
