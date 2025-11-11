/**
 * User Management Resource Handler
 *
 * Handles operations related to users, accounts, teams, and invitations
 */

import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPATCH,
	infomaniakApiRequestDELETE,
	buildRequestBody,
	validateEmail,
	validateNonEmptyString,
	parseOrReturn,
	parseIdArray,
} from '../utils';
import { User, Account, Team, RequestBody } from '../types';

export class UserManagementResource {
	/**
	 * Execute User Management operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const subResource = context.getNodeParameter('subResource', itemIndex) as string;

		if (subResource === 'core') {
			return await this.executeCore(context, operation, itemIndex);
		} else if (subResource === 'accounts') {
			return await this.executeAccounts(context, operation, itemIndex);
		} else if (subResource === 'teams') {
			return await this.executeTeams(context, operation, itemIndex);
		}

		return [];
	}

	/**
	 * Execute Core operations (invitations)
	 */
	private static async executeCore(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		if (operation === 'inviteUser') {
			return await this.inviteUser(context, itemIndex);
		} else if (operation === 'cancelInvitation') {
			return await this.cancelInvitation(context, itemIndex);
		}

		return [];
	}

	/**
	 * Execute Accounts operations
	 */
	private static async executeAccounts(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		if (operation === 'listAccounts') {
			return await this.listAccounts(context, itemIndex);
		} else if (operation === 'getAccount') {
			return await this.getAccount(context, itemIndex);
		} else if (operation === 'listUsers') {
			return await this.listUsers(context, itemIndex);
		}

		return [];
	}

	/**
	 * Execute Teams operations
	 */
	private static async executeTeams(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			listTeams: () => this.listTeams(context, itemIndex),
			createTeam: () => this.createTeam(context, itemIndex),
			getTeam: () => this.getTeam(context, itemIndex),
			updateTeam: () => this.updateTeam(context, itemIndex),
			deleteTeam: () => this.deleteTeam(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Invite a user to an account
	 * POST /accounts/{account}/invitations
	 */
	private static async inviteUser(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const email = context.getNodeParameter('email', itemIndex) as string;
		const firstName = context.getNodeParameter('firstName', itemIndex) as string;
		const lastName = context.getNodeParameter('lastName', itemIndex) as string;
		const locale = context.getNodeParameter('locale', itemIndex) as string;
		const roleType = context.getNodeParameter('roleType', itemIndex) as number;
		const additionalOptions = context.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, unknown>;

		// Validate required parameters
		validateNonEmptyString(accountId, 'Account ID');
		validateEmail(email);
		validateNonEmptyString(firstName, 'First Name');
		validateNonEmptyString(lastName, 'Last Name');

		// Build request body
		const body: any = {
			email: email.trim(),
			first_name: firstName.trim(),
			last_name: lastName.trim(),
			locale,
			role_type: roleType,
		};

		// Add optional parameters
		if (additionalOptions.silent !== undefined) {
			body.silent = additionalOptions.silent;
		}
		if (additionalOptions.strict !== undefined) {
			body.strict = additionalOptions.strict;
		}
		if (additionalOptions.teams && typeof additionalOptions.teams === 'string') {
			const teamsArray = parseIdArray(additionalOptions.teams as string);
			if (teamsArray.length > 0) {
				body.teams = teamsArray;
			}
		}
		if (additionalOptions.notifications) {
			body.notifications = parseOrReturn(additionalOptions.notifications as string | object, {});
		}
		if (additionalOptions.permissions) {
			body.permissions = parseOrReturn(additionalOptions.permissions as string | object, {});
		}

		try {
			const data = await infomaniakApiRequestPOST<User>(
				context,
				`/accounts/${accountId.trim()}/invitations`,
				body,
				undefined,
				itemIndex,
			);

			return context.helpers.returnJsonArray(data as unknown as any);
		} catch (error: unknown) {
			// Enhanced error reporting for 422 errors
			if (error && typeof error === 'object' && 'httpCode' in error && error.httpCode === '422') {
				throw new NodeOperationError(
					context.getNode(),
					`Invitation failed (422): ${JSON.stringify(error)}. Account ID: ${accountId}, Email: ${email}`,
					{ itemIndex },
				);
			}
			throw error;
		}
	}

	/**
	 * Cancel an invitation
	 * DELETE /accounts/{account}/invitations/{invitation}
	 */
	private static async cancelInvitation(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const invitationId = context.getNodeParameter('invitationId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/accounts/${accountId}/invitations/${invitationId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			message: `Invitation ${invitationId} cancelled successfully`,
		});
	}

	/**
	 * List all accounts
	 * GET /accounts
	 */
	private static async listAccounts(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const data = await infomaniakApiRequestGET<Account[]>(
			context,
			'/accounts',
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Get a single account
	 * GET /accounts/{account_id}
	 */
	private static async getAccount(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<Account>(
			context,
			`/accounts/${accountId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * List users in an account (uses v2 API)
	 * GET /2/accounts/{account}/users
	 */
	private static async listUsers(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;

		// Note: This uses v2 API - needs special handling in apiRequest
		const data = await infomaniakApiRequestGET<User[]>(
			context,
			`/accounts/${accountId}/users`, // Will be prefixed with /2 in API config
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * List teams in an account
	 * GET /accounts/{account}/teams
	 */
	private static async listTeams(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<Team[]>(
			context,
			`/accounts/${accountId}/teams`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Create a team
	 * POST /accounts/{account}/teams
	 */
	private static async createTeam(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const teamData = context.getNodeParameter('teamData', itemIndex) as Record<string, unknown>;

		// Validate required parameter
		const teamName = validateNonEmptyString(teamData.name, 'Team Name');

		// Build request body
		const body: any = {
			name: teamName,
		};

		// Add optional parameters
		if (teamData.ownedById && typeof teamData.ownedById === 'string' && teamData.ownedById.trim()) {
			body.owned_by_id = teamData.ownedById.trim();
		}
		if (teamData.permissions) {
			body.permissions = parseOrReturn(teamData.permissions as string | object, {});
		}

		const data = await infomaniakApiRequestPOST<Team>(
			context,
			`/accounts/${accountId}/teams`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Get a single team
	 * GET /accounts/{account}/teams/{team}
	 */
	private static async getTeam(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const teamId = context.getNodeParameter('teamId', itemIndex) as string;

		const data = await infomaniakApiRequestGET<Team>(
			context,
			`/accounts/${accountId}/teams/${teamId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Update a team
	 * PATCH /accounts/{account}/teams/{team}
	 */
	private static async updateTeam(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const teamId = context.getNodeParameter('teamId', itemIndex) as string;
		const teamData = context.getNodeParameter('teamData', itemIndex) as Record<string, unknown>;

		// Build request body - only include provided fields
		const bodyObj: any = {};
		if (teamData.name && typeof teamData.name === 'string' && teamData.name.trim()) {
			bodyObj.name = teamData.name.trim();
		}
		if (teamData.ownedById && typeof teamData.ownedById === 'string' && teamData.ownedById.trim()) {
			bodyObj.ownedById = teamData.ownedById.trim();
		}
		const body: RequestBody = buildRequestBody(bodyObj);

		if (teamData.permissions) {
			body.permissions = parseOrReturn(teamData.permissions as string | object, {});
		}

		const data = await infomaniakApiRequestPATCH<Team>(
			context,
			`/accounts/${accountId}/teams/${teamId}`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Delete a team
	 * DELETE /accounts/{account}/teams/{team}
	 */
	private static async deleteTeam(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const accountId = context.getNodeParameter('accountId', itemIndex) as string;
		const teamId = context.getNodeParameter('teamId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/accounts/${accountId}/teams/${teamId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			message: `Team ${teamId} deleted successfully`,
		});
	}
}
