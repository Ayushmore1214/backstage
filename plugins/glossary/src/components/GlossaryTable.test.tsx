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

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestApiRegistry, TestApiProvider } from '@backstage/test-utils';
import { glossaryApiRef } from '../api';
import { GlossaryTable } from './GlossaryTable';

const mockApi = {
  getGlossaryTerms: jest.fn().mockResolvedValue({
    terms: [
      {
        id: '1',
        term: 'Test Term',
        definition: 'Test Definition',
        entityRef: { kind: 'Component', namespace: 'default', name: 'test' },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user:default/test',
      },
    ],
    total: 1,
  }),
  getGlossaryTerm: jest.fn(),
  createGlossaryTerm: jest.fn(),
  updateGlossaryTerm: jest.fn(),
  deleteGlossaryTerm: jest.fn(),
};

describe('GlossaryTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the glossary table with terms', async () => {
    const apis = TestApiRegistry.from([glossaryApiRef, mockApi]);

    render(
      <TestApiProvider apis={apis}>
        <GlossaryTable />
      </TestApiProvider>,
    );

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the terms to load
    await screen.findByText('Test Term');
    expect(screen.getByText('Test Definition')).toBeInTheDocument();
  });

  it('shows add button', async () => {
    const apis = TestApiRegistry.from([glossaryApiRef, mockApi]);

    render(
      <TestApiProvider apis={apis}>
        <GlossaryTable />
      </TestApiProvider>,
    );

    await screen.findByText('Add Term');
    expect(screen.getByText('Add Term')).toBeInTheDocument();
  });
});