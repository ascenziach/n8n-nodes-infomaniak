import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import {
	DomainResource,
	ZoneResource,
	DNSRecordResource,
} from './resources';

export class InfomaniakDNS implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak DNS',
		name: 'infomaniakDns',
		icon: 'file:InfomaniakDNS.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage DNS records and zones with Infomaniak API - Developed by Ascenzia (ascenzia.ch)',
		defaults: {
			name: 'Infomaniak DNS',
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
						name: 'Domain',
						value: 'domain',
						description: 'Manage domain DNS settings',
					},
					{
						name: 'Zone',
						value: 'zone',
						description: 'Manage DNS zones',
					},
					{
						name: 'DNS Record',
						value: 'dnsRecord',
						description: 'Manage DNS records',
					},
				],
				default: 'domain',
			},
			// Domain Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['domain'],
					},
				},
				options: [
					{
						name: 'Check DNSSEC',
						value: 'checkDNSSEC',
						description: 'Check DNSSEC status for a domain',
						action: 'Check DNSSEC status',
					},
					{
						name: 'Disable DNSSEC',
						value: 'disableDNSSEC',
						description: 'Disable DNSSEC for a domain',
						action: 'Disable DNSSEC',
					},
					{
						name: 'Enable DNSSEC',
						value: 'enableDNSSEC',
						description: 'Enable DNSSEC for a domain',
						action: 'Enable DNSSEC',
					},
					{
						name: 'List Zones',
						value: 'listZones',
						description: 'List all zones for a domain',
						action: 'List zones',
					},
					{
						name: 'Update Nameservers',
						value: 'updateNameservers',
						description: 'Update nameservers for a domain',
						action: 'Update nameservers',
					},
				],
				default: 'checkDNSSEC',
			},
			// Zone Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['zone'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new DNS zone',
						action: 'Create zone',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a DNS zone',
						action: 'Delete zone',
					},
					{
						name: 'Exists',
						value: 'exists',
						description: 'Check if a zone exists',
						action: 'Check if zone exists',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a DNS zone',
						action: 'Get zone',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a DNS zone',
						action: 'Update zone',
					},
				],
				default: 'get',
			},
			// DNS Record Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['dnsRecord'],
					},
				},
				options: [
					{
						name: 'Check',
						value: 'check',
						description: 'Check DNS record propagation',
						action: 'Check record propagation',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new DNS record',
						action: 'Create DNS record',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a DNS record',
						action: 'Delete DNS record',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a DNS record',
						action: 'Get DNS record',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many DNS records for a zone',
						action: 'Get many DNS records',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a DNS record',
						action: 'Update DNS record',
					},
				],
				default: 'getAll',
			},
			// Domain Parameters
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['domain'],
					},
				},
				description: 'The domain name',
			},
			{
				displayName: 'Nameservers',
				name: 'nameservers',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['updateNameservers'],
					},
				},
				description: 'Comma-separated list of nameservers',
				placeholder: 'ns1.example.com,ns2.example.com',
			},
			// Zone Parameters
			{
				displayName: 'Zone ID',
				name: 'zoneId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['zone'],
					},
				},
				description: 'The zone identifier',
			},
			{
				displayName: 'Zone Data',
				name: 'zoneData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['zone'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Source',
						name: 'source',
						type: 'string',
						default: '',
						description: 'Source domain for zone creation',
					},
					{
						displayName: 'Contact Emails',
						name: 'contactEmails',
						type: 'string',
						default: '',
						description: 'Comma-separated list of contact email addresses',
					},
				],
			},
			{
				displayName: 'Update Fields',
				name: 'updateData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['zone'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Contact Emails',
						name: 'contactEmails',
						type: 'string',
						default: '',
						description: 'Comma-separated list of contact email addresses',
					},
					{
						displayName: 'DNSSEC Status',
						name: 'dnssecStatus',
						type: 'boolean',
						default: false,
						description: 'Whether to enable DNSSEC for the zone',
					},
				],
			},
			// DNS Record Parameters
			{
				displayName: 'Record ID',
				name: 'recordId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['dnsRecord'],
						operation: ['get', 'update', 'delete', 'check'],
					},
				},
				description: 'The DNS record identifier',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['dnsRecord'],
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
						resource: ['dnsRecord'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['dnsRecord'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Record Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'A', value: 'A' },
							{ name: 'AAAA', value: 'AAAA' },
							{ name: 'CAA', value: 'CAA' },
							{ name: 'CNAME', value: 'CNAME' },
							{ name: 'MX', value: 'MX' },
							{ name: 'NS', value: 'NS' },
							{ name: 'SOA', value: 'SOA' },
							{ name: 'SPF', value: 'SPF' },
							{ name: 'SRV', value: 'SRV' },
							{ name: 'TXT', value: 'TXT' },
						],
						default: 'A',
						description: 'Filter by record type',
					},
					{
						displayName: 'Source',
						name: 'source',
						type: 'string',
						default: '',
						description: 'Filter by record source/name',
					},
				],
			},
			{
				displayName: 'Record Data',
				name: 'recordData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['dnsRecord'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Comment',
						name: 'comment',
						type: 'string',
						default: '',
						description: 'Optional comment for the record',
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'number',
						default: 0,
						description: 'Priority for MX and SRV records',
					},
					{
						displayName: 'Record Type',
						name: 'type',
						type: 'options',

						options: [
							{ name: 'A', value: 'A' },
							{ name: 'AAAA', value: 'AAAA' },
							{ name: 'CAA', value: 'CAA' },
							{ name: 'CNAME', value: 'CNAME' },
							{ name: 'MX', value: 'MX' },
							{ name: 'NS', value: 'NS' },
							{ name: 'SOA', value: 'SOA' },
							{ name: 'SPF', value: 'SPF' },
							{ name: 'SRV', value: 'SRV' },
							{ name: 'TXT', value: 'TXT' },
						],
						default: 'A',
						description: 'The type of DNS record',
					},
					{
						displayName: 'Source',
						name: 'source',
						type: 'string',
						required: true,
						default: '',
						description: 'The source/name of the record',
					},
					{
						displayName: 'Target',
						name: 'target',
						type: 'string',
						required: true,
						default: '',
						description: 'The target/value of the record',
					},
					{
						displayName: 'TTL',
						name: 'ttl',
						type: 'number',
						default: 3600,
						description: 'Time to live in seconds',
					},
				],
			},
			{
				displayName: 'Update Fields',
				name: 'updateData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['dnsRecord'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Comment',
						name: 'comment',
						type: 'string',
						default: '',
						description: 'Optional comment for the record',
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'number',
						default: 0,
						description: 'Priority for MX and SRV records',
					},
					{
						displayName: 'Record Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'A', value: 'A' },
							{ name: 'AAAA', value: 'AAAA' },
							{ name: 'CAA', value: 'CAA' },
							{ name: 'CNAME', value: 'CNAME' },
							{ name: 'MX', value: 'MX' },
							{ name: 'NS', value: 'NS' },
							{ name: 'SOA', value: 'SOA' },
							{ name: 'SPF', value: 'SPF' },
							{ name: 'SRV', value: 'SRV' },
							{ name: 'TXT', value: 'TXT' },
						],
						default: 'A',
						description: 'The type of DNS record',
					},
					{
						displayName: 'Source',
						name: 'source',
						type: 'string',
						default: '',
						description: 'The source/name of the record',
					},
					{
						displayName: 'Target',
						name: 'target',
						type: 'string',
						default: '',
						description: 'The target/value of the record',
					},
					{
						displayName: 'TTL',
						name: 'ttl',
						type: 'number',
						default: 3600,
						description: 'Time to live in seconds',
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

		// Resource handler mapping
		const resourceHandlers: Record<
			string,
			(context: IExecuteFunctions, operation: string, itemIndex: number) => Promise<INodeExecutionData[]>
		> = {
			domain: DomainResource.execute,
			zone: ZoneResource.execute,
			dnsRecord: DNSRecordResource.execute,
		};

		// Execute operations for each item
		for (let i = 0; i < items.length; i++) {
			try {
				const handler = resourceHandlers[resource];

				if (!handler) {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
				}

				// Execute the resource handler
				const result = await handler(this, operation, i);
				returnData.push(...result);
			} catch (error) {
				// Handle errors based on continueOnFail setting
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({
						json: { error: errorMessage },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
