import { Injectable } from '@nestjs/common';
import { Tool, Context } from '@rekog/mcp-nest';
import { z } from 'zod';
import { BaseRunalyzeTool } from './base-runalyze.tool';

const getSleepDataSchema = z.object({
  page: z.number().int().min(1).default(1).describe('The collection page number (default: 1)'),
});

interface SleepDataItem {
  id: number;
  date_time: string;
  metric: string;
  measurement_type: string;
}

interface SleepResponse {
  data: SleepDataItem[];
  page: number;
  totalItems?: number;
}

@Injectable()
export class RunalyzeSleepTool extends BaseRunalyzeTool {
  @Tool({
    name: 'get-runalyze-sleep-data',
    description:
      'Retrieve Sleep data from the Runalyze API. Returns a collection of sleep measurements including date/time, metric values, and measurement types.',
    parameters: getSleepDataSchema,
  })
  async getSleepData(
    params: z.infer<typeof getSleepDataSchema>,
    context: Context,
    httpRequest?: any,
  ): Promise<string> {
    await context.reportProgress({ progress: 0, total: 100 });

    try {
      const { page } = params;
      const endpoint = `/api/v1/metrics/sleep?page=${page}`;

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

      const data = (await response.json()) as SleepDataItem[];

      await context.reportProgress({ progress: 100, total: 100 });

      const result: SleepResponse = {
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
