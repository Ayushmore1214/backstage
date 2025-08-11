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

import {
  createPlugin,
  createRoutableExtension,
  createApiFactory,
  configApiRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { glossaryApiRef } from './api';
import { GlossaryApiClient } from './client';

/**
 * The Backstage plugin for managing glossary terms
 */
export const glossaryPlugin = createPlugin({
  id: 'glossary',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: glossaryApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new GlossaryApiClient({ discoveryApi, fetchApi }),
    }),
  ],
});

/**
 * The Glossary page
 */
export const GlossaryPage = glossaryPlugin.provide(
  createRoutableExtension({
    name: 'GlossaryPage',
    component: () =>
      import('./components/GlossaryPage').then(m => m.GlossaryPage),
    mountPoint: rootRouteRef,
  }),
);

/**
 * The Entity Glossary card
 */
export const EntityGlossaryCard = glossaryPlugin.provide(
  createRoutableExtension({
    name: 'EntityGlossaryCard',
    component: () =>
      import('./components/EntityGlossaryCard').then(m => m.EntityGlossaryCard),
    mountPoint: rootRouteRef,
  }),
);