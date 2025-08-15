import React, { useState, useEffect } from 'react';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { 
  Chip, 
  Typography, 
  Link,
  makeStyles,
  Card,
  CardContent,
  Box,
} from '@material-ui/core';
import {
  CheckCircle as UpIcon,
  Error as DownIcon,
  Pause as PausedIcon,
  Help as UnknownIcon,
  Refresh as RefreshIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  statusChip: {
    minWidth: 80,
  },
  upStatus: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  downStatus: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  pausedStatus: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
  unknownStatus: {
    backgroundColor: theme.palette.grey[500],
    color: theme.palette.grey[50],
  },
  refreshButton: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '&:hover': {
      opacity: 0.7,
    },
  },
}));

interface Monitor {
  id: string;
  name: string;
  url: string;
  status: number;
  statusText: string;
  type: number;
  typeText: string;
  interval: number;
  createDateTime: number;
}

interface MonitorsResponse {
  monitors: Monitor[];
  total: number;
}

const StatusIcon = ({ status }: { status: number }) => {
  switch (status) {
    case 2: return <UpIcon fontSize="small" />;
    case 8:
    case 9: return <DownIcon fontSize="small" />;
    case 0: return <PausedIcon fontSize="small" />;
    default: return <UnknownIcon fontSize="small" />;
  }
};

const StatusChip = ({ monitor }: { monitor: Monitor }) => {
  const classes = useStyles();
  
  const getStatusClass = (status: number) => {
    switch (status) {
      case 2: return classes.upStatus;
      case 8:
      case 9: return classes.downStatus;
      case 0: return classes.pausedStatus;
      default: return classes.unknownStatus;
    }
  };

  return (
    <Chip
      icon={<StatusIcon status={monitor.status} />}
      label={monitor.statusText}
      className={`${classes.statusChip} ${getStatusClass(monitor.status)}`}
      size="small"
    />
  );
};

// Mock data for demo - in real implementation this would come from UptimeRobot API
const mockData: MonitorsResponse = {
  monitors: [
    {
      id: "1",
      name: "Main Website",
      url: "https://example.com",
      status: 2,
      statusText: "Up",
      type: 1,
      typeText: "HTTP(s)",
      interval: 300,
      createDateTime: 1640995200,
    },
    {
      id: "2", 
      name: "API Service",
      url: "https://api.example.com",
      status: 2,
      statusText: "Up",
      type: 1,
      typeText: "HTTP(s)",
      interval: 60,
      createDateTime: 1640995200,
    },
    {
      id: "3",
      name: "Database Server", 
      url: "db.example.com",
      status: 9,
      statusText: "Down",
      type: 4,
      typeText: "Port",
      interval: 300,
      createDateTime: 1640995200,
    },
    {
      id: "4",
      name: "CDN Endpoint",
      url: "https://cdn.example.com",
      status: 0,
      statusText: "Paused",
      type: 1,
      typeText: "HTTP(s)",
      interval: 600,
      createDateTime: 1640995200,
    },
    {
      id: "5",
      name: "Mail Server",
      url: "mail.example.com",
      status: 2,
      statusText: "Up", 
      type: 4,
      typeText: "Port",
      interval: 300,
      createDateTime: 1640995200,
    },
  ],
  total: 5,
};

export const UptimeRobotTable = () => {
  const classes = useStyles();
  const [data, setData] = useState<MonitorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would make an API call to UptimeRobot
      // For demo purposes, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally fetch from your backend:
      // const response = await fetch('/api/uptimerobot/monitors');
      // const result = await response.json();
      // setData(result);
      
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch monitors'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error" variant="h6">
            Unable to connect to UptimeRobot API
          </Typography>
          <Typography variant="body2" style={{ marginTop: 8, marginBottom: 16 }}>
            This demo shows how the UptimeRobot plugin would work with live data. 
            To enable live data, configure your UptimeRobot API key in app-config.yaml.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Error: {error.message}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!data?.monitors?.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" style={{ textAlign: 'center', padding: '2rem' }}>
            No monitors found. Please check your UptimeRobot API configuration.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const columns: TableColumn[] = [
    {
      title: 'Status',
      field: 'status',
      render: (row: Monitor) => <StatusChip monitor={row} />,
      width: '120px',
    },
    {
      title: 'Monitor Name',
      field: 'name',
      highlight: true,
      render: (row: Monitor) => (
        <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
          {row.name}
        </Typography>
      ),
    },
    {
      title: 'URL',
      field: 'url',
      render: (row: Monitor) => (
        <Link 
          href={row.url} 
          target="_blank" 
          rel="noopener noreferrer"
          color="primary"
        >
          {row.url}
        </Link>
      ),
    },
    {
      title: 'Type',
      field: 'typeText',
      width: '100px',
    },
    {
      title: 'Interval',
      field: 'interval',
      render: (row: Monitor) => `${row.interval}s`,
      width: '100px',
    },
    {
      title: 'Created',
      field: 'createDateTime',
      render: (row: Monitor) => new Date(row.createDateTime * 1000).toLocaleDateString(),
      width: '120px',
    },
  ];

  return (
    <Card>
      <CardContent>
        <Box className={classes.refreshButton} onClick={fetchData}>
          <RefreshIcon style={{ marginRight: 8 }} />
          <Typography variant="body2">Refresh Data</Typography>
        </Box>
        
        <Table
          title={`UptimeRobot Monitors (${data.total}) - Demo Mode`}
          options={{
            search: true,
            paging: true,
            pageSize: 10,
            pageSizeOptions: [5, 10, 20, 50],
          }}
          columns={columns}
          data={data.monitors}
        />
        
        <Box style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
          <Typography variant="body2" color="textSecondary">
            <strong>Demo Mode:</strong> This table shows sample data to demonstrate the UptimeRobot plugin functionality.
            In production, this would display live monitor data from your UptimeRobot account using API key: ur3071305-0156e8246950675203bb9010
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};