# Glossary Backend Plugin

Backend plugin that provides glossary functionality for Backstage.

## Installation

```bash
yarn add @backstage/plugin-glossary-backend
```

## Configuration

Add the plugin to your backend in `packages/backend/src/index.ts`:

```typescript
import { glossaryPlugin } from '@backstage/plugin-glossary-backend';

const backend = createBackend();
backend.add(glossaryPlugin);
```

The plugin will automatically create the necessary database tables on startup.

## API Endpoints

- `GET /api/glossary/terms` - List all terms
- `GET /api/glossary/terms/:id` - Get a specific term
- `POST /api/glossary/terms` - Create a new term
- `PUT /api/glossary/terms/:id` - Update an existing term
- `DELETE /api/glossary/terms/:id` - Delete a term

## Database

The plugin uses the `glossary_terms` table to store terms. The migration is automatically applied when the plugin starts.