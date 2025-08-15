import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { UptimeRobotTable } from './UptimeRobotTable';

export const UptimeRobotPage = () => (
  <Page themeId="tool">
    <Header title="UptimeRobot Monitors" subtitle="Monitor your website uptime and status">
      <HeaderLabel label="Owner" value="Platform Team" />
      <HeaderLabel label="Lifecycle" value="Production" />
    </Header>
    <Content>
      <ContentHeader title="Monitor Status Dashboard">
        <SupportButton>
          View and monitor the status of all your websites and services through UptimeRobot integration.
        </SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <UptimeRobotTable />
        </Grid>
      </Grid>
    </Content>
  </Page>
);