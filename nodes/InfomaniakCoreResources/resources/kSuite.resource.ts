/**
 * kSuite Resource Handler
 *
 * Handles operations related to kSuite workspaces, mailboxes, and product management
 * Note: Most kSuite operations use v2 API endpoints
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPUT,
	infomaniakApiRequestDELETE,
	buildQueryString,
} from '../utils';
import { MySuite, Mailbox } from '../types';

export class KSuiteResource {
	/**
	 * Execute kSuite operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const subResource = context.getNodeParameter('kSuiteSubResource', itemIndex) as string;

		if (subResource === 'workspace') {
			return await this.executeWorkspace(context, operation, itemIndex);
		} else if (subResource === 'mykSuite') {
			return await this.executeMykSuite(context, operation, itemIndex);
		} else if (subResource === 'productManagement') {
			return await this.executeProductManagement(context, operation, itemIndex);
		}

		return [];
	}

	/**
	 * Execute Workspace operations (v2 API)
	 */
	private static async executeWorkspace(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getWorkspaceUsers: () => this.getWorkspaceUsers(context, itemIndex),
			attachMailbox: () => this.attachMailbox(context, itemIndex),
			setPrimaryMailbox: () => this.setPrimaryMailbox(context, itemIndex),
			updateMailboxPassword: () => this.updateMailboxPassword(context, itemIndex),
			unlinkMailbox: () => this.unlinkMailbox(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Execute mykSuite operations
	 */
	private static async executeMykSuite(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		if (operation === 'getMykSuite') {
			return await this.getMykSuite(context, itemIndex);
		} else if (operation === 'getCurrentMykSuite') {
			return await this.getCurrentMykSuite(context, itemIndex);
		}

		return [];
	}

	/**
	 * Execute Product Management operations
	 */
	private static async executeProductManagement(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		if (operation === 'cancelUnsubscribe') {
			return await this.cancelUnsubscribe(context, itemIndex);
		}

		return [];
	}

	/**
	 * Get workspace users (mailboxes)
	 * GET /2/profile/ksuites/mailboxes
	 */
	private static async getWorkspaceUsers(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const data = await infomaniakApiRequestGET<Mailbox[]>(
			context,
			'/profile/ksuites/mailboxes',
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Attach a mailbox
	 * POST /2/profile/ksuites/mailboxes
	 */
	private static async attachMailbox(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailboxData = context.getNodeParameter('mailboxData', itemIndex) as Record<string, unknown>;

		const body: any = {
			password: mailboxData.password,
		};

		if (mailboxData.isPrimary !== undefined) {
			body.is_primary = mailboxData.isPrimary;
		}

		const data = await infomaniakApiRequestPOST<Mailbox>(
			context,
			'/profile/ksuites/mailboxes',
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Set primary mailbox
	 * PUT /2/profile/ksuites/mailboxes/{mailbox_id}/set_primary
	 */
	private static async setPrimaryMailbox(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailboxId = context.getNodeParameter('mailboxId', itemIndex) as string;

		await infomaniakApiRequestPUT(
			context,
			`/profile/ksuites/mailboxes/${mailboxId}/set_primary`,
			undefined,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			message: `Mailbox ${mailboxId} set as primary successfully`,
		});
	}

	/**
	 * Update mailbox password
	 * PUT /2/profile/ksuites/mailboxes/{mailbox_id}/update_password
	 */
	private static async updateMailboxPassword(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailboxId = context.getNodeParameter('mailboxId', itemIndex) as string;
		const newPassword = context.getNodeParameter('newPassword', itemIndex) as string;

		const body: any = {
			password: newPassword,
		};

		await infomaniakApiRequestPUT(
			context,
			`/profile/ksuites/mailboxes/${mailboxId}/update_password`,
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			message: `Mailbox ${mailboxId} password updated successfully`,
		});
	}

	/**
	 * Unlink a mailbox
	 * DELETE /2/profile/ksuites/mailboxes/{mailbox_id}
	 */
	private static async unlinkMailbox(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mailboxId = context.getNodeParameter('mailboxId', itemIndex) as string;

		await infomaniakApiRequestDELETE(
			context,
			`/profile/ksuites/mailboxes/${mailboxId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			message: `Mailbox ${mailboxId} unlinked successfully`,
		});
	}

	/**
	 * Get mykSuite by ID
	 * GET /my_ksuite/{my_k_suite_id}
	 */
	private static async getMykSuite(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mykSuiteId = context.getNodeParameter('mykSuiteId', itemIndex) as string;
		const additionalOptions = context.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, unknown>;

		const qsObj: any = {};
		if (additionalOptions.with) qsObj.with = additionalOptions.with;
		const qs: any = buildQueryString(qsObj);

		const data = await infomaniakApiRequestGET<MySuite>(
			context,
			`/my_ksuite/${mykSuiteId}`,
			qs,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Get current mykSuite
	 * GET /my_ksuite/current
	 */
	private static async getCurrentMykSuite(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const additionalOptions = context.getNodeParameter('additionalOptions', itemIndex, {}) as Record<string, unknown>;

		const qsObj: any = {};
		if (additionalOptions.with) qsObj.with = additionalOptions.with;
		const qs: any = buildQueryString(qsObj);

		const data = await infomaniakApiRequestGET<MySuite>(
			context,
			'/my_ksuite/current',
			qs,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Cancel unsubscribe
	 * POST /my_ksuite/{my_k_suite_id}/cancel_unsubscribe
	 */
	private static async cancelUnsubscribe(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const mykSuiteId = context.getNodeParameter('mykSuiteId', itemIndex) as string;

		await infomaniakApiRequestPOST(
			context,
			`/my_ksuite/${mykSuiteId}/cancel_unsubscribe`,
			undefined,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			message: `Unsubscription cancelled for kSuite ${mykSuiteId}`,
		});
	}
}
