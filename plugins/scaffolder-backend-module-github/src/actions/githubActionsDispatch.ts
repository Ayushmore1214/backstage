/*
 * Copyright 2023 The Backstage Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

// --- Imports ---
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { Octokit } from 'octokit';
import { getOctokitOptions } from '../util';
import { examples } from './githubActionsDispatch.examples';
import { z } from 'zod';
import { Buffer } from 'buffer';
import unzipper from 'unzipper';

export function createGithubActionsDispatchAction(options: {}) {
  return createTemplateAction({
    id: 'github:actions:dispatch',
    description:
      'Dispatches a GitHub Action workflow for a given branch or tag, optionally waits for completion and fetches output artifact',
    examples,
    schema: {
      input: z.object({
        owner: z.string({
          description: 'GitHub repository owner (org or user)',
        }),
        repo: z.string({
          description: 'GitHub repository name',
        }),
        workflowId: z.union([z.string(), z.number()]).describe(
          'ID or filename of the workflow to dispatch',
        ),
        branchOrTagName: z.string().describe(
          'Branch or tag to run the workflow on',
        ),
        workflowInputs: z.record(z.string()).optional().describe(
          'Input parameters to the workflow (if any)',
        ),
        token: z.string().optional().describe(
          'GitHub token to use for authentication',
        ),
        waitForCompletion: z.boolean()
          .optional()
          .default(false)
          .describe('Wait for workflow run to complete before continuing'),
        outputArtifactName: z.string()
          .optional()
          .describe(
            'Name of JSON artifact to fetch from completed workflow run',
          ),
      }),
    },
    async handler(ctx) {
      const {
        owner,
        repo,
        workflowId,
        branchOrTagName,
        workflowInputs,
        token: providedToken,
        waitForCompletion = false,
        outputArtifactName,
      } = ctx.input;

      const token =
        providedToken ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
      if (!token) {
        throw new Error(
          'A GitHub token must be provided in input or environment variables',
        );
      }

      const client = new Octokit(getOctokitOptions(token));

      ctx.logger.info(
        `Dispatching GitHub workflow ${workflowId} on ${owner}/${repo}@${branchOrTagName}`,
      );

      // Dispatch the workflow
      await client.rest.actions.createWorkflowDispatch({
        owner,
        repo,
        workflow_id: workflowId,
        ref: branchOrTagName,
        inputs: workflowInputs,
      });

      ctx.logger.info(`Workflow ${workflowId} dispatched successfully`);

      if (!waitForCompletion) {
        ctx.logger.info('Not waiting for completion (waitForCompletion is false)');
        return;
      }

      ctx.logger.info('Waiting for workflow run to be created...');
      let workflowRun;
      const maxRunPollAttempts = 12;
      for (let i = 0; i < maxRunPollAttempts; i++) {
        const { data } = await client.rest.actions.listWorkflowRuns({
          owner,
          repo,
          workflow_id: workflowId,
          event: 'workflow_dispatch',
          branch: branchOrTagName,
          per_page: 5,
        });
        workflowRun = data.workflow_runs
          .filter(run => run.head_branch === branchOrTagName)
          .sort(
            (a, b) =>
              +new Date(b.created_at) - +new Date(a.created_at),
          )[0];
        if (workflowRun) break;
        ctx.logger.info('Workflow run not found yet, retrying in 5 seconds...');
        await new Promise(res => setTimeout(res, 5000));
      }

      if (!workflowRun) {
        throw new Error('Unable to find workflow run for dispatch');
      }

      const runId = workflowRun.id;
      ctx.logger.info(`Found workflow run: ${runId}`);

      // Poll for workflow completion
      const maxPollAttempts = 60;
      const pollIntervalMs = 5000;
      let completed = false;
      let runData = workflowRun;

      ctx.logger.info('Polling workflow run for completion...');
      for (let attempt = 0; attempt < maxPollAttempts; attempt++) {
        const { data: run } = await client.rest.actions.getWorkflowRun({
          owner,
          repo,
          run_id: runId,
        });

        if (run.status === 'completed') {
          completed = true;
          runData = run;
          break;
        }

        ctx.logger.info(
          `Attempt ${attempt + 1}: Workflow status = ${run.status}, waiting ${pollIntervalMs / 1000}s...`,
        );
        await new Promise(res => setTimeout(res, pollIntervalMs));
      }

      if (!completed) {
        throw new Error('Timed out waiting for workflow completion');
      }

      ctx.logger.info(
        `Workflow run completed with conclusion: ${runData.conclusion}`,
      );
      ctx.output('conclusion', runData.conclusion);

      // Fetch and output artifact JSON if specified
      if (!outputArtifactName) return;

      ctx.logger.info(
        `Fetching output artifact '${outputArtifactName}' for run ${runId}`,
      );
      const { data: artifactsData } = await client.rest.actions.listWorkflowRunArtifacts({
        owner,
        repo,
        run_id: runId,
      });

      const artifact = artifactsData.artifacts.find(
        a => a.name === outputArtifactName,
      );

      if (!artifact) {
        ctx.logger.warn(`Artifact '${outputArtifactName}' not found`);
        return;
      }

      const { data: zipData } = await client.rest.actions.downloadArtifact({
        owner,
        repo,
        artifact_id: artifact.id,
        archive_format: 'zip',
      });

      try {
        const zipBuffer = Buffer.from(zipData as Uint8Array);
        const directory = await unzipper.Open.buffer(zipBuffer);

        let outputJson: any = undefined;
        for (const file of directory.files) {
          if (file.path.endsWith('.json')) {
            const content = await file.buffer();
            outputJson = JSON.parse(content.toString('utf8'));
            break;
          }
        }

        if (outputJson) {
          ctx.logger.info('Output artifact JSON parsed successfully');
          ctx.output('outputs', outputJson);
        } else {
          ctx.logger.warn('No JSON file found inside output artifact ZIP');
        }
      } catch (error) {
        ctx.logger.warn(`Failed to extract or parse output artifact: ${error}`);
      }
    },
  });
}
