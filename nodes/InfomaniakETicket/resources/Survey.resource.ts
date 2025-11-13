/**
 * Survey Resource Handler
 *
 * Handles operations for eTicket Surveys
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPATCH,
} from '../utils';
import { Survey, TicketSurveyAnswer } from '../types';

export class SurveyResource {
	/**
	 * Execute Survey operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			getAll: () => SurveyResource.getAll(context, itemIndex),
			getTicketAnswers: () => SurveyResource.getTicketAnswers(context, itemIndex),
			updateTicketAnswers: () => SurveyResource.updateTicketAnswers(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get surveys
	 * GET /2/etickets/surveys
	 */
	private static async getAll(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const filters = context.getNodeParameter('filters', itemIndex, {}) as IDataObject;

		const qs: Record<string, string | number | boolean | undefined> = {};

		// Build filters query param
		const filtersObj: Record<string, unknown> = {};
		if (filters.ids) {
			const ids = (filters.ids as string).split(',').map(id => parseInt(id.trim(), 10));
			filtersObj.ids = ids;
		}
		if (filters.survey_ids) {
			const surveyIds = (filters.survey_ids as string).split(',').map(id => parseInt(id.trim(), 10));
			filtersObj.survey_ids = surveyIds;
		}

		if (Object.keys(filtersObj).length > 0) {
			qs.filters = JSON.stringify(filtersObj);
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Survey[];
		}>(
			context,
			'/2/etickets/surveys',
			qs,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject[]);
	}

	/**
	 * Get ticket survey answers
	 * GET /2/etickets/surveys/answers/tickets
	 */
	private static async getTicketAnswers(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const filters = context.getNodeParameter('filters', itemIndex, {}) as IDataObject;

		const qs: Record<string, string | number | boolean | undefined> = {};

		// Build filters query param
		const filtersObj: Record<string, unknown> = {};
		if (filters.ids) {
			const ids = (filters.ids as string).split(',').map(id => parseInt(id.trim(), 10));
			filtersObj.ids = ids;
		}
		if (filters.survey_ids) {
			const surveyIds = (filters.survey_ids as string).split(',').map(id => parseInt(id.trim(), 10));
			filtersObj.survey_ids = surveyIds;
		}
		if (filters.ticket_ids) {
			const ticketIds = (filters.ticket_ids as string).split(',').map(id => parseInt(id.trim(), 10));
			filtersObj.ticket_ids = ticketIds;
		}

		if (Object.keys(filtersObj).length > 0) {
			qs.filters = JSON.stringify(filtersObj);
		}

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: TicketSurveyAnswer[];
		}>(
			context,
			'/2/etickets/surveys/answers/tickets',
			qs,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject[]);
	}

	/**
	 * Update ticket survey answers
	 * PATCH /2/etickets/surveys/answers/tickets
	 */
	private static async updateTicketAnswers(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const answersData = context.getNodeParameter('answers', itemIndex, {}) as IDataObject;

		const answers: Array<{
			ticket_id: number;
			survey_field_id: number;
			value: string | null;
		}> = [];

		if (answersData.answer && Array.isArray(answersData.answer)) {
			for (const answer of answersData.answer) {
				answers.push({
					ticket_id: answer.ticket_id as number,
					survey_field_id: answer.survey_field_id as number,
					value: (answer.value as string) || null,
				});
			}
		}

		const body: Record<string, unknown> = {
			answers,
		};

		const response = await infomaniakApiRequestPATCH<{
			result: string;
		}>(
			context,
			'/2/etickets/surveys/answers/tickets',
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: response.result === 'success',
			updated_count: answers.length,
		} as IDataObject);
	}
}
