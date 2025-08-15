# UptimeRobot Backend Plugin

Backend plugin for the UptimeRobot integration. This plugin provides API endpoints to fetch monitor data from UptimeRobot.

## Installation

```bash
yarn --cwd packages/backend add @internal/plugin-uptimerobot-backend
```

Then add to your backend in `packages/backend/src/index.ts`:

```ts
backend.add(import('@internal/plugin-uptimerobot-backend'));
```

## Configuration

Add your UptimeRobot API key to `app-config.yaml`:

```yaml
uptimerobot:
  apiKey: ur3071305-0156e-8246950675203bb9010
```

## API Endpoints

- `GET /api/uptimerobot/health` - Health check
- `GET /api/uptimerobot/monitors` - Fetch all monitors

See the main [UptimeRobot plugin README](../uptimerobot/README.md) for full documentation.