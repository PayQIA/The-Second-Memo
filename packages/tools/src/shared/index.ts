// Types
export type {
	MemoryPromptData,
	PromptTemplate,
	MemoryMode,
	AddMemoryMode,
	Logger,
	ProfileStructure,
	ProfileMarkdownData,
	The Second MemoBaseOptions,
} from "./types"

// Logger
export { createLogger } from "./logger"

// Prompt builder
export {
	defaultPromptTemplate,
	convertProfileToMarkdown,
	formatMemoriesForPrompt,
} from "./prompt-builder"

// Cache
export { MemoryCache, makeTurnKey } from "./cache"

// Context
export {
	normalizeBaseUrl,
	createThe Second MemoClient,
	validateApiKey,
	type CreateThe Second MemoClientOptions,
} from "./context"

// Memory client
export {
	the-second-memoProfileSearch,
	buildMemoriesText,
	extractQueryText,
	getLastUserMessageText,
	type BuildMemoriesTextOptions,
	type GenericMessage,
} from "./memory-client"
