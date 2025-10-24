import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { McpModule, McpTransportType } from '@rekog/mcp-nest';
import { RunalyzeHrvTool } from './tools/runalyze-hrv.tool';
import { RunalyzeSleepTool } from './tools/runalyze-sleep.tool';
import { RunalyzeHeartRateRestTool } from './tools/runalyze-heart-rate-rest.tool';
import { RunalyzeActivitiesTool } from './tools/runalyze-activities.tool';
import { RunalyzeActivityDetailTool } from './tools/runalyze-activity-detail.tool';
import { BearerAuthGuard } from './auth/bearer-auth.guard';
import { TokenInterceptor } from './auth/token.interceptor';
import { HealthController } from './health/health.controller';
import configuration from './config/configuration';

@Module({
  imports: [
    // Load and validate configuration at startup
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // Makes ConfigService available throughout the app
      cache: true, // Cache the configuration for performance
    }),
    // Configure MCP module with both SSE and Streamable HTTP transports
    McpModule.forRoot({
      name: 'runalyze-mcp-server',
      version: '1.0.0',
      transport: [McpTransportType.SSE, McpTransportType.STREAMABLE_HTTP],
      streamableHttp: {
        statelessMode: true, // Enable stateless mode for Claude Code compatibility
      },
    }),
  ],
  controllers: [HealthController],
  providers: [
    // Tools
    RunalyzeHrvTool,
    RunalyzeSleepTool,
    RunalyzeHeartRateRestTool,
    RunalyzeActivitiesTool,
    RunalyzeActivityDetailTool,
    // Authentication
    {
      provide: APP_GUARD,
      useClass: BearerAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TokenInterceptor,
    },
  ],
})
export class AppHttpModule {}
