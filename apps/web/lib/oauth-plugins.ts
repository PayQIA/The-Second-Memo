// OAuth-connectable plugins, mirroring the `authMethod: "oauth"` entries in mono's packages/lib/plugins.ts.
// `oauthClientId` is the stable first-party client id (omitted for Cursor — it self-registers via DCR).
export interface OAuthPluginInfo {
	id: string
	oauthClientId?: string
	name: string
	description: string
	icon: string
	docsUrl: string
}

export const OAUTH_PLUGINS: OAuthPluginInfo[] = [
	{
		id: "claude_code",
		oauthClientId: "the-second-memo-claude-code",
		name: "Claude Code",
		description:
			"Persistent memory for Claude Code — recalls your coding context, patterns and decisions across sessions.",
		icon: "/images/plugins/claude-code.svg",
		docsUrl: "https://the-second-memo.ai/docs/integrations/claude-code",
	},
	{
		id: "opencode",
		oauthClientId: "the-second-memo-opencode",
		name: "OpenCode",
		description:
			"Memory layer for OpenCode — semantic search across sessions and automatic context injection.",
		icon: "/images/plugins/opencode.svg",
		docsUrl: "https://the-second-memo.ai/docs/integrations/opencode",
	},
	{
		id: "openclaw",
		oauthClientId: "the-second-memo-openclaw",
		name: "OpenClaw",
		description:
			"Multi-platform memory for OpenClaw — persistence across Telegram, WhatsApp, Discord, Slack and more.",
		icon: "/images/plugins/openclaw.svg",
		docsUrl: "https://the-second-memo.ai/docs/integrations/openclaw",
	},
	{
		id: "codex",
		oauthClientId: "the-second-memo-codex",
		name: "OpenAI Codex",
		description:
			"Persistent memory for the OpenAI Codex CLI — recalls coding context and decisions across projects.",
		icon: "/images/plugins/codex.png",
		docsUrl: "https://the-second-memo.ai/docs/integrations/codex",
	},
	{
		id: "cursor",
		name: "Cursor",
		description:
			"Persistent AI memory for Cursor via the The Second Memo MCP server. Connect from Cursor's MCP setup.",
		icon: "/images/plugins/cursor.png",
		docsUrl: "https://the-second-memo.ai/docs/the-second-memo-mcp/setup",
	},
]
