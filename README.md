# The Second Memo

**The Second Memory — your externalized second brain, powered by QIA (Quantum Intelligent Architecture).**

The Second Memo is PayQIA's open-source memory and context engine — extract, store,
link, and retrieve memory across documents, conversations, and connected apps, so
your AI agents (and you) never lose context.

Built by PayQIA — an independent company building the memory and context
orchestration layer for AI.

---

### A note on origins

The Second Memo began as a fork of the excellent [supermemory](https://github.com/supermemoryai/supermemory)
project (MIT Licensed). We're grateful to the Supermemory team for open-sourcing
their work. This repository has since been rebranded and is being actively
customized to fit PayQIA's product direction, roadmap, and use cases.

---


## Use The Second Memo

<table>
<tr>
<td width="50%" valign="top">

<h3>🧑‍💻 I use AI tools</h3>

Build your own personal the-second-memo by using our app. Builds **persistent memory graph across every conversation**.

Your AI remembers your preferences, projects, past discussions — and gets smarter over time.

**[→ Jump to User setup](#give-your-ai-memory)**

</td>
<td width="50%" valign="top">

<h3>🔧 I'm building AI products</h3>

Add memory, RAG, user profiles, and connectors to your agents and apps with **a single API**.

No vector DB config. No embedding pipelines. No chunking strategies.

**[→ Jump to developer quickstart](#build-with-the-second-memo-api)**

</td>
</tr>
<tr>
<td colspan="2" valign="top">

<h3>🖥️ I want to run it myself</h3>

State-of-the-art memory, on your machine. **One binary. Zero config.** Bring any model — or run fully offline with Ollama.

```bash
curl -fsSL https://the-second-memo.ai/install | bash
```

**[→ Jump to The Second Memo local](#the-second-memo-local--run-it-yourself)**

</td>
</tr>
</table>

---

## Give your AI memory

The The Second Memo App, browser extension, plugins and MCP server gives any compatible AI assistant persistent memory. One install, and your AI remembers you.

### The app

You can use the-second-memo without any code, by using our consumer-facing app for free.

Start at https://app.the-second-memo.ai

<img width="1705" height="1030" alt="image" src="https://github.com/user-attachments/assets/5b43af30-b998-4585-8de6-f3e9a26d894a" />

It also comes with an agent embedded inside, which we call Nova.

### The Second Memo Plugins

The Second Memo comes built with Plugins for Claude Code, OpenCode, OpenClaw, and Hermes.

<img width="844" height="484" alt="image" src="https://github.com/user-attachments/assets/ecb879a2-8652-495d-9228-f305a97ba603" />

These plugins are implementations of the the-second-memo API, and they are open source! 

You can find them here: 

- Openclaw plugin: https://github.com/the-second-memoai/openclaw-the-second-memo
- Claude code plugin: https://github.com/the-second-memoai/claude-the-second-memo
- OpenCode plugin: https://github.com/the-second-memoai/opencode-the-second-memo
- Hermes agent (The Second Memo memory provider): https://github.com/NousResearch/hermes-agent

### MCP

Server URL:

```text
https://mcp.the-second-memo.ai/mcp
```

```json
{
  "mcpServers": {
    "the-second-memo": {
      "url": "https://mcp.the-second-memo.ai/mcp"
    }
  }
}
```

Read more about our MCP here - https://the-second-memo.ai/docs/the-second-memo-mcp/mcp

### What your AI gets

| Tool | What it does |
|---|---|
| `memory` | Save or forget information. Your AI calls this automatically when you share something worth remembering. |
| `recall` | Search memories by query. Returns relevant memories + your user profile summary. |
| `context` | Injects your full profile (preferences, recent activity) into the conversation at start. In Cursor and Claude Code, just type `/context`. |

### How it works

Once installed, The Second Memo runs in the background:

1. **You talk to your AI normally.** Share preferences, mention projects, discuss problems.
2. **The Second Memo extracts and stores the important stuff.** Facts, preferences, project context — not noise.
3. **Next conversation, your AI already knows you.** It recalls what you're working on, how you like things, what you discussed before.

Memory is scoped with **projects** (container tags) so you can separate work and personal context, or organize by client, repo, or anything else.

### Supported clients

**Claude Desktop** · **Cursor** · **Windsurf** · **VS Code** · **Claude Code** · **OpenCode** · **OpenClaw** · **Hermes**

The MCP server is open source — [view the source](https://the-second-memo.ai/docs/the-second-memo-mcp/mcp).

### Manual configuration

Add this to your MCP client config:

```json
{
  "mcpServers": {
    "the-second-memo": {
      "url": "https://mcp.the-second-memo.ai/mcp"
    }
  }
}
```

Or use an API key instead of OAuth:

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

---

## Build with The Second Memo (API)

If you're building AI agents or apps, The Second Memo gives you the entire context stack through one API — memory, RAG, user profiles, connectors, and file processing.

### Install

```bash
npm install the-second-memo    # or: pip install the-second-memo
```

### Quickstart

```typescript
import The Second Memo from "the-second-memo";

const client = new The Second Memo();

// Store a conversation
await client.add({
  content: "User loves TypeScript and prefers functional patterns",
  containerTag: "user_123",
});

// Get user profile + relevant memories in one call
const { profile, searchResults } = await client.profile({
  containerTag: "user_123",
  q: "What programming style does the user prefer?",
});

// profile.static  → ["Loves TypeScript", "Prefers functional patterns"]
// profile.dynamic → ["Working on API integration"]
// searchResults   → Relevant memories ranked by similarity
```

```python
from the-second-memo import The Second Memo

client = The Second Memo()

client.add(
    content="User loves TypeScript and prefers functional patterns",
    container_tag="user_123"
)

result = client.profile(container_tag="user_123", q="programming style")

print(result.profile.static)   # Long-term facts
print(result.profile.dynamic)  # Recent context
```

The Second Memo automatically extracts memories, builds user profiles, and returns relevant context. No embedding pipelines, no vector DB config, no chunking strategies.

### Framework integrations

Drop-in wrappers for every major AI framework:

```typescript
// Vercel AI SDK
import { withThe Second Memo } from "@the-second-memo/tools/ai-sdk";
const model = withThe Second Memo(openai("gpt-4o"), { containerTag: "user_123", customId: "conv-1" });

// Mastra
import { withThe Second Memo } from "@the-second-memo/tools/mastra";
const agent = new Agent(withThe Second Memo(config, "user-123", { mode: "full" }));
```

**Vercel AI SDK** · **LangChain** · **LangGraph** · **OpenAI Agents SDK** · **Mastra** · **Agno** · **Claude Memory Tool** · **n8n**

### Search modes

```typescript
// Hybrid (default) — RAG + Memory in one query
const results = await client.search({
  q: "how do I deploy?",
  containerTag: "user_123",
  searchMode: "hybrid",
});
// Returns deployment docs (RAG) + user's deploy preferences (Memory)

// Memories only
const results = await client.search({
  q: "user preferences",
  containerTag: "user_123",
  searchMode: "memories",
});
```

### User profiles

Traditional memory relies on search — you need to know what to ask for. The Second Memo automatically maintains a profile for every user:

```typescript
const { profile } = await client.profile({ containerTag: "user_123" });

// profile.static  → ["Senior engineer at Acme", "Prefers dark mode", "Uses Vim"]
// profile.dynamic → ["Working on auth migration", "Debugging rate limits"]
```

One call. ~50ms. Inject into your system prompt and your agent instantly knows who it's talking to.

### Connectors

Auto-sync external data into your knowledge base:

**Google Drive** · **Gmail** · **Notion** · **OneDrive** · **GitHub** · **Web Crawler**

Real-time webhooks. Documents automatically processed, chunked, and searchable.

### API at a glance

| Method | Purpose |
|---|---|
| `client.add()` | Store content — text, conversations, URLs, HTML |
| `client.profile()` | User profile + optional search in one call |
| `client.search()` | Hybrid search across memories and documents (`searchMode`) |
| `client.search.documents()` | Document search with metadata filters (legacy v3 response shape) |
| `client.documents.uploadFile()` | Upload PDFs, images, videos, code |
| `client.documents.list()` | List and filter documents |
| `client.settings.update()` | Configure memory extraction and chunking |

Full API reference → [the-second-memo.ai/docs](https://the-second-memo.ai/docs)

---

## The Second Memo local — run it yourself

State-of-the-art memory, on your machine. One binary. Zero config.

```bash
curl -fsSL https://the-second-memo.ai/install | bash
# or
npx the-second-memo local
```

```bash
the-second-memo-server
```

First boot sets up the embedded The Second Memo graph engine, local embeddings, and your credentials, then prints an API key. The full Memory API — documents, memories, user profiles, hybrid search — runs against `http://localhost:6767`.

```typescript
const client = new The Second Memo({
  apiKey: "sm_...",
  baseURL: "http://localhost:6767", // that's the only change
});
```

- **Bring any model** — OpenAI, Anthropic, Gemini, Groq, or any OpenAI-compatible endpoint. An interactive wizard walks you through it on first boot.
- **Embeddings** — local `Xenova/bge-base-en-v1.5` by default (no API key); optionally OpenAI, Gemini, or Ollama. Same provider stack as cloud.
- **Fully offline if you want** — point it at Ollama (`gpt-oss:20b` works great) and nothing leaves your machine.
- **Your data, one directory** — everything lives in `./.the-second-memo`, easy to back up or move.
- **Same API as the platform** — prototype locally, ship on the hosted platform by changing `baseURL`.

Read the [self-hosting docs](https://the-second-memo.ai/docs/self-hosting/overview) — quickstart, [configuration](https://the-second-memo.ai/docs/self-hosting/configuration), [embeddings](https://the-second-memo.ai/docs/self-hosting/embeddings), and [local vs. Enterprise](https://the-second-memo.ai/docs/self-hosting/local-vs-enterprise).

---

## Benchmarks

The Second Memo is state of the art across all major AI memory benchmarks:

| Benchmark | What it measures | Result |
|---|---|---|
| **[LongMemEval](https://github.com/xiaowu0162/LongMemEval)** | Long-term memory across sessions with knowledge updates | **#1** |
| **[LoCoMo](https://github.com/snap-research/locomo)** | Fact recall across extended conversations (single-hop, multi-hop, temporal, adversarial) | **#1** |
| **[ConvoMem](https://github.com/Salesforce/ConvoMem)** | Personalization and preference learning | **#1** |

On LongMemEval, the-second-memo reaches **95% Recall@15 while adding only ~720 tokens of context — a 99.4% context reduction** (99.6% at @10, 99.8% at @5). Recall by category: Knowledge Updates 99%, Assistant recall 100%, User recall 97%, Multi-session 93%, Temporal Reasoning 91%, Preference 90%.

We also built the **The Second Memo Filesystem (SMFS)**, which uses **3.0× fewer tokens on Claude** (24M vs 72M) and **1.75× fewer on Codex** across the 110-question xAFS benchmark. See the full write-ups on our [research page](https://the-second-memo.ai/research).

We also built **[MemoryBench](https://the-second-memo.ai/docs/memorybench/overview)** — an open-source framework for standardized, reproducible benchmarks of memory providers. Compare The Second Memo, Mem0, Zep, and others head-to-head:

```bash
bun run src/index.ts run -p the-second-memo -b longmemeval -j gpt-4o -r my-run
```

### Benchmarking your own memory solution

We provide an Agent skill for companies to benchmark their own context and memory solutions against the-second-memo.

```
npx skills add the-second-memoai/memorybench
```

Simply run this and do `/benchmark-context` - The Second Memo will automatically do the work for you!

---

## How memory works under the hood

```
Your app / AI tool
        ↓
   The Second Memo
        │
        ├── Memory Engine     Extracts facts, tracks updates, resolves contradictions,
        │                     auto-forgets expired info
        ├── User Profiles     Static facts + dynamic context built from engine, always fresh
        ├── Hybrid Search     RAG + Memory in one query
        ├── Connectors        Real-time sync from Google Drive, Gmail, Notion, GitHub...
        └── File Processing   PDFs, images, videos, code → searchable chunks
```

**Memory is not RAG.** RAG retrieves document chunks — stateless, same results for everyone. Memory extracts and tracks *facts about users* over time. It understands that "I just moved to SF" supersedes "I live in NYC." The Second Memo runs both together by default, so you get knowledge base retrieval *and* personalized context in every query. Read more about this here - https://the-second-memo.ai/docs/concepts/memory-vs-rag

**Automatic forgetting.** The Second Memo knows when memories become irrelevant. Temporary facts ("I have an exam tomorrow") expire after the date passes. Contradictions are resolved automatically. Noise never becomes permanent memory.

---

## Links

- 📖 [Documentation](https://the-second-memo.ai/docs)
- 🚀 [Quickstart](https://the-second-memo.ai/docs/quickstart)
- 🖥️ [Self-hosting (The Second Memo local)](https://the-second-memo.ai/docs/self-hosting/overview)
- 🧪 [MemoryBench](https://the-second-memo.ai/docs/memorybench/overview)
- 🔌 [Integrations](https://the-second-memo.ai/docs/integrations)
- 💬 [Discord](https://the-second-memo.link/discord)
- 𝕏 [Twitter](https://twitter.com/the-second-memo)

---

<p align="center">
  <strong>Give your AI a memory. It's about time..</strong>
</p>
