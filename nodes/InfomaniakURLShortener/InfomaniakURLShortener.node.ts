import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import {
	ShortUrlResource,
} from './resources';

export class InfomaniakURLShortener implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak URL Shortener',
		name: 'infomaniakURLShortener',
		icon: 'file:InfomaniakURLShortener.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Create and manage short URLs with Infomaniak URL Shortener API - Developed by Ascenzia (ascenzia.ch)',
		defaults: {
			name: 'Infomaniak URL Shortener',
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
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a short URL',
						action: 'Create short URL',
					},
					{
						name: 'Get Quota',
						value: 'getQuota',
						description: 'Get your short URL quota',
						action: 'Get short URL quota',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all short URLs',
						action: 'List short URLs',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a short URL expiration date',
						action: 'Update short URL',
					},
				],
				default: 'list',
			},
			// URL parameter for Create operation
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				description: 'The URL to shorten',
			},
			// Expiration Date for Create and Update operations
			{
				displayName: 'Expiration Date',
				name: 'expirationDate',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				description: 'Expiration date for the short URL (optional for create, required for update)',
			},
			// Short URL Code for Update operation
			{
				displayName: 'Short URL Code',
				name: 'shortUrlCode',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['update'],
					},
				},
				description: 'The code of the short URL to update',
			},
			// List operation parameters
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['list'],
					},
				},
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				displayOptions: {
					show: {
						operation: ['list'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 500,
				},
				description: 'Max number of results to return',
			},
			// Additional List parameters
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: ['list'],
					},
				},
				options: [
					{
						name: 'Order By',
						value: 'order_by',
						type: 'options',
						default: 'created_at',
						options: [
							{
								name: 'Code',
								value: 'code',
							},
							{
								name: 'Created At',
								value: 'created_at',
							},
							{
								name: 'Expiration Date',
								value: 'expiration_date',
							},
							{
								name: 'URL',
								value: 'url',
							},
						],
						description: 'Field to order results by',
					},
					{
						name: 'Order Direction',
						value: 'order_direction',
						type: 'options',
						default: 'DESC',
						options: [
							{
								name: 'Ascending',
								value: 'ASC',
							},
							{
								name: 'Descending',
								value: 'DESC',
							},
						],
						description: 'Order direction',
					},
					{
						name: 'Search',
						value: 'search',
						type: 'string',
						default: '',
						description: 'Search term to filter results',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const result = await ShortUrlResource.execute(this, operation, i);
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
