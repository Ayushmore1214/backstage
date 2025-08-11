# Glossary Plugin

A Backstage plugin for managing glossary terms that provides a centralized way to maintain organizational terminology and definitions linked to catalog entities.

## Features

- **Entity-specific glossary**: View and manage glossary terms for specific catalog entities
- **Global glossary**: Browse all terms across the organization
- **CRUD operations**: Create, read, update, and delete glossary terms
- **Search functionality**: Search terms by name or definition
- **Entity linking**: Associate terms with specific entities using CompoundEntityRef

## Installation

This plugin consists of three packages:

1. `@backstage/plugin-glossary-common` - Common types and interfaces
2. `@backstage/plugin-glossary-backend` - Backend API and database operations
3. `@backstage/plugin-glossary` - Frontend React components

### Backend Setup

1. Install the backend plugin:

```bash
yarn add @backstage/plugin-glossary-backend
```

2. Add the plugin to your backend in `packages/backend/src/index.ts`:

```typescript
import { glossaryPlugin } from '@backstage/plugin-glossary-backend';

const backend = createBackend();

// ... other plugins

backend.add(glossaryPlugin);
```

3. The plugin will automatically create the necessary database tables on startup.

### Frontend Setup

1. Install the frontend plugin:

```bash
yarn add @backstage/plugin-glossary
```

2. Add the global glossary page to your app routes in `packages/app/src/App.tsx`:

```typescript
import { GlossaryPage } from '@backstage/plugin-glossary';

const routes = (
  <FlatRoutes>
    {/* ... other routes */}
    <Route path="/glossary" element={<GlossaryPage />} />
  </FlatRoutes>
);
```

3. Add the glossary to your sidebar navigation in `packages/app/src/components/Root/Root.tsx`:

```typescript
import BookIcon from '@material-ui/icons/Book';

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      {/* ... other sidebar items */}
      <SidebarItem icon={BookIcon} to="glossary" text="Glossary" />
    </Sidebar>
    {children}
  </SidebarPage>
);
```

4. Add the entity glossary card to your entity pages in `packages/app/src/components/catalog/EntityPage.tsx`:

```typescript
import { EntityGlossaryCard } from '@backstage/plugin-glossary';

const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    {/* ... other cards */}
    <Grid item md={6} xs={12}>
      <EntityGlossaryCard />
    </Grid>
  </Grid>
);
```

## Usage

### Adding Terms

1. Navigate to a specific entity page or the global glossary
2. Click the "Add Term" button
3. Fill in the term name, definition, and entity reference
4. Click "Create" to save the term

### Managing Terms

- **Edit**: Click the edit icon next to any term to modify it
- **Delete**: Click the delete icon to remove a term
- **Search**: Use the search functionality to find specific terms

### Data Model

Each glossary term contains:

- **Term**: The name/title of the term
- **Definition**: Detailed explanation of the term
- **Entity Reference**: Which catalog entity this term is associated with
- **Metadata**: Creation time, update time, and creator information

## API Reference

The backend plugin exposes a REST API at `/api/glossary`:

- `GET /api/glossary/terms` - List all terms (supports filtering by entityRef and search)
- `GET /api/glossary/terms/:id` - Get a specific term
- `POST /api/glossary/terms` - Create a new term
- `PUT /api/glossary/terms/:id` - Update an existing term
- `DELETE /api/glossary/terms/:id` - Delete a term

## Database Schema

The plugin creates a `glossary_terms` table with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| term | VARCHAR | Term name |
| definition | TEXT | Term definition |
| entity_ref | VARCHAR | Entity reference string |
| created_by | VARCHAR | User who created the term |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

## Development

To contribute to this plugin:

1. Clone the repository
2. Install dependencies: `yarn install`
3. Build the plugin: `yarn build`
4. Run tests: `yarn test`

## License

This plugin is licensed under the Apache 2.0 license.