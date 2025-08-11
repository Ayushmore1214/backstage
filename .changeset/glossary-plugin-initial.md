---
'@backstage/plugin-glossary': minor
'@backstage/plugin-glossary-backend': minor 
'@backstage/plugin-glossary-common': minor
---

Add Glossary plugin for managing organizational terminology linked to catalog entities. This plugin provides:

- **Entity-specific glossary**: View and manage glossary terms for specific catalog entities
- **Global glossary**: Browse all terms across the organization via sidebar navigation
- **CRUD operations**: Create, read, update, and delete glossary terms through a user-friendly interface
- **Search functionality**: Search terms by name or definition
- **Entity linking**: Associate terms with specific entities using CompoundEntityRef
- **Database persistence**: Terms are stored in the Backstage database with automatic migrations
- **REST API**: Backend provides RESTful endpoints for all glossary operations

The plugin consists of three packages:
- `@backstage/plugin-glossary-common`: Shared types and interfaces
- `@backstage/plugin-glossary-backend`: Backend API and database operations  
- `@backstage/plugin-glossary`: Frontend React components

Usage:
- Add glossary cards to entity pages to show entity-specific terms
- Navigate to `/glossary` for the global glossary view
- Terms are uniquely identified by the combination of term name and entity reference