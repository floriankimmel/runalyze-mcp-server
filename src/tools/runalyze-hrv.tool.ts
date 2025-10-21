import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Tool, Context } from '@rekog/mcp-nest';
import { z } from 'zod';
import type { AppConfig } from '../config/configuration';

const getHrvDataSchema = z.object({
  page: z.number().int().min(1).default(1).describe('The collection page number (default: 1)'),
});

interface HrvDataItem {
  id: number;
  date_time: string;
  metric: string;
  measurement_type: string;
}

interface HrvResponse {
  data: HrvDataItem[];
  page: number;
  totalItems?: number;
}

@Injectable()
export class RunalyzeHrvTool {
  private readonly apiToken: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService<AppConfig>) {
    // Get configuration values at startup
    // These are guaranteed to be defined due to config validation
    this.apiToken = this.configService.get<string>('runalyze.apiToken', { infer: true })!;
    this.baseUrl = this.configService.get<string>('runalyze.baseUrl', { infer: true })!;
  }

  @Tool({
    name: 'get-runalyze-hrv-data',
    description:
      'Retrieve HRV (Heart Rate Variability) data from the Runalyze API. Returns a collection of HRV measurements including date/time, metric values, and measurement types.',
    parameters: getHrvDataSchema,
  })
  async getHrvData(params: z.infer<typeof getHrvDataSchema>, context: Context): Promise<string> {
    await context.reportProgress({ progress: 0, total: 100 });

    // Check if API token is configured
    if (!this.apiToken || this.apiToken.trim() === '') {
      return JSON.stringify(
        {
          error: 'Configuration Error',
          message:
            'RUNALYZE_API_TOKEN is not configured. Please set the environment variable or add it to your MCP client configuration.',
          instructions: {
            step1: 'Get your API token from https://runalyze.com/settings/personal-api',
            step2: 'Add RUNALYZE_API_TOKEN to your MCP client env configuration',
          },
        },
        null,
        2,
      );
    }

    try {
      const { page } = params;
      const endpoint = `${this.baseUrl}/api/v1/metrics/hrv?page=${page}`;

      await context.reportProgress({ progress: 25, total: 100 });

      // Make the API request
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          token: this.apiToken,
        },
      });

      await context.reportProgress({ progress: 75, total: 100 });

      if (!response.ok) {
        if (response.status === 403) {
          return JSON.stringify(
            {
              error: 'Forbidden',
              message:
                'Access denied. Please check your API token and ensure you have premium access.',
              status: 403,
            },
            null,
            2,
          );
        }

        if (response.status === 401) {
          return JSON.stringify(
            {
              error: 'Unauthorized',
              message: 'Invalid API token.',
              status: 401,
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

      const data = (await response.json()) as HrvDataItem[];

      await context.reportProgress({ progress: 100, total: 100 });

      const result: HrvResponse = {
        data,
        page,
        totalItems: data.length,
      };

      return JSON.stringify(result, null, 2);
    } catch (error) {
      await context.reportProgress({ progress: 100, total: 100 });

      return JSON.stringify(
        {
          error: 'Request Failed',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: String(error),
        },
        null,
        2,
      );
    }
  }
}
