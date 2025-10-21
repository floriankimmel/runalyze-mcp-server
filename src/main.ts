import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create application context for STDIO transport
  // Logger is disabled to prevent interference with MCP protocol messages
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  // Initialize the application
  await app.init();

  // The application will continue running until the process exits
  // STDIO transport communicates via stdin/stdout
}

bootstrap();
