export const CHATGPT_REMOTE_MCP_URL = "https://mcp.the-second-memo.ai/mcp"

export const SECONDMEMO_MCP_OAUTH_JSON = `{
  "mcpServers": {
    "the-second-memo": {
      "url": "${CHATGPT_REMOTE_MCP_URL}"
    }
  }
}`

export const ANTIGRAVITY_MCP_SNIPPET = `{
    "mcpServers": {
        "the-second-memo": {
            "serverUrl": "${CHATGPT_REMOTE_MCP_URL}"
        }
    }
}`

export function buildMcpUrlRemoteJson(apiKeyPlaceholder: string) {
	return `{
  "the-second-memo-mcp": {
    "command": "npx",
    "args": ["-y", "mcp-remote", "https://mcp.the-second-memo.ai/mcp"],
    "env": {},
    "headers": {
      "Authorization": "Bearer ${apiKeyPlaceholder}"
    }
  }
}`
}

export const CODEX_MCP_TOML = `[mcp_servers.the-second-memo]
command = "npx"
args = ["-y", "mcp-remote@latest", "https://mcp.the-second-memo.ai/mcp"]
`

/** Full file merge target: Claude Desktop `claude_desktop_config.json` → `mcpServers`. */
export const CLAUDE_DESKTOP_MCP_SNIPPET = `{
  "mcpServers": {
    "the-second-memo": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@latest",
        "https://mcp.the-second-memo.ai/mcp"
      ]
    }
  }
}`

export type ManualInstallEntry =
	| { kind: "file"; paths: string; snippet: string; format: "json" | "toml" }
	| { kind: "chatgpt" }
	| { kind: "generic-remote" }
	| { kind: "claude-desktop-timeline" }

export function getManualInstallEntry(clientKey: string): ManualInstallEntry {
	switch (clientKey) {
		case "chatgpt":
			return { kind: "chatgpt" }
		case "mcp-url":
			return { kind: "generic-remote" }
		case "antigravity":
			return {
				kind: "file",
				paths:
					"Antigravity: ~/.gemini/config/mcp_config.json. Merge the block into your existing [mcp_servers] section.",
				snippet: ANTIGRAVITY_MCP_SNIPPET,
				format: "json",
			}
		case "codex":
			return {
				kind: "file",
				paths:
					"Codex: ~/.codex/config.toml (or $CODEX_HOME/config.toml). Merge the block into your existing [mcp_servers] section.",
				snippet: CODEX_MCP_TOML,
				format: "toml",
			}
		case "cursor":
			return {
				kind: "file",
				paths:
					"Cursor: ~/.cursor/mcp.json globally, or .cursor/mcp.json in your project.",
				snippet: SECONDMEMO_MCP_OAUTH_JSON,
				format: "json",
			}
		case "vscode":
			return {
				kind: "file",
				paths:
					"VS Code: macOS ~/Library/Application Support/Code/User/mcp.json · Windows %APPDATA%\\Code\\User\\mcp.json · Linux ~/.config/Code/User/mcp.json.",
				snippet: SECONDMEMO_MCP_OAUTH_JSON,
				format: "json",
			}
		case "cline":
			return {
				kind: "file",
				paths:
					"Cline: VS Code user folder → globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json.",
				snippet: SECONDMEMO_MCP_OAUTH_JSON,
				format: "json",
			}
		case "claude":
			return { kind: "claude-desktop-timeline" }
		case "claude-code":
			return {
				kind: "file",
				paths:
					"Claude Code: ~/.claude.json (user) or .mcp.json in the project root.",
				snippet: SECONDMEMO_MCP_OAUTH_JSON,
				format: "json",
			}
		case "gemini-cli":
			return {
				kind: "file",
				paths:
					"Gemini CLI: ~/.gemini/settings.json (or project .gemini/settings.json).",
				snippet: SECONDMEMO_MCP_OAUTH_JSON,
				format: "json",
			}
		default:
			return {
				kind: "file",
				paths: "Open your client's MCP settings file (see its documentation).",
				snippet: SECONDMEMO_MCP_OAUTH_JSON,
				format: "json",
			}
	}
}
