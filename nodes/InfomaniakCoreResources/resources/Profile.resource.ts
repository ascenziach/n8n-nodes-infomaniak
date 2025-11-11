/**
 * Profile Resource Handler
 *
 * Handles operations related to user profiles and sub-resources
 * Note: Profile API uses v2 endpoints
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
	infomaniakApiRequestPATCH,
	infomaniakApiRequestDELETE,
	infomaniakApiRequest,
	buildQueryString,
	buildRequestBody,
} from '../utils';
import { Profile, AppPassword, Email, Phone, RequestBody } from '../types';

export class ProfileResource {
	/**
	 * Execute Profile operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			get: () => this.get(context, itemIndex),
			update: () => this.update(context, itemIndex),
			uploadAvatar: () => this.uploadAvatar(context, itemIndex),
			deleteAvatar: () => this.deleteAvatar(context, itemIndex),
			getAppPasswords: () => this.getAppPasswords(context, itemIndex),
			createAppPassword: () => this.createAppPassword(context, itemIndex),
			getAppPassword: () => this.getAppPassword(context, itemIndex),
			getEmails: () => this.getEmails(context, itemIndex),
			getEmail: () => this.getEmail(context, itemIndex),
			deleteEmail: () => this.deleteEmail(context, itemIndex),
			getPhones: () => this.getPhones(context, itemIndex),
			getPhone: () => this.getPhone(context, itemIndex),
			deletePhone: () => this.deletePhone(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get profile
	 * GET /2/profile
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const profileOptions = context.getNodeParameter('profileOptions', itemIndex, {}) as Record<string, unknown>;

		const qsObj: any = {};
		if (profileOptions.with) qsObj.with = profileOptions.with;
		const qs: any = buildQueryString(qsObj);

		// Use v2 API
		const data = await infomaniakApiRequest<Profile>(
			context,
			'GET',
			'/profile', // Will be prefixed with /2 in base URL
			undefined,
			qs,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Update profile
	 * PATCH /2/profile
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const profileData = context.getNodeParameter('profileData', itemIndex) as Record<string, unknown>;

		const bodyObj: any = {};
		if (profileData.email) bodyObj.email = profileData.email;
		if (profileData.firstname) bodyObj.firstname = profileData.firstname;
		if (profileData.lastname) bodyObj.lastname = profileData.lastname;
		if (profileData.countryId) bodyObj.countryId = profileData.countryId;
		if (profileData.languageId) bodyObj.languageId = profileData.languageId;
		if (profileData.locale) bodyObj.locale = profileData.locale;
		if (profileData.timezone) bodyObj.timezone = profileData.timezone;
		if (profileData.password) bodyObj.password = profileData.password;
		if (profileData.currentPassword) bodyObj.currentPassword = profileData.currentPassword;
		const body: RequestBody = buildRequestBody(bodyObj);

		const data = await infomaniakApiRequestPATCH<Profile>(
			context,
			'/profile',
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Upload avatar
	 * POST /2/profile/avatar
	 */
	private static async uploadAvatar(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const avatarData = context.getNodeParameter('avatarData', itemIndex) as Record<string, unknown>;

		const body: any = {
			avatar: avatarData.avatar,
			encoding: avatarData.encoding || 'base64',
		};

		const data = await infomaniakApiRequestPOST<Profile>(
			context,
			'/profile/avatar',
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Delete avatar
	 * DELETE /2/profile/avatar
	 */
	private static async deleteAvatar(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		await infomaniakApiRequestDELETE(context, '/profile/avatar', undefined, itemIndex);

		return context.helpers.returnJsonArray({
			success: true,
			message: 'Avatar deleted successfully',
		});
	}

	/**
	 * Get all application passwords
	 * GET /2/profile/applications/passwords
	 */
	private static async getAppPasswords(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const data = await infomaniakApiRequestGET<AppPassword[]>(
			context,
			'/profile/applications/passwords',
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Create application password
	 * POST /2/profile/applications/passwords
	 */
	private static async createAppPassword(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const data = await infomaniakApiRequestPOST<AppPassword>(
			context,
			'/profile/applications/passwords',
			undefined,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Get application password
	 * GET /2/profile/applications/passwords/{password_id}
	 */
	private static async getAppPassword(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const passwordId = context.getNodeParameter('passwordId', itemIndex) as number;

		const data = await infomaniakApiRequestGET<AppPassword>(
			context,
			`/profile/applications/passwords/${passwordId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Get all emails
	 * GET /2/profile/emails
	 */
	private static async getEmails(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const data = await infomaniakApiRequestGET<Email[]>(
			context,
			'/profile/emails',
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Get single email
	 * GET /2/profile/emails/{email_id}
	 */
	private static async getEmail(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const emailId = context.getNodeParameter('emailId', itemIndex) as number;

		const data = await infomaniakApiRequestGET<Email>(
			context,
			`/profile/emails/${emailId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Delete email
	 * DELETE /2/profile/emails/{email_id}
	 */
	private static async deleteEmail(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const emailId = context.getNodeParameter('emailId', itemIndex) as number;

		await infomaniakApiRequestDELETE(
			context,
			`/profile/emails/${emailId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			message: `Email ${emailId} deleted successfully`,
		});
	}

	/**
	 * Get all phones
	 * GET /2/profile/phones
	 */
	private static async getPhones(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const data = await infomaniakApiRequestGET<Phone[]>(
			context,
			'/profile/phones',
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Get single phone
	 * GET /2/profile/phones/{phone_id}
	 */
	private static async getPhone(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const phoneId = context.getNodeParameter('phoneId', itemIndex) as number;

		const data = await infomaniakApiRequestGET<Phone>(
			context,
			`/profile/phones/${phoneId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(data as unknown as any);
	}

	/**
	 * Delete phone
	 * DELETE /2/profile/phones/{phone_id}
	 */
	private static async deletePhone(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const phoneId = context.getNodeParameter('phoneId', itemIndex) as number;

		await infomaniakApiRequestDELETE(
			context,
			`/profile/phones/${phoneId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: true,
			message: `Phone ${phoneId} deleted successfully`,
		});
	}
}
