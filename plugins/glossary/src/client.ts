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

import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import {
  GlossaryTerm,
  CreateGlossaryTermRequest,
  UpdateGlossaryTermRequest,
  GlossaryTermsQuery,
  GlossaryTermsResponse,
} from '@backstage/plugin-glossary-common';
import { GlossaryApi } from './api';

/**
 * Default implementation of the GlossaryApi
 */
export class GlossaryApiClient implements GlossaryApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getGlossaryTerms(query?: GlossaryTermsQuery): Promise<GlossaryTermsResponse> {
    const baseUrl = await this.discoveryApi.getBaseUrl('glossary');
    const url = new URL(`${baseUrl}/terms`);

    if (query?.entityRef) {
      url.searchParams.append('entityRef', query.entityRef);
    }
    if (query?.search) {
      url.searchParams.append('search', query.search);
    }
    if (query?.limit) {
      url.searchParams.append('limit', query.limit.toString());
    }
    if (query?.offset) {
      url.searchParams.append('offset', query.offset.toString());
    }

    const response = await this.fetchApi.fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch glossary terms: ${response.statusText}`);
    }

    return response.json();
  }

  async getGlossaryTerm(id: string): Promise<GlossaryTerm> {
    const baseUrl = await this.discoveryApi.getBaseUrl('glossary');
    const response = await this.fetchApi.fetch(`${baseUrl}/terms/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch glossary term: ${response.statusText}`);
    }

    return response.json();
  }

  async createGlossaryTerm(term: CreateGlossaryTermRequest): Promise<GlossaryTerm> {
    const baseUrl = await this.discoveryApi.getBaseUrl('glossary');
    const response = await this.fetchApi.fetch(`${baseUrl}/terms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(term),
    });

    if (!response.ok) {
      throw new Error(`Failed to create glossary term: ${response.statusText}`);
    }

    return response.json();
  }

  async updateGlossaryTerm(
    id: string,
    updates: UpdateGlossaryTermRequest,
  ): Promise<GlossaryTerm> {
    const baseUrl = await this.discoveryApi.getBaseUrl('glossary');
    const response = await this.fetchApi.fetch(`${baseUrl}/terms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update glossary term: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteGlossaryTerm(id: string): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('glossary');
    const response = await this.fetchApi.fetch(`${baseUrl}/terms/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete glossary term: ${response.statusText}`);
    }
  }
}