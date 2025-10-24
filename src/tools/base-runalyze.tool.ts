import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Context } from '@rekog/mcp-nest';
import type { AppConfig } from '../config/configuration';
import { RUNALYZE_TOKEN_KEY } from '../auth/token.interceptor';

/**
 * Base class for all Runalyze tools
 * Handles token management for both STDIO and HTTP modes
 */
@Injectable()
export abstract class BaseRunalyzeTool {
  protected readonly baseUrl: string;
  private readonly configApiToken: string;

  constructor(protected readonly configService: ConfigService<AppConfig>) {
    this.configApiToken = this.configService.get<string>('runalyze.apiToken', {
      infer: true,
    })!;
    this.baseUrl = this.configService.get<string>('runalyze.baseUrl', {
      infer: true,
    })!;
  }

  /**
   * Gets the API token from either:
   * 1. HTTP request context (Bearer token from Authorization header)
   * 2. Configuration (RUNALYZE_API_TOKEN env var for STDIO mode)
   */
  protected getApiToken(context: Context, httpRequest?: any): string {
    // Try to get token from HTTP request first (HTTP mode)
    // The @rekog/mcp-nest library passes httpRequest as third parameter to tool methods
    if (httpRequest?.mcpContext?.[RUNALYZE_TOKEN_KEY]) {
      const token = httpRequest.mcpContext[RUNALYZE_TOKEN_KEY];
      if (token && token.trim() !== '') {
        return token;
      }
    }

    // Also try context.request for backwards compatibility
    const contextToken = (context as any).request?.mcpContext?.[RUNALYZE_TOKEN_KEY];
    if (contextToken && contextToken.trim() !== '') {
      return contextToken;
    }

    // Fall back to configured token (STDIO mode)
    return this.configApiToken;
  }

  /**
   * Makes an authenticated request to the Runalyze API
   */
  protected async fetchRunalyze(
    endpoint: string,
    context: Context,
    options: RequestInit = {},
    httpRequest?: any,
  ): Promise<Response> {
    const apiToken = this.getApiToken(context, httpRequest);

    if (!apiToken || apiToken.trim() === '') {
      throw new Error('No Runalyze API token available');
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    return fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        token: apiToken,
        ...options.headers,
      },
    });
  }

  /**
   * Standard error response formatter
   */
  protected formatErrorResponse(error: unknown): string {
    if (error instanceof Error) {
      if (error.message === 'No Runalyze API token available') {
        return JSON.stringify(
          {
            error: 'Authentication Required',
            message:
              'No Runalyze API token provided. For HTTP mode, include Authorization: Bearer <token> header. For STDIO mode, set RUNALYZE_API_TOKEN environment variable.',
            instructions: {
              http_mode: 'Include "Authorization: Bearer YOUR_RUNALYZE_TOKEN" in request headers',
              stdio_mode: 'Set RUNALYZE_API_TOKEN in your MCP client configuration',
              get_token: 'Get your API token from https://runalyze.com/settings/personal-api',
            },
          },
          null,
          2,
        );
      }

      return JSON.stringify(
        {
          error: 'Request Failed',
          message: error.message,
          details: String(error),
        },
        null,
        2,
      );
    }

    return JSON.stringify(
      {
        error: 'Unknown Error',
        message: 'An unknown error occurred',
        details: String(error),
      },
      null,
      2,
    );
  }

  /**
   * Standard HTTP error response handler
   */
  protected async handleHttpError(response: Response): Promise<string | null> {
    if (response.ok) {
      return null;
    }

    if (response.status === 401) {
      return JSON.stringify(
        {
          error: 'Unauthorized',
          message: 'Invalid Runalyze API token.',
          status: 401,
        },
        null,
        2,
      );
    }

    if (response.status === 403) {
      return JSON.stringify(
        {
          error: 'Forbidden',
          message: 'Access denied. Please check your API token and ensure you have premium access.',
          status: 403,
        },
        null,
        2,
      );
    }

    return JSON.stringify(
      {
        error: 'API Error',
        message: `Request failed with status ${response.status}`,
        status: response.status,
      },
      null,
      2,
    );
  }
}
