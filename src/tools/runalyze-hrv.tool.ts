import { Injectable } from '@nestjs/common';
import { Tool, Context } from '@rekog/mcp-nest';
import { z } from 'zod';
import { BaseRunalyzeTool } from './base-runalyze.tool';

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
export class RunalyzeHrvTool extends BaseRunalyzeTool {
  @Tool({
    name: 'get-runalyze-hrv-data',
    description:
      'Retrieve HRV (Heart Rate Variability) data from the Runalyze API. Returns a collection of HRV measurements including date/time, metric values, and measurement types.',
    parameters: getHrvDataSchema,
  })
  async getHrvData(
    params: z.infer<typeof getHrvDataSchema>,
    context: Context,
    httpRequest?: any,
  ): Promise<string> {
    await context.reportProgress({ progress: 0, total: 100 });

    try {
      const { page } = params;
      const endpoint = `/api/v1/metrics/hrv?page=${page}`;

      await context.reportProgress({ progress: 25, total: 100 });

      // Make the API request using base class method
      const response = await this.fetchRunalyze(
        endpoint,
        context,
        {
          method: 'GET',
        },
        httpRequest,
      );

      await context.reportProgress({ progress: 75, total: 100 });

      // Check for HTTP errors
      const errorResponse = await this.handleHttpError(response);
      if (errorResponse) {
        return errorResponse;
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
      return this.formatErrorResponse(error);
    }
  }
}
