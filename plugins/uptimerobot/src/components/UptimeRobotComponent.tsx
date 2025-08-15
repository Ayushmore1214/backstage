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
import { useAsync } from 'react-use';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
  StatusOK,
  StatusError,
  StatusWarning,
} from '@backstage/core-components';
import {
  useApi,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

interface Monitor {
  id: number;
  friendly_name: string;
  url: string;
  type: number;
  status: number;
  interval: number;
}

interface UptimeRobotResponse {
  stat: string;
  monitors: Monitor[];
}

const StatusComponent = ({ status }: { status: number }) => {
  switch (status) {
    case 2:
      return <StatusOK>Up</StatusOK>;
    case 8:
    case 9:
      return <StatusError>Down</StatusError>;
    case 0:
    case 1:
      return <StatusWarning>Paused/Pending</StatusWarning>;
    default:
      return <StatusWarning>Unknown</StatusWarning>;
  }
};

const getMonitorType = (type: number): string => {
  const types: { [key: number]: string } = {
    1: 'HTTP(s)',
    2: 'Keyword',
    3: 'Ping',
    4: 'Port',
    5: 'Heartbeat',
  };
  return types[type] || 'Unknown';
};

export const UptimeRobotComponent = () => {
  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef);

  const { value, loading, error } = useAsync(async (): Promise<Monitor[]> => {
    const baseUrl = await discoveryApi.getBaseUrl('uptimerobot');
    const response = await fetchApi.fetch(`${baseUrl}/monitors`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data: UptimeRobotResponse = await response.json();
    return data.monitors || [];
  }, [discoveryApi, fetchApi]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const columns: TableColumn[] = [
    {
      title: 'Name',
      field: 'friendly_name',
    },
    {
      title: 'URL',
      field: 'url',
      render: (row: Monitor) => (
        <a href={row.url} target="_blank" rel="noopener noreferrer">
          {row.url}
        </a>
      ),
    },
    {
      title: 'Type',
      field: 'type',
      render: (row: Monitor) => getMonitorType(row.type),
    },
    {
      title: 'Status',
      field: 'status',
      render: (row: Monitor) => <StatusComponent status={row.status} />,
    },
    {
      title: 'Interval',
      field: 'interval',
      render: (row: Monitor) => `${row.interval}s`,
    },
  ];

  return (
    <Table
      title="UptimeRobot Monitors"
      options={{ search: false, paging: false }}
      columns={columns}
      data={value || []}
    />
  );
};