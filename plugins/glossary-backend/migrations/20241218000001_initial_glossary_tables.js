/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('glossary_terms', table => {
    table.uuid('id').primary().notNullable();
    table.string('term').notNullable();
    table.text('definition').notNullable();
    table.string('entity_ref').notNullable();
    table.string('created_by').notNullable();
    table.datetime('created_at').notNullable();
    table.datetime('updated_at').notNullable();

    // Create composite unique index for term and entity_ref combination
    table.unique(['term', 'entity_ref'], { indexName: 'glossary_terms_term_entity_ref_unique' });
    
    // Create index for entity_ref for faster lookups
    table.index('entity_ref', 'glossary_terms_entity_ref_idx');
    
    // Create index for term for search functionality
    table.index('term', 'glossary_terms_term_idx');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('glossary_terms');
}