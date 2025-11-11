/**
 * n8n Node Type Definitions
 *
 * This file contains TypeScript types specific to n8n node operations.
 */

import { IExecuteFunctions } from 'n8n-workflow';

// ============================================================================
// Resource and Operation Types
// ============================================================================

export type Resource =
	| 'action'
	| 'country'
	| 'event'
	| 'language'
	| 'product'
	| 'profile'
	| 'task'
	| 'timezone'
	| 'userManagement'
	| 'kSuite';

export type ActionOperation = 'getAll' | 'get';
export type CountryOperation = 'getAll' | 'get';
export type EventOperation = 'getAll' | 'get' | 'getPublicCloudStatus';
export type LanguageOperation = 'getAll' | 'get';
export type ProductOperation = 'getAll';
export type TaskOperation = 'getAll' | 'get';
export type TimezoneOperation = 'getAll' | 'get';

export type ProfileOperation =
	| 'get'
	| 'update'
	| 'uploadAvatar'
	| 'deleteAvatar'
	| 'getAppPasswords'
	| 'createAppPassword'
	| 'getAppPassword'
	| 'getEmails'
	| 'getEmail'
	| 'deleteEmail'
	| 'getPhones'
	| 'getPhone'
	| 'deletePhone';

export type UserManagementOperation =
	| 'inviteUser'
	| 'cancelInvitation'
	| 'listAccounts'
	| 'getAccount'
	| 'listUsers'
	| 'listTeams'
	| 'createTeam'
	| 'getTeam'
	| 'updateTeam'
	| 'deleteTeam';

export type KSuiteOperation =
	| 'getMykSuite'
	| 'getCurrentMykSuite'
	| 'cancelUnsubscribe'
	| 'getWorkspaceUsers'
	| 'attachMailbox'
	| 'setPrimaryMailbox'
	| 'updateMailboxPassword'
	| 'unlinkMailbox';

export type Operation =
	| ActionOperation
	| CountryOperation
	| EventOperation
	| LanguageOperation
	| ProductOperation
	| ProfileOperation
	| TaskOperation
	| TimezoneOperation
	| UserManagementOperation
	| KSuiteOperation;

// ============================================================================
// Resource Handler Type
// ============================================================================

/**
 * Interface for resource handlers
 */
export interface IResourceHandler {
	execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<unknown>;
}

// ============================================================================
// Credentials Type
// ============================================================================

export interface InfomaniakCredentials {
	apiToken: string;
}
