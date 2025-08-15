# UptimeRobot Plugin

The UptimeRobot plugin integrates with UptimeRobot's monitoring service to display monitor statuses directly in your Backstage application.

## Features

- Displays all monitors from your UptimeRobot account in a clean table interface
- Shows monitor name, URL, type, status, and check interval
- Real-time status updates with color-coded status indicators
- Supports all UptimeRobot monitor types (HTTP, Keyword, Ping, Port, Heartbeat)

## Installation

### Prerequisites

This plugin requires a UptimeRobot account and API key. You can obtain your API key from the [UptimeRobot My Settings page](https://uptimerobot.com/dashboard#mySettings).

### 1. Install the Plugin Packages

Add the plugin packages to your Backstage application:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @internal/plugin-uptimerobot-backend
yarn --cwd packages/app add @internal/plugin-uptimerobot
```

### 2. Configure the Backend

Add the UptimeRobot backend plugin to your backend. In `packages/backend/src/index.ts`:

```ts
const backend = createBackend();

// ... other plugins

// Add UptimeRobot backend plugin
backend.add(import('@internal/plugin-uptimerobot-backend'));

// ...

backend.start();
```

### 3. Configure the Frontend

Add the UptimeRobot page to your app. In `packages/app/src/App.tsx`:

```tsx
import { UptimeRobotPage } from '@internal/plugin-uptimerobot';

// Add to your routes
<Route path="/uptimerobot" element={<UptimeRobotPage />} />
```

### 4. Add Configuration

Add your UptimeRobot configuration to `app-config.yaml`:

```yaml
uptimerobot:
  apiKey: ur3071305-0156e-8246950675203bb9010

# Add proxy configuration for the backend
proxy:
  endpoints:
    '/api/uptimerobot':
      target: 'http://localhost:7007/api/uptimerobot'
      changeOrigin: true
```

## Configuration

### API Key Configuration

The plugin requires your UptimeRobot API key to be configured in your `app-config.yaml`:

```yaml
uptimerobot:
  apiKey: ur3071305-0156e-8246950675203bb9010  # Your UptimeRobot API key
```

**Security Note**: For production deployments, consider using environment variables or secret management:

```yaml
uptimerobot:
  apiKey: ${UPTIMEROBOT_API_KEY}
```

### Proxy Configuration

The frontend communicates with the backend through a proxy. Add this to your `app-config.yaml`:

```yaml
proxy:
  endpoints:
    '/api/uptimerobot':
      target: 'http://localhost:7007/api/uptimerobot'
      changeOrigin: true
```

For production, update the target URL to match your backend deployment.

## Usage

Once installed and configured, navigate to `/uptimerobot` in your Backstage application to view your monitors.

### Monitor Status Mapping

The plugin maps UptimeRobot status codes to Backstage status components:

- **Up (Status 2)**: Green "Up" indicator
- **Down (Status 8, 9)**: Red "Down" indicator  
- **Paused/Pending (Status 0, 1)**: Yellow "Paused/Pending" indicator

### Monitor Types

The plugin supports all UptimeRobot monitor types:

- **HTTP(s)** (Type 1): Website monitoring
- **Keyword** (Type 2): Keyword presence monitoring
- **Ping** (Type 3): Ping monitoring
- **Port** (Type 4): Port monitoring
- **Heartbeat** (Type 5): Heartbeat monitoring

## API Reference

### Backend Endpoints

The backend plugin provides the following endpoints:

#### GET /api/uptimerobot/health

Health check endpoint that returns the backend status.

**Response:**
```json
{
  "status": "ok"
}
```

#### GET /api/uptimerobot/monitors

Fetches all monitors from your UptimeRobot account.

**Response:**
```json
{
  "stat": "ok",
  "monitors": [
    {
      "id": 123456,
      "friendly_name": "My Website",
      "url": "https://example.com",
      "type": 1,
      "status": 2,
      "interval": 300
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **"Failed to fetch monitors" error**
   - Verify your UptimeRobot API key is correct
   - Ensure the API key has the necessary permissions
   - Check your internet connectivity

2. **Plugin not loading**
   - Verify both backend and frontend plugins are properly installed
   - Check that the proxy configuration is correct
   - Ensure the backend is running and accessible

3. **Empty monitor list**
   - Verify you have monitors configured in your UptimeRobot account
   - Check that your API key has access to the monitors

### Debug Mode

To enable debug logging, set the log level in your backend configuration:

```yaml
backend:
  listen:
    port: 7007
  logger:
    level: debug
```

## Development

### Local Development

1. Clone the repository
2. Install dependencies: `yarn install`
3. Configure your API key in `app-config.local.yaml`
4. Start the backend: `yarn start-backend`
5. Start the frontend: `yarn start`

### Testing

Run the plugin tests:

```bash
# Backend tests
yarn --cwd plugins/uptimerobot-backend test

# Frontend tests  
yarn --cwd plugins/uptimerobot test
```

## Contributing

Contributions are welcome! Please see the [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This plugin is licensed under the Apache-2.0 license.