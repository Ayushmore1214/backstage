/*
 * Copyright 2021 The Backstage Authors
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

export { AuthorizeResult } from './api';
export type {
  EvaluatePermissionRequest,
  EvaluatePermissionRequestBatch,
  EvaluatePermissionResponse,
  EvaluatePermissionResponseBatch,
  IdentifiedPermissionMessage,
  PermissionMessageBatch,
  AuthorizePermissionRequest,
  AuthorizePermissionResponse,
  QueryPermissionRequest,
  QueryPermissionResponse,
  EvaluatorRequestOptions,
  PermissionEvaluator,
  ConditionalPolicyDecision,
  DefinitivePolicyDecision,
  PolicyDecision,
  PermissionCondition,
  PermissionCriteria,
  PermissionRuleParam,
  PermissionRuleParams,
  AllOfCriteria,
  AnyOfCriteria,
  NotCriteria,
} from './api';
export type { DiscoveryApi } from './discovery';
export type {
  MetadataResponse,
  MetadataResponseSerializedRule,
} from './integration';
export type {
  BasicPermission,
  PermissionAttributes,
  Permission,
  PermissionBase,
  ResourcePermission,
  AuthorizeRequestOptions,
} from './permission';
export type { PermissionAuthorizer } from './deprecated';
