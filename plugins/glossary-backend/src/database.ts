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
import { stringifyEntityRef } from '@backstage/catalog-model';
import {
  GlossaryTerm,
  CreateGlossaryTermRequest,
  UpdateGlossaryTermRequest,
  GlossaryTermsQuery,
  GlossaryTermsResponse,
} from '@backstage/plugin-glossary-common';
import { v4 as uuidv4 } from 'uuid';

export interface GlossaryDatabase {
  getGlossaryTerms(query: GlossaryTermsQuery): Promise<GlossaryTermsResponse>;
  getGlossaryTerm(id: string): Promise<GlossaryTerm | undefined>;
  createGlossaryTerm(
    term: CreateGlossaryTermRequest,
    createdBy: string,
  ): Promise<GlossaryTerm>;
  updateGlossaryTerm(
    id: string,
    updates: UpdateGlossaryTermRequest,
  ): Promise<GlossaryTerm>;
  deleteGlossaryTerm(id: string): Promise<void>;
}

interface GlossaryTermRow {
  id: string;
  term: string;
  definition: string;
  entity_ref: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export class DefaultGlossaryDatabase implements GlossaryDatabase {
  constructor(private readonly db: Knex) {}

  async getGlossaryTerms(query: GlossaryTermsQuery): Promise<GlossaryTermsResponse> {
    let dbQuery = this.db<GlossaryTermRow>('glossary_terms');

    if (query.entityRef) {
      dbQuery = dbQuery.where('entity_ref', query.entityRef);
    }

    if (query.search) {
      dbQuery = dbQuery.where(builder => {
        builder
          .where('term', 'like', `%${query.search}%`)
          .orWhere('definition', 'like', `%${query.search}%`);
      });
    }

    // Get total count
    const countQuery = dbQuery.clone();
    const [{ count }] = await countQuery.count('* as count');
    const total = Number(count);

    // Apply pagination
    if (query.offset) {
      dbQuery = dbQuery.offset(query.offset);
    }

    if (query.limit) {
      dbQuery = dbQuery.limit(query.limit);
    }

    // Order by term alphabetically
    dbQuery = dbQuery.orderBy('term', 'asc');

    const rows = await dbQuery.select();
    const terms = rows.map(this.rowToGlossaryTerm);

    return {
      terms,
      total,
    };
  }

  async getGlossaryTerm(id: string): Promise<GlossaryTerm | undefined> {
    const row = await this.db<GlossaryTermRow>('glossary_terms')
      .where('id', id)
      .first();

    return row ? this.rowToGlossaryTerm(row) : undefined;
  }

  async createGlossaryTerm(
    termRequest: CreateGlossaryTermRequest,
    createdBy: string,
  ): Promise<GlossaryTerm> {
    const id = uuidv4();
    const now = new Date();
    const entityRefString = stringifyEntityRef(termRequest.entityRef);

    const row: GlossaryTermRow = {
      id,
      term: termRequest.term,
      definition: termRequest.definition,
      entity_ref: entityRefString,
      created_by: createdBy,
      created_at: now,
      updated_at: now,
    };

    await this.db<GlossaryTermRow>('glossary_terms').insert(row);

    return this.rowToGlossaryTerm(row);
  }

  async updateGlossaryTerm(
    id: string,
    updates: UpdateGlossaryTermRequest,
  ): Promise<GlossaryTerm> {
    const now = new Date();
    const updateData: Partial<GlossaryTermRow> = {
      updated_at: now,
    };

    if (updates.term) {
      updateData.term = updates.term;
    }

    if (updates.definition) {
      updateData.definition = updates.definition;
    }

    if (updates.entityRef) {
      updateData.entity_ref = stringifyEntityRef(updates.entityRef);
    }

    await this.db<GlossaryTermRow>('glossary_terms')
      .where('id', id)
      .update(updateData);

    const updatedRow = await this.db<GlossaryTermRow>('glossary_terms')
      .where('id', id)
      .first();

    if (!updatedRow) {
      throw new Error(`Glossary term with id ${id} not found`);
    }

    return this.rowToGlossaryTerm(updatedRow);
  }

  async deleteGlossaryTerm(id: string): Promise<void> {
    await this.db<GlossaryTermRow>('glossary_terms').where('id', id).delete();
  }

  private rowToGlossaryTerm(row: GlossaryTermRow): GlossaryTerm {
    const entityRef = row.entity_ref;
    const [kind, namespace, name] = entityRef.split(':');

    return {
      id: row.id,
      term: row.term,
      definition: row.definition,
      entityRef: {
        kind,
        namespace: namespace || 'default',
        name,
      },
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}