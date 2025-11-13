import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import {
	CampaignResource,
	SubscriberResource,
} from './resources';

export class InfomaniakNewsletter implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak Newsletter',
		name: 'infomaniakNewsletter',
		icon: 'file:infomaniak-svgrepo-com.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage newsletter campaigns and subscribers with Infomaniak Newsletter - Developed by Ascenzia (ascenzia.ch)',
		defaults: {
			name: 'Infomaniak Newsletter',
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
						name: 'Campaign',
						value: 'campaign',
						description: 'Manage email campaigns',
					},
					{
						name: 'Subscriber',
						value: 'subscriber',
						description: 'Manage subscribers',
					},
				],
				default: 'campaign',
			},
			// Domain ID (required for all operations)
			{
				displayName: 'Domain ID',
				name: 'domainId',
				type: 'number',
				default: 0,
				required: true,
				description: 'The unique identifier of the newsletter domain',
			},
			// Campaign Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a campaign',
						action: 'Create campaign',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a campaign',
						action: 'Delete campaign',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a campaign',
						action: 'Get campaign',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many campaigns',
						action: 'Get many campaigns',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a campaign',
						action: 'Update campaign',
					},
				],
				default: 'getAll',
			},
			// Subscriber Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['subscriber'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create or update a subscriber',
						action: 'Create subscriber',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a subscriber',
						action: 'Delete subscriber',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a subscriber',
						action: 'Get subscriber',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many subscribers',
						action: 'Get many subscribers',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a subscriber',
						action: 'Update subscriber',
					},
				],
				default: 'getAll',
			},
			// ===========================================
			// Campaign Fields
			// ===========================================
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The unique identifier of the campaign',
			},
			// Campaign Create/Update fields
			{
				displayName: 'Email From Address',
				name: 'emailFromAddr',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create'],
					},
				},
				description: 'Sender email address (max 255 characters)',
			},
			{
				displayName: 'Email From Name',
				name: 'emailFromName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create'],
					},
				},
				description: 'Sender name (max 255 characters)',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create'],
					},
				},
				description: 'Email subject',
			},
			{
				displayName: 'Language',
				name: 'lang',
				type: 'options',
				default: 'fr_FR',
				required: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Deutsch',
						value: 'de_DE',
					},
					{
						name: 'English',
						value: 'en_GB',
					},
					{
						name: 'Español',
						value: 'es_ES',
					},
					{
						name: 'Français',
						value: 'fr_FR',
					},
					{
						name: 'Italiano',
						value: 'it_IT',
					},
				],
				description: 'Campaign language',
			},
			{
				displayName: 'HTML Content',
				name: 'contentHtml',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create', 'update'],
					},
				},
				description: 'HTML content of the email',
			},
			// ===========================================
			// Subscriber Fields
			// ===========================================
			{
				displayName: 'Subscriber ID',
				name: 'subscriberId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['subscriber'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The unique identifier of the subscriber',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['subscriber'],
						operation: ['create'],
					},
				},
				description: 'Valid email address as per RFC 2821',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['subscriber'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						name: 'Status',
						value: 'status',
						type: 'string',
						default: '',
						description: 'Subscriber status',
					},
					{
						name: 'Groups',
						value: 'groups',
						type: 'string',
						default: '',
						description: 'Comma-separated group IDs or names',
					},
				],
			},
			// Pagination for getAll
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['getAll'],
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
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				description: 'Max number of results to return',
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

				if (resource === 'campaign') {
					result = await CampaignResource.execute(this, operation, i);
				} else if (resource === 'subscriber') {
					result = await SubscriberResource.execute(this, operation, i);
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
