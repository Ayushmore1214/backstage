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

import express from 'express';
import Router from 'express-promise-router';
import { LoggerService, RootConfigService } from '@backstage/backend-plugin-api';
import fetch from 'node-fetch';

/**
 * Dependencies of the UptimeRobot router
 */
export interface RouterOptions {
  logger: LoggerService;
  config: RootConfigService;
}

/**
 * Creates an express.Router with UptimeRobot endpoints
 *
 * @param options - the dependencies of the router
 * @returns an express.Router
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('UptimeRobot health check');
    response.json({ status: 'ok' });
  });

  router.get('/monitors', async (_req, res) => {
    try {
      const apiKey = config.getString('uptimerobot.apiKey');
      
      const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `api_key=${apiKey}&format=json`,
      });

      if (!response.ok) {
        throw new Error(`UptimeRobot API error: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      logger.error('Failed to fetch monitors from UptimeRobot', error);
      res.status(500).json({ error: 'Failed to fetch monitors' });
    }
  });

  return router;
}