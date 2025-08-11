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

import { createApiRef } from '@backstage/core-plugin-api';
import {
  GlossaryTerm,
  CreateGlossaryTermRequest,
  UpdateGlossaryTermRequest,
  GlossaryTermsQuery,
  GlossaryTermsResponse,
} from '@backstage/plugin-glossary-common';

/**
 * API reference for the glossary plugin
 *
 * @public
 */
export const glossaryApiRef = createApiRef<GlossaryApi>({
  id: 'plugin.glossary.service',
});

/**
 * API interface for glossary operations
 *
 * @public
 */
export interface GlossaryApi {
  /**
   * Get all glossary terms based on query parameters
   */
  getGlossaryTerms(query?: GlossaryTermsQuery): Promise<GlossaryTermsResponse>;

  /**
   * Get a specific glossary term by ID
   */
  getGlossaryTerm(id: string): Promise<GlossaryTerm>;

  /**
   * Create a new glossary term
   */
  createGlossaryTerm(term: CreateGlossaryTermRequest): Promise<GlossaryTerm>;

  /**
   * Update an existing glossary term
   */
  updateGlossaryTerm(
    id: string,
    updates: UpdateGlossaryTermRequest,
  ): Promise<GlossaryTerm>;

  /**
   * Delete a glossary term
   */
  deleteGlossaryTerm(id: string): Promise<void>;
}