import { gateway, streamText, type ModelMessage } from "ai"
import { withThe Second Memo } from "@the-second-memo/tools/ai-sdk"

const model = withThe Second Memo(gateway("google/gemini-2.5-flash"), {
	containerTag: "user-1",
	customId: "chat-session",
	apiKey: process.env.SECONDMEMO_API_KEY ?? "",
	mode: "full",
	addMemory: "always",
	baseUrl: process.env.SECONDMEMO_BASE_URL,
})

export async function POST(req: Request) {
	const { messages }: { messages: ModelMessage[] } = await req.json()

	const result = streamText({
		model,
		system: "You are a helpful assistant.",
		messages,
	})

	return result.toUIMessageStreamResponse()
}
