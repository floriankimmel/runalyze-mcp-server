# 🏃 Runalyze MCP Server

> Access your Runalyze health metrics through AI assistants using the Model Context Protocol (MCP)

A secure MCP server that lets you retrieve health data (HRV, Sleep, Resting Heart Rate, Activities) from your Runalyze account directly within AI chat applications like Claude Desktop and ChatGPT Desktop.

---

## 🎯 Choose Your Setup

This server can be used in **two ways**. Choose the option that works best for you:

<table>
<tr>
<td width="50%" valign="top">

### 🖥️ **Local Setup**
**Run on your own computer**

**Pros:**
- ✅ Complete privacy - data stays on your machine
- ✅ No internet required after setup
- ✅ Free to use
- ✅ Full control

**Cons:**
- ⚠️ Requires Node.js installation
- ⚠️ Need to build from source
- ⚠️ Only works on the computer where it's installed

**Setup time:** ~5 minutes

👉 [**Setup Locally**](#-option-1-local-setup)

</td>
<td width="50%" valign="top">

### ☁️ **Hosted Setup**
**Use our hosted server**

**Pros:**
- ✅ No installation required
- ✅ Works from any device
- ✅ Always up-to-date
- ✅ Quick 2-minute setup

**Cons:**
- ⚠️ Requires internet connection
- ⚠️ Depends on hosted service availability

**Setup time:** ~2 minutes

**Server URL:** `https://runalyze-mcp-server.fly.dev`

👉 [**Use Hosted Version**](#%EF%B8%8F-option-2-hosted-setup)

</td>
</tr>
</table>

**Security Note:** Both options are secure. The hosted version does NOT store your API token - you provide it with each request, just like the local version stores it in your config file.

---

## 📖 Table of Contents

- [Option 1: Local Setup](#-option-1-local-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configure Your AI Tool](#configure-your-ai-tool-local)
- [Option 2: Hosted Setup](#%EF%B8%8F-option-2-hosted-setup)
  - [Configure Your AI Tool](#configure-your-ai-tool-hosted)
- [What You Can Do](#-what-you-can-do)
- [Troubleshooting](#-troubleshooting)

---

# 🖥️ Option 1: Local Setup

Run the MCP server on your own computer.

## Prerequisites

Before you start, make sure you have:

- **Node.js** v18 or higher ([Download here](https://nodejs.org/))
- **Yarn** package manager ([Installation guide](https://yarnpkg.com/getting-started/install))
- A **Runalyze account** with premium access ([Get premium](https://runalyze.com/premium))
- An **AI assistant** that supports MCP (Claude Desktop, ChatGPT Desktop, VS Code extensions, etc.)

## Installation

### Step 1: Download and Build

```bash
# Clone the repository
git clone https://github.com/floriankimmel/runalyze-mcp-server.git
cd runalyze-mcp-server

# Install dependencies
yarn install

# Build the server
yarn build
```

The compiled server will be in the `dist/` directory.

### Step 2: Get Your Runalyze API Token

1. Log in to your Runalyze account
2. Go to **Settings → Personal API**: https://runalyze.com/settings/personal-api
3. Click **Generate new token**
4. Copy the token (you'll need it in the next step)

## Configure Your AI Tool (Local)

Choose your AI assistant and follow the configuration steps:

### For Claude Desktop 🟣

1. **Locate your configuration file:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Add the server configuration:**

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

3. **Replace the values:**
   - Change `/absolute/path/to/runalyze-mcp-server` to where you installed the server
   - Replace `your-api-token-here` with your Runalyze API token

4. **Restart Claude Desktop**

### For ChatGPT Desktop 🟢

1. Open ChatGPT Desktop settings
2. Navigate to **Developer Settings** → **MCP Servers**
3. Click **Add Server** and configure:
   - **Name**: `runalyze`
   - **Command**: `node`
   - **Arguments**: `/absolute/path/to/runalyze-mcp-server/dist/main.js`
   - **Environment Variables**:
     - Key: `RUNALYZE_API_TOKEN`
     - Value: `your-api-token-here`

4. Save and restart ChatGPT Desktop

### For Cline (VS Code Extension) 💙

1. Open VS Code settings (JSON)
2. Add this configuration:

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

3. Replace the path and token with your values
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

3. Replace the path and token with your values
4. Restart Continue

### For Zed Editor 🌟

1. Open Zed settings (`~/.config/zed/settings.json`)
2. Add this configuration:

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

3. Replace the path and token with your values
4. Restart Zed

---

# ☁️ Option 2: Hosted Setup

Use our hosted MCP server - no installation required!

**Server URL:** `https://runalyze-mcp-server.fly.dev`

## Get Your Runalyze API Token

1. Log in to your Runalyze account
2. Go to **Settings → Personal API**: https://runalyze.com/settings/personal-api
3. Click **Generate new token**
4. Copy the token (you'll need it in the next step)

## Configure Your AI Tool (Hosted)

Choose your AI assistant and follow the configuration steps:

### For Claude Desktop 🟣

**Note:** Claude Desktop currently only supports STDIO transport. To use the hosted version, you would need an HTTP-to-STDIO bridge. For now, we recommend using the [Local Setup](#-option-1-local-setup) with Claude Desktop.

### For ChatGPT Desktop 🟢

**Note:** Check if ChatGPT Desktop supports HTTP transport for MCP servers. If not, use the [Local Setup](#-option-1-local-setup) instead.

### For MCP Clients with HTTP Support

If your AI tool supports MCP over HTTP, configure it with:

- **Endpoint URL**: `https://runalyze-mcp-server.fly.dev/mcp`
- **Authentication**: Bearer token
- **Token**: Your Runalyze API token

**Example configuration format:**

```json
{
  "mcpServers": {
    "runalyze": {
      "url": "https://runalyze-mcp-server.fly.dev/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer YOUR_RUNALYZE_TOKEN"
      }
    }
  }
}
```

### Direct HTTP API Usage

You can also use the hosted server directly via HTTP:

**Health Check** (no authentication required):
```bash
curl https://runalyze-mcp-server.fly.dev/health
```

**Get HRV Data:**
```bash
curl -X POST https://runalyze-mcp-server.fly.dev/mcp \
  -H "Authorization: Bearer YOUR_RUNALYZE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "get-runalyze-hrv-data",
      "arguments": {"page": 1}
    }
  }'
```

**Get Activities:**
```bash
curl -X POST https://runalyze-mcp-server.fly.dev/mcp \
  -H "Authorization: Bearer YOUR_RUNALYZE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "get-runalyze-activities",
      "arguments": {"page": 1}
    }
  }'
```

**Get Activity Details:**
```bash
curl -X POST https://runalyze-mcp-server.fly.dev/mcp \
  -H "Authorization: Bearer YOUR_RUNALYZE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "get-runalyze-activity-detail",
      "arguments": {"id": 12345}
    }
  }'
```

---

## 🎯 What You Can Do

Once configured, you can ask your AI assistant questions like:

### Activities
- "Show me my recent activities from Runalyze"
- "What workouts did I log this week?"
- "Get details for activity 12345"
- "Analyze my running data from last month"

### Heart Rate Variability (HRV)
- "What's my latest HRV data?"
- "Show me my HRV trends over the past month"
- "How is my recovery looking based on HRV?"

### Sleep Data
- "Show me my sleep data from last week"
- "How many hours did I sleep last night?"
- "What's my sleep pattern this month?"

### Resting Heart Rate
- "What was my resting heart rate this morning?"
- "Show me my resting heart rate trend"
- "Is my resting heart rate improving?"

The AI will automatically fetch your data and provide insights!

### Available Tools

The server provides these tools to your AI assistant:

1. **`get-runalyze-activities`** - Get your activity list (runs, rides, workouts)
2. **`get-runalyze-activity-detail`** - Get detailed info for a specific activity
3. **`get-runalyze-hrv-data`** - Retrieve Heart Rate Variability measurements
4. **`get-runalyze-sleep-data`** - Get sleep tracking data
5. **`get-runalyze-heart-rate-rest-data`** - Get resting heart rate measurements

All tools support pagination for browsing through historical data.

---

## 🔒 Security Notes

### Local Setup
- Your API token is stored in your MCP client's configuration file on your computer
- All communication happens locally on your machine
- No data is sent to third parties
- Token is validated at startup

### Hosted Setup
- **No tokens are stored on the server**
- Each request requires your Runalyze API token in the Authorization header
- You only access your own data
- All communication is over HTTPS
- The server is stateless - it doesn't remember anything between requests

**Both options are secure.** Choose based on your preference:
- **Local** = Maximum privacy, everything on your machine
- **Hosted** = Convenience, no installation needed

---

## 🐛 Troubleshooting

### Local Setup Issues

**Server won't start**
- ✅ Check your API token is valid: https://runalyze.com/settings/personal-api
- ✅ Verify the path to `dist/main.js` is absolute and correct
- ✅ Ensure Node.js v18+ is installed: `node --version`
- ✅ Check you ran `yarn build` successfully
- ✅ Try running `node /absolute/path/to/dist/main.js` manually to see error messages

**"Configuration validation failed"**
- ✅ The `RUNALYZE_API_TOKEN` environment variable is missing in your config
- ✅ Double-check your MCP client configuration syntax (valid JSON)
- ✅ Ensure the token has no extra spaces or quotes

**No data returned**
- ✅ Verify you have data in your Runalyze account
- ✅ Check your account has premium/supporter access (required for API)
- ✅ Ensure your API token has the necessary permissions
- ✅ Try accessing https://runalyze.com/api/v1/metrics/hrv directly in your browser while logged in

**AI assistant doesn't see the tools**
- ✅ Restart your AI assistant after configuration changes
- ✅ Check the MCP server appears in the AI assistant's MCP server list
- ✅ Look for error messages in the AI assistant's logs/developer console
- ✅ Verify the JSON configuration is valid (use a JSON validator)

### Hosted Setup Issues

**Connection fails**
- ✅ Check the server is running: `curl https://runalyze-mcp-server.fly.dev/health`
- ✅ Verify you have internet connectivity
- ✅ Ensure the URL is correct: `https://runalyze-mcp-server.fly.dev/mcp`

**Authentication errors (401 Unauthorized)**
- ✅ Ensure you're including the `Authorization: Bearer YOUR_TOKEN` header
- ✅ Verify your Runalyze API token is valid and not expired
- ✅ Check there are no extra spaces in the token
- ✅ Make sure you copied the complete token from Runalyze

**404 or other errors**
- ✅ Verify the endpoint path is `/mcp` not just `/`
- ✅ Check you're using POST method, not GET
- ✅ Ensure Content-Type header is `application/json`

**AI tool doesn't support HTTP transport**
- ✅ Many MCP clients currently only support STDIO transport
- ✅ Use the [Local Setup](#-option-1-local-setup) instead
- ✅ Or use the HTTP API directly with curl/scripts

### General Issues

**Still having problems?**

1. Check your Runalyze API token at https://runalyze.com/settings/personal-api
2. Verify you have premium access: https://runalyze.com/premium
3. Review [Runalyze API Documentation](https://runalyze.com/doc/api)
4. Check [MCP Documentation](https://modelcontextprotocol.io/)
5. Open an issue on [GitHub](https://github.com/floriankimmel/runalyze-mcp-server/issues)

---

## 📚 Learn More

- 🏃 [Runalyze](https://runalyze.com/) - Training analysis platform
- 📖 [Model Context Protocol](https://modelcontextprotocol.io/) - MCP specification
- 🤖 [Claude Desktop](https://claude.ai/) - AI assistant
- 💬 [ChatGPT](https://chatgpt.com/) - AI assistant

---

## 🚀 For Developers

Want to contribute or deploy your own instance? Check out:
- [GitHub Repository](https://github.com/floriankimmel/runalyze-mcp-server)
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development setup and guidelines
- [Fly.io Deployment Guide](https://fly.io/docs/) - Host your own instance

---

## 📝 License

MIT

---

Made with ❤️ for the Runalyze community
