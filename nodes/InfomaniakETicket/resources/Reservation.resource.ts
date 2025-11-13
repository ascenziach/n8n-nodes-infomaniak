/**
 * Reservation Resource Handler
 *
 * Handles operations for eTicket Reservations
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
} from '../utils';
import { Reservation } from '../types';

export class ReservationResource {
	/**
	 * Execute Reservation operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			get: () => ReservationResource.get(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Get a reservation
	 * GET /2/etickets/reservation/{reservation_id}
	 */
	private static async get(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const reservationId = context.getNodeParameter('reservationId', itemIndex) as string;

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: Reservation;
		}>(
			context,
			`/2/etickets/reservation/${reservationId}`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}
}
