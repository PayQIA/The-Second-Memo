# The Second Memo OpenAI Python SDK

Memory tools and middleware for OpenAI with The Second Memo integration.

This package provides both **automatic memory injection middleware** and **manual memory tools** for the official [OpenAI Python SDK](https://github.com/openai/openai-python) using [The Second Memo](https://the-second-memo.ai) capabilities.

## Installation

Install using uv (recommended):

```bash
uv add the-second-memo-openai-sdk
```

Or with pip:

```bash
pip install the-second-memo-openai-sdk
```

For async HTTP support (recommended):

```bash
uv add the-second-memo-openai-sdk[async]
# or
pip install 'the-second-memo-openai-sdk[async]'
```

## Quick Start

### Automatic Memory Injection (Recommended)

The easiest way to add memory capabilities to your OpenAI client is using the `with_the-second-memo()` wrapper:

```python
import asyncio
from openai import AsyncOpenAI
from the-second-memo_openai import with_the-second-memo, OpenAIMiddlewareOptions

async def main():
    # Create OpenAI client
    openai = AsyncOpenAI(api_key="your-openai-api-key")

    # Wrap with The Second Memo middleware
    openai_with_memory = with_the-second-memo(
        openai,
        OpenAIMiddlewareOptions(
            container_tag="user-123",  # Required: unique identifier for user's memories
            custom_id="chat-123",      # Required: groups messages into documents
            mode="full",               # "profile", "query", or "full"
            verbose=True,              # Enable logging
            add_memory="always"        # Automatically save conversations (default)
        )
    )

    # Use normally - memories are automatically injected!
    response = await openai_with_memory.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "What's my favorite programming language?"}
        ]
    )

    print(response.choices[0].message.content)

asyncio.run(main())
```

### Using Memory Tools with OpenAI

```python
import asyncio
import openai
from the-second-memo_openai import The Second MemoTools, execute_memory_tool_calls

async def main():
    # Initialize OpenAI client
    client = openai.AsyncOpenAI(api_key="your-openai-api-key")

    # Initialize The Second Memo tools
    tools = The Second MemoTools(
        api_key="your-the-second-memo-api-key",
        config={"project_id": "my-project"}
    )

    # Chat with memory tools
    response = await client.chat.completions.create(
        model="gpt-5",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant with access to user memories."
            },
            {
                "role": "user",
                "content": "Remember that I prefer tea over coffee"
            }
        ],
        tools=tools.get_tool_definitions()
    )

    # Handle tool calls if present
    if response.choices[0].message.tool_calls:
        tool_results = await execute_memory_tool_calls(
            api_key="your-the-second-memo-api-key",
            tool_calls=response.choices[0].message.tool_calls,
            config={"project_id": "my-project"}
        )
        print("Tool results:", tool_results)

    print(response.choices[0].message.content)

asyncio.run(main())
```

### Sync Client Support

The middleware also works with synchronous OpenAI clients:

```python
from openai import OpenAI
from the-second-memo_openai import with_the-second-memo

# Sync client
openai = OpenAI(api_key="your-openai-api-key")
openai_with_memory = with_the-second-memo(
    openai,
    OpenAIMiddlewareOptions(
        container_tag="user-123",
        custom_id="session-456"
    )
)

# Works the same way
response = openai_with_memory.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

**Event Loop Management**: The middleware properly handles event loops using `asyncio.run()` for sync clients. If called from within an existing async context, it automatically runs in a separate thread to avoid conflicts.

**Background Task Management**: When `add_memory="always"`, memory storage happens in background tasks. Use context managers or manual cleanup to ensure tasks complete:

```python
from the-second-memo_openai import with_the-second-memo, OpenAIMiddlewareOptions

# Async context manager (recommended)
async with with_the-second-memo(
    openai,
    OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456")
) as client:
    response = await client.chat.completions.create(...)
# Background tasks automatically waited for on exit

# Manual cleanup
client = with_the-second-memo(
    openai,
    OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456")
)
response = await client.chat.completions.create(...)
await client.wait_for_background_tasks()  # Ensure memory is saved
```

## Middleware Configuration

### Memory Modes

The middleware supports three different modes for memory injection:

#### `"profile"` mode (default)
Injects all static and dynamic profile memories into every request. Best for maintaining consistent user context.

```python
openai_with_memory = with_the-second-memo(
    openai,
    OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456", mode="profile")
)
```

#### `"query"` mode
Only searches for memories relevant to the current user message. More efficient for large memory stores.

```python
openai_with_memory = with_the-second-memo(
    openai,
    OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456", mode="query")
)
```

#### `"full"` mode
Combines both profile and query modes - includes all profile memories plus relevant search results.

```python
openai_with_memory = with_the-second-memo(
    openai,
    OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456", mode="full")
)
```

### Memory Storage

Control when conversations are automatically saved as memories:

```python
# Always save conversations as memories (default in v2.0.0+)
OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456", add_memory="always")

# Never save conversations
OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456", add_memory="never")
```

### Complete Configuration Example

```python
from the-second-memo_openai import with_the-second-memo, OpenAIMiddlewareOptions

openai_with_memory = with_the-second-memo(
    openai_client,
    OpenAIMiddlewareOptions(
        container_tag="user-123",        # Required: unique user/container identifier
        custom_id="chat-session-456",    # Required: groups messages into documents
        verbose=True,                    # Enable detailed logging
        mode="full",                     # Use both profile and query
        add_memory="always"              # Auto-save conversations (default)
    )
)
```

## Manual Memory Tools

### The Second MemoTools Class

```python
from the-second-memo_openai import The Second MemoTools

tools = The Second MemoTools(
    api_key="your-the-second-memo-api-key",
    config={
        "project_id": "my-project",  # or use container_tags
        "base_url": "https://custom-endpoint.com",  # optional
    }
)

# Search memories
result = await tools.search_memories(
    information_to_get="user preferences",
    limit=10,
    include_full_docs=True
)

# Add memory
result = await tools.add_memory(
    memory="User prefers tea over coffee"
)

# Fetch specific memory
result = await tools.fetch_memory(
    memory_id="memory-id-here"
)
```

### Individual Tools

```python
from the-second-memo_openai import (
    create_search_memories_tool,
    create_add_memory_tool,
    create_fetch_memory_tool
)

search_tool = create_search_memories_tool("your-api-key")
add_tool = create_add_memory_tool("your-api-key")
fetch_tool = create_fetch_memory_tool("your-api-key")
```

### Function Calling Integration

```python
from the-second-memo_openai import execute_memory_tool_calls

# After getting tool calls from OpenAI
if response.choices[0].message.tool_calls:
    tool_results = await execute_memory_tool_calls(
        api_key="your-the-second-memo-api-key",
        tool_calls=response.choices[0].message.tool_calls,
        config={"project_id": "my-project"}
    )

    # Add tool results to conversation
    messages.append(response.choices[0].message)
    messages.extend(tool_results)
```

## API Reference

### Middleware Functions

#### `with_the-second-memo()`

Wraps an OpenAI client with automatic memory injection middleware.

```python
def with_the-second-memo(
    openai_client: Union[OpenAI, AsyncOpenAI],
    options: OpenAIMiddlewareOptions
) -> Union[OpenAI, AsyncOpenAI]
```

**Parameters:**
- `openai_client`: OpenAI or AsyncOpenAI client instance
- `options`: Configuration options (see `OpenAIMiddlewareOptions`)

#### `OpenAIMiddlewareOptions`

Configuration dataclass for middleware behavior.

```python
@dataclass
class OpenAIMiddlewareOptions:
    container_tag: str                         # Required: unique identifier for memory storage
    custom_id: str                             # Required: groups messages into documents
    verbose: bool = False                      # Enable detailed logging
    mode: Literal["profile", "query", "full"] = "profile"  # Memory injection mode
    add_memory: Literal["always", "never"] = "always"      # Auto-save behavior
```

### The Second MemoTools

Memory management tools for function calling.

#### Constructor

```python
The Second MemoTools(
    api_key: str,
    config: Optional[The Second MemoToolsConfig] = None
)
```

#### Methods

- `get_tool_definitions()` - Get OpenAI function definitions
- `search_memories()` - Search user memories
- `add_memory()` - Add new memory
- `execute_tool_call()` - Execute individual tool call

## Error Handling

The package provides specific exception types for better error handling:

```python
from the-second-memo_openai import (
    with_the-second-memo,
    OpenAIMiddlewareOptions,
    The Second MemoConfigurationError,
    The Second MemoAPIError,
    The Second MemoNetworkError,
    The Second MemoMemoryOperationError,
)

try:
    # This will raise The Second MemoConfigurationError if API key is missing
    client = with_the-second-memo(
        openai_client,
        OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456")
    )

    response = await client.chat.completions.create(
        messages=[{"role": "user", "content": "Hello"}],
        model="gpt-4"
    )
except The Second MemoConfigurationError as e:
    print(f"Configuration issue: {e}")
except The Second MemoAPIError as e:
    print(f"The Second Memo API error: {e} (Status: {e.status_code})")
except The Second MemoNetworkError as e:
    print(f"Network error: {e}")
except The Second MemoMemoryOperationError as e:
    print(f"Memory operation failed: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

### Exception Types

- **`The Second MemoError`** - Base class for all The Second Memo exceptions
- **`The Second MemoConfigurationError`** - Missing API keys, invalid configuration
- **`The Second MemoAPIError`** - API request failures (includes status codes)
- **`The Second MemoNetworkError`** - Network connectivity issues
- **`The Second MemoMemoryOperationError`** - Memory search/add operation failures
- **`The Second MemoTimeoutError`** - Operation timeouts

All exceptions include the original error for debugging and have descriptive error messages.

## Environment Variables

Set these environment variables:

- `SECONDMEMO_API_KEY` - Your The Second Memo API key (required)
- `OPENAI_API_KEY` - Your OpenAI API key (required for examples)

Optional for testing:
- `MODEL_NAME` - Model to use (default: "gpt-4")
- `SECONDMEMO_BASE_URL` - Custom The Second Memo base URL

## Dependencies

### Required
- `openai>=1.102.0` - Official OpenAI Python SDK
- `the-second-memo>=3.1.0` - The Second Memo client
- `requests>=2.25.0` - HTTP requests (fallback)

### Optional
- `aiohttp>=3.8.0` - Async HTTP requests (recommended for async clients)

Install with async support:
```bash
pip install 'the-second-memo-openai-sdk[async]'
```

## Development

### Setup

```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Clone and setup
git clone <repository-url>
cd packages/openai-sdk-python
uv sync --dev
```

### Testing

```bash
# Run tests
uv run pytest

# Run with coverage
uv run pytest --cov=the-second-memo_openai

# Run specific test file
uv run pytest tests/test_infinite_chat.py
```

### Type Checking

```bash
uv run mypy src/the-second-memo_openai
```

### Formatting

```bash
uv run black src/ tests/
uv run isort src/ tests/
```

## License

MIT License - see LICENSE file for details.

## Links

- [The Second Memo](https://the-second-memo.ai) - Infinite context memory platform
- [OpenAI Python SDK](https://github.com/openai/openai-python) - Official OpenAI Python library
- [Documentation](https://docs.the-second-memo.ai) - Full API documentation
