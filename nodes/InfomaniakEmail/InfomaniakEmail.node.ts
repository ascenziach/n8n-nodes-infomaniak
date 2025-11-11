import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import {
	MailboxResource,
	AliasResource,
	AutoReplyResource,
	SignatureResource,
	ForwardingResource,
	MailingListResource,
	RedirectionResource,
} from './resources';

export class InfomaniakEmail implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak Email',
		name: 'infomaniakEmail',
		icon: 'file:InfomaniakEmail.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage email mailboxes, aliases, signatures, and more with Infomaniak API - Developed by Ascenzia (ascenzia.ch)',
		defaults: {
			name: 'Infomaniak Email',
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
						name: 'Alias',
						value: 'alias',
						description: 'Manage email aliases',
					},
					{
						name: 'Auto Reply',
						value: 'autoReply',
						description: 'Manage auto-reply messages',
					},
					{
						name: 'Forwarding',
						value: 'forwarding',
						description: 'Manage email forwarding',
					},
					{
						name: 'Mailbox',
						value: 'mailbox',
						description: 'Manage email mailboxes',
					},
					{
						name: 'Mailing List',
						value: 'mailingList',
						description: 'Manage mailing lists',
					},
					{
						name: 'Redirection',
						value: 'redirection',
						description: 'Manage email redirections',
					},
					{
						name: 'Signature',
						value: 'signature',
						description: 'Manage email signatures',
					},
				],
				default: 'mailbox',
			},
			// Mailbox Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['mailbox'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a mailbox',
						action: 'Get mailbox',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many mailboxes',
						action: 'Get many mailboxes',
					},
				],
				default: 'getAll',
			},
			// Alias Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['alias'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an alias',
						action: 'Create alias',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an alias',
						action: 'Delete alias',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many aliases',
						action: 'Get many aliases',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update all aliases',
						action: 'Update aliases',
					},
				],
				default: 'getAll',
			},
			// Auto Reply Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['autoReply'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an auto-reply',
						action: 'Create auto reply',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an auto-reply',
						action: 'Delete auto reply',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an auto-reply',
						action: 'Get auto reply',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many auto-replies',
						action: 'Get many auto replies',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an auto-reply',
						action: 'Update auto reply',
					},
				],
				default: 'getAll',
			},
			// Signature Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['signature'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a signature',
						action: 'Create signature',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a signature',
						action: 'Delete signature',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a signature',
						action: 'Get signature',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many signatures',
						action: 'Get many signatures',
					},
					{
						name: 'Set Defaults',
						value: 'setDefaults',
						description: 'Set default signatures',
						action: 'Set default signatures',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a signature',
						action: 'Update signature',
					},
				],
				default: 'getAll',
			},
			// Forwarding Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['forwarding'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a forwarding address',
						action: 'Create forwarding address',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a forwarding address',
						action: 'Delete forwarding address',
					},
					{
						name: 'Delete All',
						value: 'deleteAll',
						description: 'Delete all forwarding addresses',
						action: 'Delete all forwarding addresses',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many forwarding addresses',
						action: 'Get many forwarding addresses',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update forwarding configuration',
						action: 'Update forwarding',
					},
				],
				default: 'getAll',
			},
			// Mailing List Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['mailingList'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a mailing list',
						action: 'Create mailing list',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a mailing list',
						action: 'Delete mailing list',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a mailing list',
						action: 'Get mailing list',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many mailing lists',
						action: 'Get many mailing lists',
					},
					{
						name: 'Send',
						value: 'send',
						description: 'Send email through mailing list',
						action: 'Send email',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a mailing list',
						action: 'Update mailing list',
					},
				],
				default: 'getAll',
			},
			// Redirection Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['redirection'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a redirection',
						action: 'Create redirection',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a redirection',
						action: 'Delete redirection',
					},
					{
						name: 'Enable',
						value: 'enable',
						description: 'Enable/disable a redirection',
						action: 'Enable redirection',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a redirection',
						action: 'Get redirection',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many redirections',
						action: 'Get many redirections',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a redirection',
						action: 'Update redirection',
					},
				],
				default: 'getAll',
			},
			// Common Parameters
			{
				displayName: 'Mail Hosting ID',
				name: 'mailHostingId',
				type: 'string',
				required: true,
				default: '',
				description: 'The mail hosting identifier',
			},
			{
				displayName: 'Mailbox Name',
				name: 'mailboxName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['mailbox', 'alias', 'autoReply', 'signature', 'forwarding'],
						operation: ['get', 'getAll', 'create', 'update', 'delete', 'deleteAll', 'setDefaults'],
					},
				},

			},
			// Return All / Limit Parameters
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
				typeOptions: {
					minValue: 1,
				},
				description: 'Max number of results to return',
			},
			// Mailbox Filters
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['mailbox'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Is Locked',
						name: 'is_locked',
						type: 'boolean',
						default: false,
						description: 'Whether to filter by locked status',
					},
					{
						displayName: 'Search',
						name: 'search',
						type: 'string',
						default: '',
						description: 'Search term for mailbox name',
					},
				],
			},
			// Alias Parameters
			{
				displayName: 'Alias',
				name: 'alias',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['alias'],
						operation: ['create', 'delete'],
					},
				},
				description: 'The email alias',
			},
			{
				displayName: 'Aliases',
				name: 'aliases',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['alias'],
						operation: ['update'],
					},
				},
				description: 'Comma-separated list of aliases',
				placeholder: 'alias1@example.com,alias2@example.com',
			},
			// Auto Reply Parameters
			{
				displayName: 'Auto Reply ID',
				name: 'autoReplyId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['autoReply'],
						operation: ['get'],
					},
				},
				description: 'The auto-reply identifier',
			},
			{
				displayName: 'Auto Reply Data',
				name: 'autoReplyData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['autoReply'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'string',
						default: '',
						description: 'End date for auto-reply (ISO 8601 format)',
						placeholder: '2024-12-31T23:59:59Z',
					},
					{
						displayName: 'Is Enabled',
						name: 'is_enabled',
						type: 'boolean',
						default: true,
						description: 'Whether the auto-reply is enabled',
					},
					{
						displayName: 'Message',
						name: 'message',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						required: true,
						default: '',
						description: 'Auto-reply message content',
					},
					{
						displayName: 'Start Date',
						name: 'start_date',
						type: 'string',
						default: '',
						description: 'Start date for auto-reply (ISO 8601 format)',
						placeholder: '2024-01-01T00:00:00Z',
					},
					{
						displayName: 'Subject',
						name: 'subject',
						type: 'string',
						required: true,
						default: '',
						description: 'Auto-reply subject line',
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
						resource: ['autoReply', 'signature', 'forwarding', 'mailingList', 'redirection'],
						operation: ['update'],
					},
				},
				options: [
					// Signature Update Fields
					{
						displayName: 'Content',
						name: 'content',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						displayOptions: {
							show: {
								'/resource': ['signature'],
							},
						},
						default: '',
						description: 'Signature HTML content',
					},
					// Mailing List Update Fields
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						displayOptions: {
							show: {
								'/resource': ['mailingList'],
							},
						},
						default: '',
						description: 'Mailing list description',
					},
					// Redirection Update Fields
					{
						displayName: 'Destination',
						name: 'destination',
						type: 'string',
						displayOptions: {
							show: {
								'/resource': ['redirection'],
							},
						},
						default: '',
						description: 'Destination email address',
					},
					// Auto Reply Update Fields
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'string',
						displayOptions: {
							show: {
								'/resource': ['autoReply'],
							},
						},
						default: '',
						description: 'End date for auto-reply (ISO 8601 format)',
					},
					// Forwarding Update Fields
					{
						displayName: 'Forwarding Addresses',
						name: 'forwarding_addresses',
						type: 'string',
						displayOptions: {
							show: {
								'/resource': ['forwarding'],
							},
						},
						default: '',
						description: 'Comma-separated list of forwarding addresses',
						placeholder: 'user1@example.com,user2@example.com',
					},
					{
						displayName: 'Is Default for New Emails',
						name: 'is_default_new',
						type: 'boolean',
						displayOptions: {
							show: {
								'/resource': ['signature'],
							},
						},
						default: false,
						description: 'Whether this is the default signature for new emails',
					},
					{
						displayName: 'Is Default for Replies',
						name: 'is_default_reply',
						type: 'boolean',
						displayOptions: {
							show: {
								'/resource': ['signature'],
							},
						},
						default: false,
						description: 'Whether this is the default signature for replies',
					},
					{
						displayName: 'Is Enabled',
						name: 'is_enabled',
						type: 'boolean',
						displayOptions: {
							show: {
								'/resource': ['autoReply', 'forwarding', 'redirection'],
							},
						},
						default: true,
						description: 'Whether the item is enabled',
					},
					{
						displayName: 'Is Moderated',
						name: 'is_moderated',
						type: 'boolean',
						displayOptions: {
							show: {
								'/resource': ['mailingList'],
							},
						},
						default: false,
						description: 'Whether the mailing list is moderated',
					},
					{
						displayName: 'Keep Copy',
						name: 'keep_copy',
						type: 'boolean',
						displayOptions: {
							show: {
								'/resource': ['forwarding'],
							},
						},
						default: false,
						description: 'Whether to keep a copy in the mailbox',
					},
					{
						displayName: 'Members',
						name: 'members',
						type: 'string',
						displayOptions: {
							show: {
								'/resource': ['mailingList'],
							},
						},
						default: '',
						description: 'JSON array of members with email and is_moderator fields',
						placeholder: '[{"email": "user@example.com", "is_moderator": false}]',
					},
					{
						displayName: 'Message',
						name: 'message',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						displayOptions: {
							show: {
								'/resource': ['autoReply'],
							},
						},
						default: '',
						description: 'Auto-reply message content',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						displayOptions: {
							show: {
								'/resource': ['signature', 'mailingList'],
							},
						},
						default: '',

					},
					{
						displayName: 'Redirection Type',
						name: 'redirection_type',
						type: 'options',
						displayOptions: {
							show: {
								'/resource': ['redirection'],
							},
						},
						options: [
							{ name: 'Permanent', value: 'permanent' },
							{ name: 'Temporary', value: 'temporary' },
						],
						default: 'permanent',
						description: 'Type of redirection',
					},
					{
						displayName: 'Source',
						name: 'source',
						type: 'string',
						displayOptions: {
							show: {
								'/resource': ['redirection'],
							},
						},
						default: '',
						description: 'Source email address',
					},
					{
						displayName: 'Start Date',
						name: 'start_date',
						type: 'string',
						displayOptions: {
							show: {
								'/resource': ['autoReply'],
							},
						},
						default: '',
						description: 'Start date for auto-reply (ISO 8601 format)',
					},
					{
						displayName: 'Subject',
						name: 'subject',
						type: 'string',
						displayOptions: {
							show: {
								'/resource': ['autoReply'],
							},
						},
						default: '',
						description: 'Auto-reply subject line',
					},
				],
			},
			// Signature Parameters
			{
				displayName: 'Signature ID',
				name: 'signatureId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['signature'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The signature identifier',
			},
			{
				displayName: 'Signature Data',
				name: 'signatureData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['signature'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Content',
						name: 'content',
						type: 'string',
						typeOptions: {
							rows: 4,
						},

						default: '',
						description: 'Signature HTML content',
					},
					{
						displayName: 'Is Default for New Emails',
						name: 'is_default_new',
						type: 'boolean',
						default: false,
						description: 'Whether this is the default signature for new emails',
					},
					{
						displayName: 'Is Default for Replies',
						name: 'is_default_reply',
						type: 'boolean',
						default: false,
						description: 'Whether this is the default signature for replies',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						required: true,
						default: '',
						description: 'Signature name',
					},
				],
			},
			{
				displayName: 'Defaults Data',
				name: 'defaultsData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['signature'],
						operation: ['setDefaults'],
					},
				},
				options: [
					{
						displayName: 'Default New Signature ID',
						name: 'default_new_signature_id',
						type: 'string',
						default: '',
						description: 'ID of signature to use for new emails (leave empty to clear)',
					},
					{
						displayName: 'Default Reply Signature ID',
						name: 'default_reply_signature_id',
						type: 'string',
						default: '',
						description: 'ID of signature to use for replies (leave empty to clear)',
					},
				],
			},
			// Forwarding Parameters
			{
				displayName: 'Forwarding Address',
				name: 'forwardingAddress',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['forwarding'],
						operation: ['delete'],
					},
				},
				description: 'The forwarding email address to delete',
			},
			{
				displayName: 'Forwarding Data',
				name: 'forwardingData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['forwarding'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Forwarding Address',
						name: 'forwarding_address',
						type: 'string',

						default: '',
						description: 'Email address to forward to',
					},
					{
						displayName: 'Is Enabled',
						name: 'is_enabled',
						type: 'boolean',
						default: true,
						description: 'Whether the forwarding is enabled',
					},
					{
						displayName: 'Keep Copy',
						name: 'keep_copy',
						type: 'boolean',
						default: false,
						description: 'Whether to keep a copy in the mailbox',
					},
				],
			},
			// Mailing List Parameters
			{
				displayName: 'Mailing List ID',
				name: 'mailingListId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['mailingList'],
						operation: ['get', 'update', 'delete', 'send'],
					},
				},
				description: 'The mailing list identifier',
			},
			{
				displayName: 'Mailing List Data',
				name: 'mailingListData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['mailingList'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Mailing list description',
					},
					{
						displayName: 'Email Address',
						name: 'email_address',
						type: 'string',
						required: true,
						default: '',
						description: 'Mailing list email address',
					},
					{
						displayName: 'Is Moderated',
						name: 'is_moderated',
						type: 'boolean',
						default: false,
						description: 'Whether the mailing list is moderated',
					},
					{
						displayName: 'Members',
						name: 'members',
						type: 'string',
						default: '',
						description: 'JSON array of members with email and is_moderator fields',
						placeholder: '[{"email": "user@example.com", "is_moderator": false}]',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						required: true,
						default: '',
						description: 'Mailing list name',
					},
				],
			},
			{
				displayName: 'Email Data',
				name: 'emailData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['mailingList'],
						operation: ['send'],
					},
				},
				options: [
					{
						displayName: 'Message',
						name: 'message',
						type: 'string',
						typeOptions: {
							rows: 4,
						},

						default: '',
						description: 'Email message content',
					},
					{
						displayName: 'Reply To',
						name: 'reply_to',
						type: 'string',
						default: '',
						description: 'Reply-to email address',
					},
					{
						displayName: 'Subject',
						name: 'subject',
						type: 'string',
						required: true,
						default: '',
						description: 'Email subject line',
					},
				],
			},
			// Redirection Parameters
			{
				displayName: 'Redirection ID',
				name: 'redirectionId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['redirection'],
						operation: ['get', 'update', 'delete', 'enable'],
					},
				},
				description: 'The redirection identifier',
			},
			{
				displayName: 'Redirection Data',
				name: 'redirectionData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['redirection'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Destination',
						name: 'destination',
						type: 'string',

						default: '',
						description: 'Destination email address',
					},
					{
						displayName: 'Is Enabled',
						name: 'is_enabled',
						type: 'boolean',
						default: true,
						description: 'Whether the redirection is enabled',
					},
					{
						displayName: 'Redirection Type',
						name: 'redirection_type',
						type: 'options',
						options: [
							{ name: 'Permanent', value: 'permanent' },
							{ name: 'Temporary', value: 'temporary' },
						],
						default: 'permanent',
						description: 'Type of redirection',
					},
					{
						displayName: 'Source',
						name: 'source',
						type: 'string',
						required: true,
						default: '',
						description: 'Source email address',
					},
				],
			},
			{
				displayName: 'Is Enabled',
				name: 'isEnabled',
				type: 'boolean',
				required: true,
				default: true,
				displayOptions: {
					show: {
						resource: ['redirection'],
						operation: ['enable'],
					},
				},
				description: 'Whether to enable or disable the redirection',
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
			mailbox: MailboxResource.execute,
			alias: AliasResource.execute,
			autoReply: AutoReplyResource.execute,
			signature: SignatureResource.execute,
			forwarding: ForwardingResource.execute,
			mailingList: MailingListResource.execute,
			redirection: RedirectionResource.execute,
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
