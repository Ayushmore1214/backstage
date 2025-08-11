/*
 * Example integration of the glossary plugin into a Backstage app
 * 
 * This file shows how to integrate the glossary plugin into your Backstage app.
 * Add these changes to your existing app files.
 */

// 1. In packages/app/src/App.tsx - Add the global glossary route

import { GlossaryPage } from '@backstage/plugin-glossary';

const routes = (
  <FlatRoutes>
    {/* existing routes... */}
    <Route path="/glossary" element={<GlossaryPage />} />
  </FlatRoutes>
);

// 2. In packages/app/src/components/Root/Root.tsx - Add sidebar navigation

import BookIcon from '@material-ui/icons/Book';

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      {/* existing sidebar items... */}
      <SidebarItem icon={BookIcon} to="glossary" text="Glossary" />
    </Sidebar>
    {children}
  </SidebarPage>
);

// 3. In packages/app/src/components/catalog/EntityPage.tsx - Add entity glossary card

import { EntityGlossaryCard } from '@backstage/plugin-glossary';

const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    {/* existing cards... */}
    <Grid item md={6} xs={12}>
      <EntityGlossaryCard />
    </Grid>
  </Grid>
);

// 4. In packages/backend/src/index.ts - Add backend plugin

import { glossaryPlugin } from '@backstage/plugin-glossary-backend';

const backend = createBackend();

// Add other plugins...
backend.add(glossaryPlugin);

backend.start();