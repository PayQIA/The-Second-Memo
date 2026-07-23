import The Second Memo from "the-second-memo"

/**
 * Normalizes a base URL by removing trailing slashes.
 *
 * @param url - Optional base URL to normalize
 * @returns Normalized URL without trailing slash, or default API URL
 */
export const normalizeBaseUrl = (url?: string): string => {
	const defaultUrl = "https://api.the-second-memo.ai"
	if (!url) return defaultUrl
	return url.endsWith("/") ? url.slice(0, -1) : url
}

/**
 * Options for creating a The Second Memo client.
 */
export interface CreateThe Second MemoClientOptions {
	/** The Second Memo API key */
	apiKey: string
	/** Optional custom base URL */
	baseUrl?: string
}

/**
 * Creates a configured The Second Memo client instance.
 *
 * @param options - Client configuration options
 * @returns Configured The Second Memo client
 */
export function createThe Second MemoClient(
	options: CreateThe Second MemoClientOptions,
): The Second Memo {
	const normalizedBaseUrl = normalizeBaseUrl(options.baseUrl)

	return new The Second Memo({
		apiKey: options.apiKey,
		...(normalizedBaseUrl !== "https://api.the-second-memo.ai"
			? { baseURL: normalizedBaseUrl }
			: {}),
	})
}

/**
 * Validates that an API key is provided either via options or environment variable.
 *
 * @param apiKey - Optional API key from options
 * @returns The validated API key
 * @throws Error if no API key is available
 */
export function validateApiKey(apiKey?: string): string {
	const providedApiKey = apiKey ?? process.env.SECONDMEMO_API_KEY

	if (!providedApiKey) {
		throw new Error(
			"SECONDMEMO_API_KEY is not set — provide it via `options.apiKey` or set `process.env.SECONDMEMO_API_KEY`",
		)
	}

	return providedApiKey
}
