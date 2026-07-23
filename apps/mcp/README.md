# The Second Memo MCP Server 4.0

A standalone MCP (Model Context Protocol) server for The Second Memo that gives AI assistants persistent memory across conversations. Built on Cloudflare Workers with Durable Objects for scalable, persistent connections.

## Features

- **Authentication** - Supports both API keys and OAuth authentication
- **Persistent Memory** - Save and recall information across sessions
- **User Profiles** - Auto-generated profiles from stored memories
- **Project Scoping** - Organize memories by project with `x-sm-project` header
- **Analytics** - PostHog integration for usage tracking

## Setup

### Server URL

```text
https://mcp.the-second-memo.ai/mcp
```

Add to your MCP client config (Claude, Cursor, Windsurf, VS Code, etc.):

```json
{
  "mcpServers": {
    "the-second-memo": {
      "url": "https://mcp.the-second-memo.ai/mcp"
    }
  }
}
```

The server uses OAuth authentication by default. Your MCP client will automatically discover the authorization server via `/.well-known/oauth-protected-resource` and prompt you to authenticate.

### API Key Authentication (Alternative)

If you prefer to use an API key instead of OAuth, you can pass it directly in the `Authorization` header. Get your API key from [app.the-second-memo.ai](https://app.the-second-memo.ai):

```json
{
  "mcpServers": {
    "the-second-memo": {
      "url": "https://mcp.the-second-memo.ai/mcp",
      "headers": {
        "Authorization": "Bearer sm_your_api_key_here"
      }
    }
  }
}
```

API keys start with `sm_` and are automatically detected. When an API key is provided, OAuth authentication is skipped.

### Project Scoping (Optional)

To scope all operations to a specific project, add the `x-sm-project` header:

```json
{
  "mcpServers": {
    "the-second-memo": {
      "url": "https://mcp.the-second-memo.ai/mcp",
      "headers": {
        "x-sm-project": "your-project-id"
      }
    }
  }
}
```

## Tools

### `memory`

Save or forget information about the user.

```json
{
  "content": "User prefers dark mode and uses TypeScript",
  "action": "save",
  "containerTag": "optional-project-tag"
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `content` | string | Yes | The memory content to save or forget |
| `action` | `"save"` \| `"forget"` | No | Default: `"save"` |
| `containerTag` | string | No | Project tag to scope the memory |

### `recall`

Search memories and get user profile.

```json
{
  "query": "What are the user's programming preferences?",
  "includeProfile": true,
  "containerTag": "optional-project-tag"
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query to find relevant memories |
| `includeProfile` | boolean | No | Include user profile summary. Default: `true` |
| `containerTag` | string | No | Project tag to scope the search |

### `listMemories`

Enumerate stored memories grouped by their source document, newest first. Returns only the extracted memory facts — never document content — so responses stay small enough for client output limits. Use it to audit what is on file (e.g. before forgetting stale memories); use `recall` for topic-based search.

```json
{
  "page": 1,
  "limit": 10,
  "containerTag": "optional-project-tag"
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (1-based). Default: `1` |
| `limit` | integer | No | Documents per page, each grouping its extracted memories. Default: `10`, max: `50` |
| `containerTag` | string | No | Project tag to scope the listing |

### `whoAmI`

Get the current logged-in user's information.

```json
{}
```

Returns: `{ userId, email, name, client, sessionId }`

## Resources

| URI | Description |
|-----|-------------|
| `the-second-memo://profile` | User profile with stable preferences and recent activity |
| `the-second-memo://projects` | List of available memory projects |

## Prompts

| Name | Description |
|------|-------------|
| `context` | User profile and preferences for system context injection |

## Development

### Prerequisites

- [Bun](https://bun.sh/) or Node.js
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Install Dependencies

```bash
bun install
```

### Environment Variables

Create a `.dev.vars` file:

```env
API_URL=http://localhost:8787
or 
API_URL=https://api.the-second-memo.ai
```

| Variable | Description | Default |
|----------|-------------|---------|
| `API_URL` | Main The Second Memo API URL for OAuth validation | `https://api.the-second-memo.ai` |

### Run Locally

```bash
bun run dev
```

The server will start at `http://localhost:8788`.

**Note:** For local development, you also need the main The Second Memo API running at the `API_URL` for OAuth token validation.

### End-to-End Tests

The `e2e/` suite drives a real MCP server over streamable HTTP (no mocks) and asserts the
core journey: handshake → tool/resource/prompt discovery → `whoAmI` → `listProjects` →
`memory` save → `recall` round-trip, plus `memory-graph`/`fetch-graph-data`, resource reads,
the `context` prompt, container-tag isolation, and auth rejections.

```bash
export SECONDMEMO_API_KEY=sm_...                          # staging key (required; tests skip without it)
export SECONDMEMO_MCP_URL=https://mcp.the-second-memo.ai/mcp  # optional, this is the default
export SECONDMEMO_API_URL=https://api.the-second-memo.ai      # optional, OAuth authorization server
bun run test:e2e
```

| File | Covers |
|------|--------|
| `e2e/auth.test.ts` | `GET /` info, OAuth discovery, 401 on missing/invalid token (runs without a key) |
| `e2e/oauth.test.ts` | OAuth discovery chain, dynamic client registration, token-endpoint negatives, real refresh→access token round-trip |
| `e2e/discovery.test.ts` | handshake, tools/resources/prompts listing, `whoAmI`, `listProjects` |
| `e2e/memory.test.ts` | save→recall round-trip, profile variants, `forget`, container scoping, bad args |
| `e2e/list-memories.test.ts` | `listMemories` discovery, save→list round-trip, pagination, arg validation |
| `e2e/root-scope.test.ts` | `x-sm-project` header strips the `containerTag` param and scopes the whole connection |
| `e2e/graph.test.ts` | `memory-graph`, `fetch-graph-data`, resource reads, `context` prompt |

#### OAuth flow tests

`mcp.the-second-memo.ai` is an OAuth **resource server**; the **authorization server** is the main
API (`api.the-second-memo.ai`, better-auth). `oauth.test.ts` covers the real flow in tiers:

- **A–C (no secrets)** — discovery chain, dynamic client registration, and token/authorize
  negatives. These exercise the protocol wiring with no key and no browser, so they always run.
- **D (real token)** — exchanges a seeded `refresh_token` for an `access_token` and connects to
  `/mcp` with it, exercising the OAuth-token validation path (not the `sm_` API-key path). It
  **skips** unless both env vars below are set.

```bash
# One-time capture (opens a browser for login + consent, prints the env vars):
bun e2e/capture-oauth-token.ts
export SECONDMEMO_MCP_CLIENT_ID=...
export SECONDMEMO_MCP_REFRESH_TOKEN=...
```

Notes:
- Tests **skip** (not fail) without `SECONDMEMO_API_KEY`; Tier D OAuth tests skip without the
  refresh-token env vars — so CI is safe without secrets.
- `recall` is eventually-consistent (save → ingestion pipeline → memories), so the round-trip
  **polls up to ~90s**. `forget` removal is slower still and is asserted as best-effort.
- The suite uses unique per-run markers and forgets them in teardown to avoid polluting the account.

### Deploy

```bash
bun run deploy
```

## Architecture

```
┌─────────────────┐  OAuth/API Key ┌──────────────────┐
│   MCP Client    │◄──────────────►│  The Second Memo API │
│ (Claude, Cursor)│                │  (api.the-second-memo.ai)
└────────┬────────┘                └──────────────────┘
         │                                   ▲
         │ MCP Protocol                      │ Auth Validation
         ▼                                   │
┌─────────────────────────────────────────────────────┐
│            The Second Memo MCP Server                   │
│         (mcp.the-second-memo.ai/mcp)                   │
│  ┌─────────────────────────────────────────────┐   │
│  │           Cloudflare Durable Object          │   │
│  │  • Session state                             │   │
│  │  • Client info persistence                   │   │
│  │  • MCP protocol handling                     │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

- **Runtime:** Cloudflare Workers
- **State:** Durable Objects with SQLite
- **Framework:** Hono
- **MCP SDK:** @modelcontextprotocol/sdk + agents
- **API Client:** the-second-memo SDK
- **Analytics:** PostHog

