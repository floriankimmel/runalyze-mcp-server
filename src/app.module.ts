import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { McpModule, McpTransportType } from '@rekog/mcp-nest';
import { RunalyzeHrvTool } from './tools/runalyze-hrv.tool';
import { RunalyzeSleepTool } from './tools/runalyze-sleep.tool';
import { RunalyzeHeartRateRestTool } from './tools/runalyze-heart-rate-rest.tool';
import { RunalyzeActivitiesTool } from './tools/runalyze-activities.tool';
import { RunalyzeActivityDetailTool } from './tools/runalyze-activity-detail.tool';
import configuration from './config/configuration';

@Module({
  imports: [
    // Load and validate configuration at startup
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // Makes ConfigService available throughout the app
      cache: true, // Cache the configuration for performance
    }),
    // Configure MCP module
    McpModule.forRoot({
      name: 'runalyze-mcp-server',
      version: '1.0.0',
      transport: McpTransportType.STDIO,
    }),
  ],
  providers: [
    RunalyzeHrvTool,
    RunalyzeSleepTool,
    RunalyzeHeartRateRestTool,
    RunalyzeActivitiesTool,
    RunalyzeActivityDetailTool,
  ],
})
export class AppModule {}
