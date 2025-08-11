# Glossary Common

Common types and interfaces shared between the glossary frontend and backend plugins.

## Types

### GlossaryTerm

Represents a glossary term with its definition and entity relationship:

```typescript
interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  entityRef: CompoundEntityRef;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

### CreateGlossaryTermRequest

Request payload for creating a new glossary term:

```typescript
interface CreateGlossaryTermRequest {
  term: string;
  definition: string;
  entityRef: CompoundEntityRef;
}
```

### UpdateGlossaryTermRequest

Request payload for updating an existing glossary term:

```typescript
interface UpdateGlossaryTermRequest {
  term?: string;
  definition?: string;
  entityRef?: CompoundEntityRef;
}
```

## Installation

```bash
yarn add @backstage/plugin-glossary-common
```