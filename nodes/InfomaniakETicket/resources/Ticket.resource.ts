/**
 * Ticket Resource Handler
 *
 * Handles operations for eTicket Tickets
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestPATCH,
} from '../utils';
import { TicketUpdate } from '../types';

export class TicketResource {
	/**
	 * Execute Ticket operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			update: () => TicketResource.update(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Update tickets
	 * PATCH /2/etickets/ticket
	 */
	private static async update(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const ticketsData = context.getNodeParameter('tickets', itemIndex, {}) as IDataObject;

		const tickets: TicketUpdate[] = [];
		if (ticketsData.ticket && Array.isArray(ticketsData.ticket)) {
			for (const ticket of ticketsData.ticket) {
				const ticketUpdate: TicketUpdate = {
					id: ticket.id as number,
				};

				if (ticket.label !== undefined && ticket.label !== '') {
					ticketUpdate.label = ticket.label as string;
				}
				if (ticket.hardware !== undefined && ticket.hardware !== '') {
					ticketUpdate.hardware = ticket.hardware as string;
				}
				if (ticket.status !== undefined && ticket.status !== '') {
					ticketUpdate.status = ticket.status as string;
				}
				if (ticket.show_price !== undefined) {
					ticketUpdate.show_price = ticket.show_price as boolean;
				}
				if (ticket.show_tariff !== undefined) {
					ticketUpdate.show_tariff = ticket.show_tariff as boolean;
				}

				tickets.push(ticketUpdate);
			}
		}

		const body: Record<string, unknown> = {
			tickets,
		};

		const response = await infomaniakApiRequestPATCH<{
			result: string;
			data: boolean;
		}>(
			context,
			'/2/etickets/ticket',
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray({
			success: response.data,
			updated_count: tickets.length,
		} as IDataObject);
	}
}
