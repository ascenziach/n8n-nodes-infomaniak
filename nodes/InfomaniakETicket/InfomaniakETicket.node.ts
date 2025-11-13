import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import {
	TicketResource,
	ReservationResource,
	SurveyResource,
} from './resources';

export class InfomaniakETicket implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak eTicket',
		name: 'infomaniakETicket',
		icon: 'file:InfomaniakETicket.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage event tickets and reservations with Infomaniak eTicket - Developed by Ascenzia (ascenzia.ch)',
		defaults: {
			name: 'Infomaniak eTicket',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'infomaniakApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Reservation',
						value: 'reservation',
						description: 'Manage reservations',
					},
					{
						name: 'Survey',
						value: 'survey',
						description: 'Manage surveys and answers',
					},
					{
						name: 'Ticket',
						value: 'ticket',
						description: 'Manage tickets',
					},
				],
				default: 'ticket',
			},
			// Ticket Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ticket'],
					},
				},
				options: [
					{
						name: 'Update',
						value: 'update',
						description: 'Update ticket information',
						action: 'Update ticket',
					},
				],
				default: 'update',
			},
			// Reservation Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['reservation'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a reservation',
						action: 'Get reservation',
					},
				],
				default: 'get',
			},
			// Survey Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['survey'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many surveys',
						action: 'Get many surveys',
					},
					{
						name: 'Get Ticket Answers',
						value: 'getTicketAnswers',
						description: 'Get survey answers for tickets',
						action: 'Get ticket survey answers',
					},
					{
						name: 'Update Ticket Answers',
						value: 'updateTicketAnswers',
						description: 'Update survey answers for tickets',
						action: 'Update ticket survey answers',
					},
				],
				default: 'getAll',
			},
			// ===========================================
			// Ticket Fields
			// ===========================================
			{
				displayName: 'Tickets',
				name: 'tickets',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				required: true,
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['update'],
					},
				},
				options: [
					{
						name: 'ticket',
						displayName: 'Ticket',
						values: [
							{
								displayName: 'Ticket ID',
								name: 'id',
								type: 'number',
								default: 0,
								required: true,
								description: 'The ID of the ticket to update',
							},
							{
								displayName: 'Label',
								name: 'label',
								type: 'string',
								default: '',
								description: 'Ticket label (max 128 characters)',
							},
							{
								displayName: 'Hardware',
								name: 'hardware',
								type: 'string',
								default: '',
								description: 'Hardware information (max 127 characters)',
							},
							{
								displayName: 'Status',
								name: 'status',
								type: 'string',
								default: '',
								description: 'Ticket status',
							},
							{
								displayName: 'Show Price',
								name: 'show_price',
								type: 'boolean',
								default: true,
								description: 'Whether to show the price on the ticket',
							},
							{
								displayName: 'Show Tariff',
								name: 'show_tariff',
								type: 'boolean',
								default: true,
								description: 'Whether to show the tariff on the ticket',
							},
						],
					},
				],
			},
			// ===========================================
			// Reservation Fields
			// ===========================================
			{
				displayName: 'Reservation ID',
				name: 'reservationId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['reservation'],
						operation: ['get'],
					},
				},
				description: 'The ID or UUID of the reservation',
			},
			// ===========================================
			// Survey Fields
			// ===========================================
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['survey'],
						operation: ['getAll', 'getTicketAnswers'],
					},
				},
				options: [
					{
						name: 'IDs',
						value: 'ids',
						type: 'string',
						default: '',
						description: 'Comma-separated list of IDs',
					},
					{
						name: 'Survey IDs',
						value: 'survey_ids',
						type: 'string',
						default: '',
						description: 'Comma-separated list of survey IDs',
					},
					{
						name: 'Ticket IDs',
						value: 'ticket_ids',
						type: 'string',
						default: '',
						description: 'Comma-separated list of ticket IDs',
						displayOptions: {
							show: {
								'/operation': ['getTicketAnswers'],
							},
						},
					},
				],
			},
			{
				displayName: 'Answers',
				name: 'answers',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				required: true,
				displayOptions: {
					show: {
						resource: ['survey'],
						operation: ['updateTicketAnswers'],
					},
				},
				options: [
					{
						name: 'answer',
						displayName: 'Answer',
						values: [
							{
								displayName: 'Ticket ID',
								name: 'ticket_id',
								type: 'number',
								default: 0,
								required: true,
								description: 'The ID of the ticket',
							},
							{
								displayName: 'Survey Field ID',
								name: 'survey_field_id',
								type: 'number',
								default: 0,
								required: true,
								description: 'The ID of the survey field',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'The answer value (leave empty to clear)',
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[] = [];

				if (resource === 'ticket') {
					result = await TicketResource.execute(this, operation, i);
				} else if (resource === 'reservation') {
					result = await ReservationResource.execute(this, operation, i);
				} else if (resource === 'survey') {
					result = await SurveyResource.execute(this, operation, i);
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
