# 🏃 Runalyze MCP Server

> Access your Runalyze health metrics through AI assistants using the Model Context Protocol (MCP)

A secure MCP server that lets you retrieve health data (HRV, Sleep, Resting Heart Rate) from your Runalyze account directly within AI chat applications like Claude Desktop and ChatGPT Desktop.

---

## 📖 Table of Contents

- [For Users](#-for-users)
  - [What is this?](#-what-is-this)
  - [Prerequisites](#-prerequisites)
  - [Installation](#-installation)
  - [Configuration](#-configuration)
  - [Usage](#-usage)
- [Deployment](#-deployment)
  - [Fly.io Deployment](#flyio-deployment)
  - [Using the HTTP Server](#using-the-http-server)
- [For Developers](#-for-developers)
  - [Development Setup](#development-setup)
  - [Project Structure](#project-structure)
  - [Testing](#testing)
  - [Code Quality](#code-quality)
  - [Creating New Tools](#creating-new-tools)

---

# 👤 For Users

## 🤔 What is this?

This MCP server allows AI assistants to retrieve health metrics from Runalyze. Once configured, you can ask questions like:

- "What's my latest HRV data?"
- "Show me my sleep data from last week"
- "What was my resting heart rate this morning?"
- "Analyze my HRV trends over the past month"

The AI will automatically fetch your data and provide insights!

## ✅ Prerequisites

- **Node.js** v18 or higher ([Download here](https://nodejs.org/))
- **Yarn** package manager ([Installation guide](https://yarnpkg.com/getting-started/install))
- A **Runalyze account** with premium access (for API access)
- An **AI assistant** that supports MCP (Claude Desktop, ChatGPT Desktop, etc.)

## 📥 Installation

### Step 1: Download the Server

```bash
# Clone the repository
git clone https://github.com/floriankimmel/runalyze-mcp-server.git
cd runalyze-mcp-server

# Install dependencies
yarn install

# Build the server
yarn build
```

### Step 2: Get Your Runalyze API Token

1. Log in to your Runalyze account
2. Navigate to **Settings → Personal API**: https://runalyze.com/settings/personal-api
3. Generate a new API token
4. Copy the token (you'll need it in the next step)

## ⚙️ Configuration

### For Claude Desktop 🟣

1. Open your Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. Add the Runalyze MCP server configuration:

```json
{
  "mcpServers": {
    "runalyze": {
      "command": "node",
      "args": [
        "/absolute/path/to/runalyze-mcp-server/dist/main.js"
      ],
      "env": {
        "RUNALYZE_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

3. Replace `/absolute/path/to/runalyze-mcp-server` with the actual path where you installed the server
4. Replace `your-api-token-here` with your Runalyze API token
5. Restart Claude Desktop

### For ChatGPT Desktop 🟢

1. Open ChatGPT Desktop settings
2. Navigate to **Developer Settings** → **MCP Servers**
3. Click **Add Server** and configure:
   - **Name**: `runalyze`
   - **Command**: `node`
   - **Arguments**: `/absolute/path/to/runalyze-mcp-server/dist/main.js`
   - **Environment Variables**:
     - `RUNALYZE_API_TOKEN`: `your-api-token-here`

4. Replace the path and token with your actual values
5. Save and restart ChatGPT Desktop

### For Cline (VS Code Extension) 💙

1. Open VS Code settings (JSON)
2. Add the MCP server configuration:

```json
{
  "mcp.servers": {
    "runalyze": {
      "command": "node",
      "args": [
        "/absolute/path/to/runalyze-mcp-server/dist/main.js"
      ],
      "env": {
        "RUNALYZE_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

3. Replace the path and token with your actual values
4. Reload VS Code

### For Continue (VS Code Extension) 🔵

1. Open Continue configuration file (`~/.continue/config.json`)
2. Add to the `mcpServers` array:

```json
{
  "mcpServers": [
    {
      "name": "runalyze",
      "command": "node",
      "args": [
        "/absolute/path/to/runalyze-mcp-server/dist/main.js"
      ],
      "env": {
        "RUNALYZE_API_TOKEN": "your-api-token-here"
      }
    }
  ]
}
```

3. Replace the path and token with your actual values
4. Restart Continue

### For Zed Editor 🌟

1. Open Zed settings (`~/.config/zed/settings.json`)
2. Add the MCP server configuration:

```json
{
  "mcp": {
    "servers": {
      "runalyze": {
        "command": "node",
        "args": [
          "/absolute/path/to/runalyze-mcp-server/dist/main.js"
        ],
        "env": {
          "RUNALYZE_API_TOKEN": "your-api-token-here"
        }
      }
    }
  }
}
```

3. Replace the path and token with your actual values
4. Restart Zed

## 🚀 Usage

Once configured, you can use the following tools in your AI assistant:

### `get-runalyze-activities`

Retrieves a list of activities from your Runalyze account.

**Parameters:**
- `page` (optional): Page number for pagination (default: 1)

**Example prompts:**
- "Get my activities from Runalyze"
- "Show me my recent workouts"
- "What activities did I log this week?"

**Response includes:**
- Activity ID and title
- Sport type and activity type
- Date, time, and timezone information
- Distance, duration, and elapsed time
- Elevation data (up, down, climb score)
- Heart rate metrics (avg, max, recovery)
- VO2max estimates and training metrics
- Power data (for cycling)
- Running dynamics (cadence, vertical oscillation, ground contact time, etc.)
- Cycling metrics (balance, torque effectiveness, pedal smoothness, etc.)
- Weather conditions (temperature, wind, humidity, etc.)
- Race results (if applicable)
- Equipment and tags
- Climb information

### `get-runalyze-activity-detail`

Retrieves detailed information for a specific activity by ID from your Runalyze account.

**Parameters:**
- `id` (required): The activity ID to retrieve

**Example prompts:**
- "Get details for activity 12345"
- "Show me the full details of my run with ID 12345"
- "What are the metrics for activity 12345?"

**Response includes:**
All the same detailed information as `get-runalyze-activities`, but for a single specific activity. This is useful when you know the activity ID and want complete details about that particular workout.

### `get-runalyze-hrv-data`

Retrieves Heart Rate Variability (HRV) data from your Runalyze account.

**Parameters:**
- `page` (optional): Page number for pagination (default: 1)

**Example prompts:**
- "Get my HRV data from Runalyze"
- "Show me page 2 of my HRV measurements"
- "What does my recent HRV data look like?"

**Response includes:**
- HRV measurement ID
- Date and time of measurement
- Metric value (e.g., RMSSD)
- Measurement type

### `get-runalyze-sleep-data`

Retrieves sleep data from your Runalyze account.

**Parameters:**
- `page` (optional): Page number for pagination (default: 1)

**Example prompts:**
- "Get my sleep data from Runalyze"
- "Show me my sleep patterns for the last month"
- "How many hours did I sleep last week?"

**Response includes:**
- Sleep measurement ID
- Date and time
- Metric value (e.g., hours slept)
- Measurement type

### `get-runalyze-heart-rate-rest-data`

Retrieves resting heart rate data from your Runalyze account.

**Parameters:**
- `page` (optional): Page number for pagination (default: 1)

**Example prompts:**
- "Get my resting heart rate data"
- "What was my resting heart rate this morning?"
- "Show me my resting heart rate trend over the past week"

**Response includes:**
- Resting heart rate measurement ID
- Date and time
- Metric value (beats per minute)
- Measurement type

## 🔒 Security Notes

- Your API token is stored securely in your MCP client's configuration
- The server validates the token at startup - it won't run without a valid token
- All communication happens locally on your machine
- No data is sent to third parties

## 🐛 Troubleshooting

### Server won't start
- **Check your API token**: Make sure it's valid and has the correct permissions
- **Verify the path**: Ensure the path to `dist/main.js` is absolute and correct
- **Check Node.js version**: Must be v18 or higher (`node --version`)

### "Configuration validation failed"
- This means the `RUNALYZE_API_TOKEN` environment variable is missing or empty
- Double-check your MCP client configuration

### No data returned
- Ensure you have the relevant health data in your Runalyze account
- Check that your account has premium/supporter access (required for API access)
- Verify your API token has the necessary permissions

---

# 🚢 Deployment

This MCP server supports two deployment modes:
- **STDIO Mode** (local): Communicates via stdin/stdout for local AI assistants
- **HTTP Mode** (hosted): Runs as an HTTP API that can be deployed to cloud platforms

## Architecture Overview

### STDIO Mode (Local)
- Entry point: `src/main.ts`
- Module: `src/app.module.ts`
- Transport: STDIO (stdin/stdout)
- Authentication: API token from environment variable (`RUNALYZE_API_TOKEN`)
- Use case: Personal use with Claude Desktop, ChatGPT Desktop, VS Code extensions

### HTTP Mode (Hosted)
- Entry point: `src/main-http.ts`
- Module: `src/app-http.module.ts`
- Transport: HTTP (standard REST API)
- Authentication: Bearer token in Authorization header (per-request)
- Use case: Multi-user hosted service, API access, cloud deployment

Both modes share the same tool implementations and business logic. The only difference is:
1. **Authentication**: STDIO uses env var, HTTP uses Bearer token
2. **Transport**: STDIO uses stdin/stdout, HTTP uses standard HTTP

## Fly.io Deployment

The server can be deployed to Fly.io for hosted access via HTTP transport.

### Prerequisites

- Fly.io account ([Sign up here](https://fly.io/))
- Fly.io CLI installed (`brew install flyctl` on macOS)
- Authenticated with Fly.io (`flyctl auth login`)

### Authentication Model

**Important:** The HTTP server uses Bearer token authentication. Each user must provide their own Runalyze API token when making requests:

```
Authorization: Bearer YOUR_RUNALYZE_TOKEN
```

This means:
- The server itself does NOT store any API tokens
- Each user authenticates with their own Runalyze credentials
- Multiple users can use the same deployed server with their own tokens
- No secrets need to be configured on Fly.io

### Initial Setup

The Fly.io app has been pre-configured as `runalyze-mcp-server`. To deploy:

```bash
# Ensure you're in the project directory
cd runalyze-mcp-server

# Deploy to Fly.io
fly deploy
```

The deployment will:
1. Build a Docker image with the HTTP server
2. Deploy to Fly.io with auto-scaling enabled
3. Configure health checks
4. Enable Bearer token authentication

### Configuration

The `fly.toml` file contains all deployment configuration:
- **Region**: Amsterdam (ams) - can be changed
- **Resources**: 256MB RAM, 1 shared CPU
- **Auto-scaling**: Scales to zero when idle, auto-starts on request
- **Health checks**: HTTP GET on `/health` endpoint
- **Authentication**: Bearer token required (no secrets stored)

### Automated Deployment with GitHub Actions

The repository includes a GitHub Actions workflow that automatically deploys to Fly.io on every push to the `main` branch.

#### Setup GitHub Actions

1. Get your Fly.io API token:
   ```bash
   fly auth token
   ```

2. Add the token as a GitHub secret:
   - Go to your repository on GitHub
   - Navigate to **Settings → Secrets and variables → Actions**
   - Click **New repository secret**
   - Name: `FLY_API_TOKEN`
   - Value: Your Fly.io API token
   - Click **Add secret**

3. Push to main branch:
   ```bash
   git push origin main
   ```

The workflow will automatically:
- Build the Docker image
- Deploy to Fly.io
- Run health checks
- Report deployment status

#### Manual Deployment Trigger

You can also trigger deployment manually:
- Go to **Actions** tab in GitHub
- Select **Deploy to Fly.io** workflow
- Click **Run workflow**

### Monitoring

```bash
# View logs
fly logs -a runalyze-mcp-server

# Check app status
fly status -a runalyze-mcp-server

# Open app dashboard
fly dashboard -a runalyze-mcp-server
```

### Scaling

```bash
# Scale to specific machine count
fly scale count 1 -a runalyze-mcp-server

# Update memory/CPU
fly scale memory 512 -a runalyze-mcp-server
```

## Using the HTTP Server

### Local Development

Run the HTTP server locally:

```bash
# Development mode with hot-reload
yarn start:http:dev

# Production mode
yarn build:http
yarn start:http
```

The server will be available at `http://localhost:3000`.

### HTTP Endpoints

- **Health Check**: `GET /health` - Returns server status (no auth required)
- **MCP HTTP Endpoint**: `/mcp` - HTTP endpoint for MCP communication (requires Bearer token)

### Authentication

All MCP endpoints require Bearer token authentication. Include your Runalyze API token in the Authorization header:

```bash
# Example: Get HRV data
curl -X POST https://runalyze-mcp-server.fly.dev/mcp \
  -H "Authorization: Bearer YOUR_RUNALYZE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/call","params":{"name":"get-runalyze-hrv-data","arguments":{"page":1}}}'
```

### Connecting AI Clients to HTTP Server

To use the hosted HTTP version with MCP clients that support HTTP transport:

1. **Endpoint URL**: `https://runalyze-mcp-server.fly.dev/mcp`
2. **Authentication**: Include `Authorization: Bearer YOUR_RUNALYZE_TOKEN` header
3. **Get Token**: Visit https://runalyze.com/settings/personal-api

Note: Not all MCP clients support HTTP transport yet. Check your client's documentation.

### Multi-User Support

The HTTP deployment supports multiple users:
- Each user provides their own Runalyze API token
- No shared credentials or server-side token storage
- Users only access their own Runalyze data
- Stateless authentication for scalability

---

# 👨‍💻 For Developers

## Development Setup

### Prerequisites
- Node.js v18 or higher
- Yarn package manager
- Basic knowledge of TypeScript and NestJS

### Getting Started

```bash
# Clone the repository
git clone https://github.com/floriankimmel/runalyze-mcp-server.git
cd runalyze-mcp-server

# Install dependencies (this also sets up the pre-commit hook)
yarn install

# Start development server with hot-reload
yarn start:dev
```

**Note**: The `yarn install` command automatically sets up a pre-commit hook using Husky. This hook runs ESLint and Prettier on staged files before each commit to ensure code quality.

### Build

Compile TypeScript to JavaScript:

```bash
yarn build
```

Output will be in the `dist/` directory.

## Project Structure

```
runalyze-mcp-server/
├── src/
│   ├── config/
│   │   └── configuration.ts                    # Configuration with Zod validation
│   ├── tools/
│   │   ├── __tests__/                          # Co-located tests
│   │   │   ├── runalyze-hrv.tool.integration.ts
│   │   │   ├── runalyze-sleep.tool.integration.ts
│   │   │   └── runalyze-heart-rate-rest.tool.integration.ts
│   │   ├── runalyze-hrv.tool.ts                # HRV data retrieval tool
│   │   ├── runalyze-sleep.tool.ts              # Sleep data retrieval tool
│   │   └── runalyze-heart-rate-rest.tool.ts    # Resting heart rate tool
│   ├── app.module.ts                           # Root module (STDIO mode)
│   ├── app-http.module.ts                      # Root module (HTTP mode)
│   ├── main.ts                                 # Application entry point (STDIO mode)
│   └── main-http.ts                            # Application entry point (HTTP mode)
├── .github/
│   └── workflows/
│       └── deploy.yml                          # GitHub Actions deployment workflow
├── dist/                                       # Compiled output (generated)
├── coverage/                                   # Test coverage reports (generated)
├── Dockerfile                                  # Docker configuration for HTTP deployment
├── .dockerignore                               # Docker ignore file
├── fly.toml                                    # Fly.io configuration
├── .eslintrc.js                                # ESLint configuration
├── .prettierrc                                 # Prettier configuration
├── jest.config.js                              # Jest configuration
├── tsconfig.json                               # TypeScript configuration
└── package.json                                # Dependencies and scripts
```

## Testing

### Run Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:cov
```

### Writing Tests

Tests are co-located with the source files in `__tests__/` directories:

```
src/tools/
├── __tests__/
│   └── my-tool.integration.ts
└── my-tool.tool.ts
```

Example test structure:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MyTool } from '../my-tool.tool';

describe('MyTool', () => {
  let tool: MyTool;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          'runalyze.apiToken': 'test-token',
          'runalyze.baseUrl': 'https://runalyze.com',
        };
        return config[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyTool,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    tool = module.get<MyTool>(MyTool);
  });

  it('should be defined', () => {
    expect(tool).toBeDefined();
  });
});
```

## Code Quality

### Linting

```bash
# Check for linting issues
yarn lint

# Auto-fix linting issues
yarn lint:fix
```

### Formatting

```bash
# Format code with Prettier
yarn format
```

### Pre-commit Hook

The project uses Husky and lint-staged to enforce code quality. Before each commit:

1. ESLint runs on staged TypeScript files and attempts to auto-fix issues
2. Prettier formats the code
3. If any errors remain, the commit is blocked

This ensures only properly linted code is committed to the repository.

## Creating New Tools

### Step 1: Create the Tool File

Create a new file in `src/tools/`, e.g., `my-tool.tool.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Tool, Context } from '@rekog/mcp-nest';
import { z } from 'zod';
import type { AppConfig } from '../config/configuration';

// Define parameter schema with Zod
const myToolSchema = z.object({
  param1: z.string().describe('Description of param1'),
  param2: z.number().optional().describe('Optional number parameter'),
});

@Injectable()
export class MyTool {
  constructor(private readonly configService: ConfigService<AppConfig>) {
    // Access configuration if needed
  }

  @Tool({
    name: 'my-tool-name',
    description: 'What your tool does',
    parameters: myToolSchema,
  })
  async execute(
    params: z.infer<typeof myToolSchema>,
    context: Context,
  ): Promise<string> {
    // Report progress
    await context.reportProgress({ progress: 0, total: 100 });

    // Your tool logic here
    const result = {
      message: 'Success',
      data: params,
    };

    await context.reportProgress({ progress: 100, total: 100 });

    return JSON.stringify(result, null, 2);
  }
}
```

### Step 2: Register the Tool

Add your tool to `src/app.module.ts`:

```typescript
import { MyTool } from './tools/my-tool.tool';

@Module({
  imports: [
    ConfigModule.forRoot({ ... }),
    McpModule.forRoot({ ... }),
  ],
  providers: [
    RunalyzeHrvTool,
    RunalyzeSleepTool,
    RunalyzeHeartRateRestTool,
    MyTool, // Add your new tool here
  ],
})
export class AppModule {}
```

### Step 3: Write Tests

Create `src/tools/__tests__/my-tool.integration.ts` and write comprehensive tests.

### Step 4: Build and Test

```bash
yarn build
yarn test
```

## Environment Configuration

Configuration is managed through `src/config/configuration.ts` using Zod for validation:

```typescript
const configSchema = z.object({
  runalyze: z.object({
    apiToken: z.string().min(1, 'RUNALYZE_API_TOKEN is required'),
    baseUrl: z.string().url().default('https://runalyze.com'),
  }),
});
```

The application will fail to start if required environment variables are missing.

## Available Scripts

| Command | Description |
|---------|-------------|
| `yarn build` | Compile TypeScript to JavaScript (STDIO mode) |
| `yarn build:http` | Compile TypeScript to JavaScript (HTTP mode) |
| `yarn start` | Run the compiled application (STDIO mode) |
| `yarn start:http` | Run the compiled application (HTTP mode) |
| `yarn start:dev` | Run in development mode with hot-reload (STDIO) |
| `yarn start:http:dev` | Run in development mode with hot-reload (HTTP) |
| `yarn test` | Run all tests |
| `yarn test:watch` | Run tests in watch mode |
| `yarn test:cov` | Generate test coverage report |
| `yarn lint` | Check for linting issues |
| `yarn lint:fix` | Auto-fix linting issues |
| `yarn format` | Format code with Prettier |

## Technology Stack

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[@rekog/mcp-nest](https://github.com/rekog-labs/MCP-Nest)** - NestJS MCP integration
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Jest](https://jestjs.io/)** - Testing framework
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

## Learn More

- 📚 [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- 🏃 [Runalyze API Documentation](https://runalyze.com/doc/api)
- 🎯 [MCP-Nest GitHub](https://github.com/rekog-labs/MCP-Nest)
- 📖 [NestJS Documentation](https://docs.nestjs.com/)
- ✅ [Zod Documentation](https://zod.dev/)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`yarn test`)
5. Ensure code quality checks pass (`yarn lint && yarn format`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

MIT

---

Made with ❤️ for the Runalyze community
