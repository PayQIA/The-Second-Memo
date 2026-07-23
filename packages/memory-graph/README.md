# @the-second-memo/memory-graph

Interactive graph visualization for documents and their memory connections.

[![npm version](https://img.shields.io/npm/v/@the-second-memo/memory-graph.svg)](https://www.npmjs.com/package/@the-second-memo/memory-graph)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @the-second-memo/memory-graph
# or
bun add @the-second-memo/memory-graph
# or
pnpm add @the-second-memo/memory-graph
```

## Quick Start

```tsx
import { MemoryGraph } from '@the-second-memo/memory-graph';
import type { DocumentWithMemories } from '@the-second-memo/memory-graph';

function App() {
  const [documents, setDocuments] = useState<DocumentWithMemories[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/graph')
      .then(res => res.json())
      .then(data => {
        setDocuments(data.documents);
        setIsLoading(false);
      });
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <MemoryGraph
        documents={documents}
        isLoading={isLoading}
        variant="console"
      />
    </div>
  );
}
```

## Features

- **Interactive canvas visualization** - Pan, zoom, and drag nodes using Canvas 2D rendering
- **Document and memory nodes** - Documents as rectangles, memories as hexagons
- **Relationship visualization** - Edges show document similarity and memory version chains
- **Space filtering** - Filter by workspace or view all memories
- **Two variants** - Full-featured console mode or embedded consumer mode
- **Pagination support** - Load more documents on demand
- **TypeScript support** - Full type definitions included

## Essential Props

| Prop | Type | Description |
|------|------|-------------|
| `documents` | `DocumentWithMemories[]` | Array of documents with their memory entries |
| `isLoading` | `boolean` | Show loading state |
| `variant` | `"console" \| "consumer"` | Display mode (default: "console") |
| `error` | `Error \| null` | Error to display |
| `loadMoreDocuments` | `() => Promise<void>` | Function to load more data |
| `highlightDocumentIds` | `string[]` | IDs of documents to highlight |

## Documentation

Full documentation available at [docs.the-second-memo.ai](https://docs.the-second-memo.ai):

- [Overview](https://docs.the-second-memo.ai/memory-graph/overview) - What it is and when to use it
- [Installation](https://docs.the-second-memo.ai/memory-graph/installation) - Setup and requirements
- [Quick Start](https://docs.the-second-memo.ai/memory-graph/quickstart) - Get running in 2 minutes
- [API Reference](https://docs.the-second-memo.ai/memory-graph/api-reference) - Complete API documentation
- [Examples](https://docs.the-second-memo.ai/memory-graph/examples) - Common use cases
- [Troubleshooting](https://docs.the-second-memo.ai/memory-graph/troubleshooting) - Common issues

## Requirements

- React 18+
- Modern browser

## License

MIT

## Links

- [GitHub](https://github.com/the-second-memoai/the-second-memo/tree/main/packages/memory-graph)
- [Issues](https://github.com/the-second-memoai/the-second-memo/issues)
- [The Second Memo](https://the-second-memo.ai)
