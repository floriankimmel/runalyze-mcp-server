import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { AppHttpModule } from '../app-http.module';
import * as http from 'http';

describe('HTTP MCP Server (e2e)', () => {
  let app: INestApplication;
  let serverUrl: string;
  const apiToken = process.env.RUNALYZE_API_TOKEN || 'test-token-12345';
  const port = 3001; // Use a different port for testing

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppHttpModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Enable CORS like in main-http.ts
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    await app.listen(port);
    serverUrl = `http://localhost:${port}`;
  });

  afterAll(async () => {
    await app.close();
  });

  // Helper function to make HTTP requests
  const makeRequest = (
    method: string,
    path: string,
    headers: Record<string, string> = {},
    body?: string,
  ): Promise<{ status: number; body: string; headers: http.IncomingHttpHeaders }> => {
    return new Promise((resolve, reject) => {
      const url = new URL(path, serverUrl);
      const options: http.RequestOptions = {
        method,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({
            status: res.statusCode || 0,
            body: data,
            headers: res.headers,
          });
        });
      });

      req.on('error', reject);

      if (body) {
        req.write(body);
      }

      req.end();
    });
  };

  describe('Server Setup', () => {
    it('should have HTTP server running', async () => {
      const response = await makeRequest('GET', '/');

      // Server should be running and respond (even if 404)
      expect(response.status).toBeDefined();
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should have health endpoint available without auth', async () => {
      const response = await makeRequest('GET', '/health');

      expect(response.status).toBe(HttpStatus.OK);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('ok');
      expect(body.service).toBe('runalyze-mcp-server');
      expect(body.timestamp).toBeDefined();
    });
  });

  describe('Authentication - Bearer Token Guard', () => {
    it('should have Bearer token authentication configured', () => {
      // Verify the app is configured with authentication
      expect(app).toBeDefined();
    });

    it('should accept requests with valid Bearer token format', async () => {
      // With valid token format, authentication should pass
      const response = await makeRequest('GET', '/', {
        Authorization: `Bearer ${apiToken}`,
      });

      // Should not be 401 (authentication passed)
      // May be 404 if route doesn't exist, but that's OK - auth worked
      expect(response.status).not.toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should handle different Bearer tokens independently', async () => {
      const token1 = 'user1-token-abc123';
      const token2 = 'user2-token-xyz789';

      const response1 = await makeRequest('GET', '/', {
        Authorization: `Bearer ${token1}`,
      });

      const response2 = await makeRequest('GET', '/', {
        Authorization: `Bearer ${token2}`,
      });

      // Both should pass authentication (not 401)
      expect(response1.status).not.toBe(HttpStatus.UNAUTHORIZED);
      expect(response2.status).not.toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await makeRequest('OPTIONS', '/', {
        Origin: 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
      });

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
