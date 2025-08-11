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

import express, { Router } from 'express';
import { GlossaryDatabase } from './database';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { InputError, NotFoundError } from '@backstage/errors';

export interface RouterOptions {
  database: GlossaryDatabase;
  identity: any; // IdentityApi
}

export async function createRouter(options: RouterOptions): Promise<Router> {
  const { database } = options;
  const router = Router();

  router.use(express.json());

  // Get all glossary terms
  router.get('/terms', async (req, res) => {
    const { entityRef, search, limit, offset } = req.query;

    const limitNum = limit ? parseInt(limit as string, 10) : undefined;
    const offsetNum = offset ? parseInt(offset as string, 10) : undefined;

    if (limit && (isNaN(limitNum!) || limitNum! < 0)) {
      throw new InputError('Invalid limit parameter');
    }

    if (offset && (isNaN(offsetNum!) || offsetNum! < 0)) {
      throw new InputError('Invalid offset parameter');
    }

    const result = await database.getGlossaryTerms({
      entityRef: entityRef as string,
      search: search as string,
      limit: limitNum,
      offset: offsetNum,
    });

    res.json(result);
  });

  // Get a specific glossary term
  router.get('/terms/:id', async (req, res) => {
    const { id } = req.params;
    const term = await database.getGlossaryTerm(id);

    if (!term) {
      throw new NotFoundError(`Glossary term with id ${id} not found`);
    }

    res.json(term);
  });

  // Create a new glossary term
  router.post('/terms', async (req, res) => {
    const { term, definition, entityRef } = req.body;

    if (!term || !definition || !entityRef) {
      throw new InputError('Missing required fields: term, definition, entityRef');
    }

    // Validate entityRef format
    if (!entityRef.kind || !entityRef.name) {
      throw new InputError('Invalid entityRef: must have kind and name');
    }

    const createdBy = 'user:default/guest'; // TODO: Get from auth identity

    const createdTerm = await database.createGlossaryTerm(
      { term, definition, entityRef },
      createdBy,
    );

    res.status(201).json(createdTerm);
  });

  // Update a glossary term
  router.put('/terms/:id', async (req, res) => {
    const { id } = req.params;
    const { term, definition, entityRef } = req.body;

    // Check if term exists
    const existingTerm = await database.getGlossaryTerm(id);
    if (!existingTerm) {
      throw new NotFoundError(`Glossary term with id ${id} not found`);
    }

    const updates: any = {};
    if (term) updates.term = term;
    if (definition) updates.definition = definition;
    if (entityRef) updates.entityRef = entityRef;

    const updatedTerm = await database.updateGlossaryTerm(id, updates);
    res.json(updatedTerm);
  });

  // Delete a glossary term
  router.delete('/terms/:id', async (req, res) => {
    const { id } = req.params;

    // Check if term exists
    const existingTerm = await database.getGlossaryTerm(id);
    if (!existingTerm) {
      throw new NotFoundError(`Glossary term with id ${id} not found`);
    }

    await database.deleteGlossaryTerm(id);
    res.status(204).send();
  });

  return router;
}