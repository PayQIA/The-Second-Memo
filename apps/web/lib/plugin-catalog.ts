export interface InstallStep {
	title: string
	description?: string
	code?: string
	copyLabel?: string
	optional?: boolean
	/** Blur the code block until hovered/focused (e.g. it contains the key). */
	secret?: boolean
}

export interface PluginInfo {
	id: string
	name: string
	tagline: string
	icon: string
	docsUrl?: string
	githubUrl?: string
	usesOAuth?: boolean
	/** Steps shown after a key is minted. The literal `sm_...` is replaced
	 *  with the freshly generated key when rendered. */
	installSteps?: InstallStep[]
}

/** All plugins are free-tier. Match mono `packages/lib/plugins.ts`. */
export const FREE_TIER_PLUGIN_IDS = [
	"claude_code",
	"codex",
	"cursor",
	"opencode",
	"openclaw",
	"hermes",
]

export function isFreeTierPlugin(pluginId: string): boolean {
	return FREE_TIER_PLUGIN_IDS.includes(pluginId)
}

export const PLUGIN_CATALOG: Record<string, PluginInfo> = {
	claude_code: {
		id: "claude_code",
		name: "Claude Code",
		tagline: "Remembers your conventions, decisions, and project context",
		icon: "/images/plugins/claude-code.svg",
		docsUrl: "https://the-second-memo.ai/docs/integrations/claude-code",
		installSteps: [
			{
				title: "Save your API key",
				description:
					"Add this to your shell profile so Claude Code can authenticate. This key is shown only once — save it now.",
				code: 'export SECONDMEMO_CC_API_KEY="sm_..."',
				copyLabel: "API key",
				secret: true,
			},
			{
				title: "Install the plugin",
				description: "Run these commands inside a Claude Code session:",
				code: "/plugin marketplace add the-second-memoai/claude-the-second-memo\n/plugin install the-second-memo",
			},
		],
	},
	codex: {
		id: "codex",
		name: "Codex",
		tagline: "Persistent memory for the Codex CLI",
		icon: "/images/plugins/codex.png",
		docsUrl: "https://the-second-memo.ai/docs/integrations/codex",
		githubUrl: "https://github.com/the-second-memoai/codex-the-second-memo",
		installSteps: [
			{
				title: "Save your API key",
				description:
					"Add this to your shell profile. This key is shown only once — save it now.",
				code: 'export SECONDMEMO_CODEX_API_KEY="sm_..."',
				copyLabel: "API key",
				secret: true,
			},
			{
				title: "Install the hooks",
				description: "Run this to wire The Second Memo into Codex CLI:",
				code: "npx codex-the-second-memo@latest install",
			},
		],
	},
	cursor: {
		id: "cursor",
		name: "Cursor",
		tagline: "Persistent memory, session hooks, and MCP tools inside Cursor",
		icon: "/images/plugins/cursor.png",
		docsUrl: "https://github.com/the-second-memoai/cursor-the-second-memo#readme",
		githubUrl: "https://github.com/the-second-memoai/cursor-the-second-memo",
		installSteps: [
			{
				title: "Install the Cursor plugin",
				description:
					"Install cursor-the-second-memo from the Cursor Marketplace, then run the auth command on the machine where Cursor runs.",
				code: "bunx cursor-the-second-memo@latest login",
				copyLabel: "Login command",
			},
			{
				title: "Finish browser authentication",
				description:
					"The login command opens The Second Memo in your browser and stores Cursor credentials in ~/.the-second-memo-cursor/credentials.json.",
			},
			{
				title: "Manual API-key fallback",
				description:
					"If browser login is not available, set this environment variable before starting Cursor. This key is shown only once - save it now.",
				code: 'export SECONDMEMO_API_KEY="sm_..."',
				copyLabel: "API key command",
				secret: true,
				optional: true,
			},
			{
				title: "Restart Cursor",
				description:
					"Restart Cursor after installing or changing credentials so the plugin hooks and MCP tools are loaded.",
			},
		],
	},
	opencode: {
		id: "opencode",
		name: "OpenCode",
		tagline: "Long-term memory for your OpenCode sessions",
		icon: "/images/plugins/opencode.svg",
		docsUrl: "https://the-second-memo.ai/docs/integrations/opencode",
		githubUrl: "https://github.com/the-second-memoai/opencode-the-second-memo",
		usesOAuth: true,
		installSteps: [
			{
				title: "Install the plugin",
				description: "Use --no-tui for non-interactive environments.",
				code: "bunx opencode-the-second-memo@latest install",
			},
			{
				title: "Authenticate OpenCode",
				description:
					"Run the browser auth flow from the machine where OpenCode runs:",
				code: "bunx opencode-the-second-memo@latest login",
			},
			{
				title: "Verify your config",
				description:
					"Ensure ~/.config/opencode/opencode.jsonc includes the plugin:",
				code: '{\n  "plugin": ["opencode-the-second-memo"]\n}',
				optional: true,
			},
		],
	},
	openclaw: {
		id: "openclaw",
		name: "OpenClaw",
		tagline: "Cross-platform memory across Telegram, Discord, Slack",
		icon: "/images/plugins/openclaw.svg",
		docsUrl: "https://the-second-memo.ai/docs/integrations/openclaw",
		installSteps: [
			{
				title: "Install the plugin",
				description: "Run this in your OpenClaw project:",
				code: "openclaw plugins install @the-second-memo/openclaw-the-second-memo",
			},
			{
				title: "Configure The Second Memo",
				description:
					"Run the setup command and paste your API key when prompted:",
				code: "openclaw the-second-memo setup",
			},
		],
	},
	hermes: {
		id: "hermes",
		name: "Hermes",
		tagline: "Persistent memory for the Hermes agent",
		icon: "/images/plugins/hermes.svg",
		docsUrl: "https://the-second-memo.ai/docs/integrations/hermes",
		installSteps: [
			{
				title: "Run Hermes memory setup",
				description:
					"On the machine where Hermes is deployed, start the memory wizard, choose The Second Memo as the provider, and paste your API key when prompted:",
				code: "hermes memory setup",
			},
		],
	},
}

const SPACE_TO_CATALOG_ID: Record<string, string> = {
	"claude-code": "claude_code",
	codex: "codex",
	cursor: "cursor",
	opencode: "opencode",
	openclaw: "openclaw",
	hermes: "hermes",
}

export function spacePluginIdToCatalogId(spacePluginId: string): string | null {
	return SPACE_TO_CATALOG_ID[spacePluginId] ?? null
}

/** Normalize plugin client ids from API keys, metadata, and space ids. */
export function normalizePluginClientId(client: string): string {
	const trimmed = client.trim().toLowerCase()
	return spacePluginIdToCatalogId(trimmed) ?? trimmed.replace(/-/g, "_")
}
