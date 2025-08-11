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

import { CompoundEntityRef } from '@backstage/catalog-model';

/**
 * Represents a glossary term with its definition and entity relationship
 *
 * @public
 */
export interface GlossaryTerm {
  /** Unique identifier for the glossary term */
  id: string;
  /** The term name */
  term: string;
  /** Definition or description of the term */
  definition: string;
  /** Entity reference this term is associated with */
  entityRef: CompoundEntityRef;
  /** When the term was created */
  createdAt: Date;
  /** When the term was last updated */
  updatedAt: Date;
  /** User who created the term */
  createdBy: string;
}

/**
 * Request payload for creating a new glossary term
 *
 * @public
 */
export interface CreateGlossaryTermRequest {
  /** The term name */
  term: string;
  /** Definition or description of the term */
  definition: string;
  /** Entity reference this term is associated with */
  entityRef: CompoundEntityRef;
}

/**
 * Request payload for updating an existing glossary term
 *
 * @public
 */
export interface UpdateGlossaryTermRequest {
  /** The term name */
  term?: string;
  /** Definition or description of the term */
  definition?: string;
  /** Entity reference this term is associated with */
  entityRef?: CompoundEntityRef;
}

/**
 * Response structure for listing glossary terms
 *
 * @public
 */
export interface GlossaryTermsResponse {
  /** Array of glossary terms */
  terms: GlossaryTerm[];
  /** Total number of terms available */
  total: number;
}

/**
 * Query parameters for listing glossary terms
 *
 * @public
 */
export interface GlossaryTermsQuery {
  /** Entity reference to filter by */
  entityRef?: string;
  /** Search term to filter by term name or definition */
  search?: string;
  /** Number of items per page */
  limit?: number;
  /** Page offset */
  offset?: number;
}