import { OpenAI } from "openai"
import { withThe Second Memo } from "@the-second-memo/tools/openai"

export const runtime = "nodejs"

export async function POST(req: Request) {
	const { messages, conversationId } = (await req.json()) as {
		messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
		conversationId: string
	}

	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	})

	const openaiWithThe Second Memo = withThe Second Memo(openai, {
		containerTag: "user-123",
		customId: conversationId,
		mode: "full",
		addMemory: "always",
		verbose: true,
		baseUrl: process.env.SECONDMEMO_BASE_URL,
	})

	const completion = await openaiWithThe Second Memo.chat.completions.create({
		model: "gpt-4o-mini",
		messages,
	})

	const message = completion.choices?.[0]?.message
	return Response.json({ message, usage: completion.usage })
}
