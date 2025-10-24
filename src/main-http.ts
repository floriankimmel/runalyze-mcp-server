import { NestFactory } from '@nestjs/core';
import { AppHttpModule } from './app-http.module';

async function bootstrap() {
  // Create HTTP application for SSE transport
  const app = await NestFactory.create(AppHttpModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Enable CORS for cross-origin requests
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Get port from environment or default to 3000
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`MCP HTTP server is running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`MCP endpoint: http://localhost:${port}/mcp (requires Bearer token)`);
}

bootstrap();
