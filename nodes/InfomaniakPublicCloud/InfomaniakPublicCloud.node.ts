import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import {
	PublicCloudResource,
	ProjectResource,
	UserResource,
	DatabaseResource,
	KubernetesResource,
} from './resources';

export class InfomaniakPublicCloud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak Public Cloud',
		name: 'infomaniakPublicCloud',
		icon: 'file:InfomaniakPublicCloud.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Public Cloud resources, projects, users, databases, and Kubernetes with Infomaniak API - Developed by Ascenzia (ascenzia.ch)',
		defaults: {
			name: 'Infomaniak Public Cloud',
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
						name: 'Database',
						value: 'database',
						description: 'Manage database services',
					},
					{
						name: 'Kubernete',
						value: 'kubernetes',
						description: 'Manage Kubernetes services',
					},
					{
						name: 'Project',
						value: 'project',
						description: 'Manage OpenStack projects',
					},
					{
						name: 'Public Cloud',
						value: 'publicCloud',
						description: 'Manage public cloud instances',
					},
					{
						name: 'User',
						value: 'user',
						description: 'Manage OpenStack users',
					},
				],
				default: 'publicCloud',
			},
			// Public Cloud Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['publicCloud'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a public cloud',
						action: 'Get public cloud',
					},
					{
						name: 'Get Accesses',
						value: 'getAccesses',
						description: 'Get accesses for a public cloud',
						action: 'Get public cloud accesses',
					},
					{
						name: 'Get Config',
						value: 'getConfig',
						description: 'Get configuration for a public cloud',
						action: 'Get public cloud config',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many public clouds',
						action: 'Get many public clouds',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a public cloud',
						action: 'Update public cloud',
					},
				],
				default: 'getAll',
			},
			// Project Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['project'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a project',
						action: 'Create project',
					},
					{
						name: 'Create With Invite',
						value: 'createWithInvite',
						description: 'Create a project with invitation',
						action: 'Create project with invitation',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a project',
						action: 'Delete project',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a project',
						action: 'Get project',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many projects',
						action: 'Get many projects',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a project',
						action: 'Update project',
					},
				],
				default: 'getAll',
			},
			// User Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a user',
						action: 'Create user',
					},
					{
						name: 'Create Invite',
						value: 'createInvite',
						description: 'Create a user invitation',
						action: 'Create user invitation',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a user',
						action: 'Delete user',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a user',
						action: 'Get user',
					},
					{
						name: 'Get Auth File',
						value: 'getAuthFile',
						description: 'Get authentication file (clouds.yaml)',
						action: 'Get auth file',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many users',
						action: 'Get many users',
					},
					{
						name: 'Get OpenRC',
						value: 'getOpenRC',
						description: 'Get OpenRC file',
						action: 'Get open rc file',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a user',
						action: 'Update user',
					},
					{
						name: 'Update With Invite',
						value: 'updateWithInvite',
						description: 'Update a user and send invitation',
						action: 'Update user with invitation',
					},
				],
				default: 'getAll',
			},
			// Database Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['database'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a database service',
						action: 'Create database service',
					},
					{
						name: 'Create Backup',
						value: 'createBackup',
						description: 'Create a database backup',
						action: 'Create database backup',
					},
					{
						name: 'Create Restore',
						value: 'createRestore',
						description: 'Restore database from backup',
						action: 'Create database restore',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a database service',
						action: 'Delete database service',
					},
					{
						name: 'Delete Backup',
						value: 'deleteBackup',
						description: 'Delete a database backup',
						action: 'Delete database backup',
					},
					{
						name: 'Delete Restore',
						value: 'deleteRestore',
						description: 'Delete a database restore',
						action: 'Delete database restore',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a database service',
						action: 'Get database service',
					},
					{
						name: 'Get Backup',
						value: 'getBackup',
						description: 'Get a database backup',
						action: 'Get database backup',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many database services',
						action: 'Get many database services',
					},
					{
						name: 'Get Many For Account',
						value: 'getAllForAccount',
						description: 'Get all database services for account',
						action: 'Get many database services for account',
					},
					{
						name: 'Get Password',
						value: 'getPassword',
						description: 'Get database password/connection info',
						action: 'Get database password',
					},
					{
						name: 'Get Restore',
						value: 'getRestore',
						description: 'Get a database restore',
						action: 'Get database restore',
					},
					{
						name: 'List Backups',
						value: 'listBackups',
						description: 'List database backups',
						action: 'List database backups',
					},
					{
						name: 'List Packs',
						value: 'listPacks',
						description: 'List available database packs',
						action: 'List database packs',
					},
					{
						name: 'List Regions',
						value: 'listRegions',
						description: 'List available database regions',
						action: 'List database regions',
					},
					{
						name: 'List Restores',
						value: 'listRestores',
						description: 'List database restores',
						action: 'List database restores',
					},
					{
						name: 'List Types',
						value: 'listTypes',
						description: 'List available database types',
						action: 'List database types',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a database service',
						action: 'Update database service',
					},
				],
				default: 'getAll',
			},
			// Kubernetes Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['kubernetes'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a Kubernetes service',
						action: 'Create kubernetes service',
					},
					{
						name: 'Create Instance Pool',
						value: 'createInstancePool',
						description: 'Create an instance pool',
						action: 'Create instance pool',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a Kubernetes service',
						action: 'Delete kubernetes service',
					},
					{
						name: 'Delete Instance Pool',
						value: 'deleteInstancePool',
						description: 'Delete an instance pool',
						action: 'Delete instance pool',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a Kubernetes service',
						action: 'Get kubernetes service',
					},
					{
						name: 'Get Instance Pool',
						value: 'getInstancePool',
						description: 'Get an instance pool',
						action: 'Get instance pool',
					},
					{
						name: 'Get Kube Config',
						value: 'getKubeConfig',
						description: 'Download kubeconfig file',
						action: 'Get kubeconfig',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many Kubernetes services',
						action: 'Get many kubernetes services',
					},
					{
						name: 'Get Many For Account',
						value: 'getAllForAccount',
						description: 'Get all Kubernetes services for account',
						action: 'Get many kubernetes services for account',
					},
					{
						name: 'List Availability Zones',
						value: 'listAvailabilityZones',

						action: 'List availability zones',
					},
					{
						name: 'List Flavors',
						value: 'listFlavors',

						action: 'List flavors',
					},
					{
						name: 'List Instance Pools',
						value: 'listInstancePools',

						action: 'List instance pools',
					},
					{
						name: 'List Packs',
						value: 'listPacks',
						description: 'List Kubernetes packs',
						action: 'List kubernetes packs',
					},
					{
						name: 'List Regions',
						value: 'listRegions',

						action: 'List regions',
					},
					{
						name: 'List Versions',
						value: 'listVersions',
						description: 'List Kubernetes versions',
						action: 'List kubernetes versions',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a Kubernetes service',
						action: 'Update kubernetes service',
					},
					{
						name: 'Update Instance Pool',
						value: 'updateInstancePool',
						description: 'Update an instance pool',
						action: 'Update instance pool',
					},
				],
				default: 'getAll',
			},
			// Common Parameters - Public Cloud ID
			{
				displayName: 'Public Cloud ID',
				name: 'publicCloudId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['publicCloud'],
						operation: ['get', 'update', 'getAccesses', 'getConfig'],
					},
				},
				description: 'The public cloud identifier',
			},
			{
				displayName: 'Public Cloud ID',
				name: 'publicCloudId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['project'],
					},
				},
				description: 'The public cloud identifier',
			},
			{
				displayName: 'Public Cloud ID',
				name: 'publicCloudId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['user', 'database', 'kubernetes'],
						operation: [
							'getAll', 'get', 'create', 'update', 'delete',
							'createInvite', 'updateWithInvite', 'getAuthFile', 'getOpenRC',
							'getPassword', 'listBackups', 'getBackup', 'createBackup', 'deleteBackup',
							'listRestores', 'getRestore', 'createRestore', 'deleteRestore',
							'listPacks', 'listRegions', 'listTypes',
							'getKubeConfig', 'listInstancePools', 'getInstancePool',
							'createInstancePool', 'updateInstancePool', 'deleteInstancePool',
							'listAvailabilityZones', 'listVersions', 'listFlavors',
						],
					},
				},
				description: 'The public cloud identifier',
			},
			// Account ID (for account-level operations)
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['database', 'kubernetes'],
						operation: ['getAllForAccount'],
					},
				},
				description: 'The account identifier',
			},
			// Project ID
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The project identifier',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['user', 'database', 'kubernetes'],
						operation: [
							'getAll', 'get', 'create', 'update', 'delete',
							'createInvite', 'updateWithInvite', 'getAuthFile', 'getOpenRC',
							'getPassword', 'listBackups', 'getBackup', 'createBackup', 'deleteBackup',
							'listRestores', 'getRestore', 'createRestore', 'deleteRestore',
							'getKubeConfig', 'listInstancePools', 'getInstancePool',
							'createInstancePool', 'updateInstancePool', 'deleteInstancePool',
						],
					},
				},
				description: 'The project identifier',
			},
			// User ID
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['get', 'update', 'updateWithInvite', 'delete', 'getAuthFile', 'getOpenRC'],
					},
				},
				description: 'The user identifier',
			},
			// Database ID
			{
				displayName: 'Database ID',
				name: 'databaseId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['database'],
						operation: [
							'get', 'update', 'delete', 'getPassword',
							'listBackups', 'getBackup', 'createBackup', 'deleteBackup',
							'listRestores', 'getRestore', 'createRestore', 'deleteRestore',
						],
					},
				},
				description: 'The database service identifier',
			},
			// Kubernetes ID
			{
				displayName: 'Kubernetes ID',
				name: 'kubernetesId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['kubernetes'],
						operation: [
							'get', 'update', 'delete', 'getKubeConfig',
							'listInstancePools', 'getInstancePool',
							'createInstancePool', 'updateInstancePool', 'deleteInstancePool',
						],
					},
				},
				description: 'The Kubernetes service identifier',
			},
			// Backup ID
			{
				displayName: 'Backup ID',
				name: 'backupId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['database'],
						operation: ['getBackup', 'deleteBackup'],
					},
				},
				description: 'The backup identifier',
			},
			// Restore ID
			{
				displayName: 'Restore ID',
				name: 'restoreId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['database'],
						operation: ['getRestore', 'deleteRestore'],
					},
				},
				description: 'The restore identifier',
			},
			// Pool ID
			{
				displayName: 'Pool ID',
				name: 'poolId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['kubernetes'],
						operation: ['getInstancePool', 'updateInstancePool', 'deleteInstancePool'],
					},
				},
				description: 'The instance pool identifier',
			},
			// Region (optional for some operations)
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getAuthFile', 'getOpenRC'],
					},
				},
				description: 'The region for the authentication file',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['kubernetes'],
						operation: ['listAvailabilityZones'],
					},
				},
				description: 'Filter by region',
			},
			// Return All / Limit Parameters
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['getAll', 'getAllForAccount', 'getAccesses', 'listBackups', 'listRestores', 'listInstancePools'],
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
						operation: ['getAll', 'getAllForAccount', 'getAccesses', 'listBackups', 'listRestores', 'listInstancePools'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				description: 'Max number of results to return',
			},
			// Public Cloud Update Fields
			{
				displayName: 'Update Fields',
				name: 'updateData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['publicCloud'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Public cloud name',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Public cloud description',
					},
				],
			},
			// Project Data (for create)
			{
				displayName: 'Project Data',
				name: 'projectData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create', 'createWithInvite'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Project description',
					},
					{
						displayName: 'Domain ID',
						name: 'domain_id',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								'/operation': ['create'],
							},
						},
						description: 'Domain identifier',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						displayOptions: {
							show: {
								'/operation': ['createWithInvite'],
							},
						},
						description: 'Email address for invitation',
					},
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
						displayOptions: {
							show: {
								'/operation': ['create'],
							},
						},
						description: 'Whether the project is enabled',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',

						default: '',
						description: 'Project name',
					},
					{
						displayName: 'Parent ID',
						name: 'parent_id',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								'/operation': ['create'],
							},
						},
						description: 'Parent project identifier',
					},
					{
						displayName: 'Role',
						name: 'role',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								'/operation': ['createWithInvite'],
							},
						},
						description: 'User role',
					},
				],
			},
			// Project Update Fields
			{
				displayName: 'Update Fields',
				name: 'updateData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Project name',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Project description',
					},
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
						description: 'Whether the project is enabled',
					},
				],
			},
			// User Data (for create)
			{
				displayName: 'User Data',
				name: 'userData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create', 'createInvite'],
					},
				},
				options: [
					{
						displayName: 'Default Project ID',
						name: 'default_project_id',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								'/operation': ['create'],
							},
						},
						description: 'Default project identifier',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'User description',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'User email address',
					},
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
						displayOptions: {
							show: {
								'/operation': ['create'],
							},
						},
						description: 'Whether the user is enabled',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								'/operation': ['create'],
							},
						},
						description: 'User name',
					},
					{
						displayName: 'Password',
						name: 'password',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						displayOptions: {
							show: {
								'/operation': ['create'],
							},
						},
						description: 'User password',
					},
					{
						displayName: 'Role',
						name: 'role',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								'/operation': ['createInvite'],
							},
						},
						description: 'User role',
					},
				],
			},
			// User Update Fields
			{
				displayName: 'Update Fields',
				name: 'updateData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['update', 'updateWithInvite'],
					},
				},
				options: [
					{
						displayName: 'Default Project ID',
						name: 'default_project_id',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								'/operation': ['update'],
							},
						},
						description: 'Default project identifier',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								'/operation': ['update'],
							},
						},
						description: 'User description',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'User email address',
					},
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
						displayOptions: {
							show: {
								'/operation': ['update'],
							},
						},
						description: 'Whether the user is enabled',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								'/operation': ['update'],
							},
						},
						description: 'User name',
					},
					{
						displayName: 'Password',
						name: 'password',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						displayOptions: {
							show: {
								'/operation': ['update'],
							},
						},
						description: 'User password',
					},
					{
						displayName: 'Role',
						name: 'role',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								'/operation': ['updateWithInvite'],
							},
						},
						description: 'User role',
					},
				],
			},
			// Database Data (for create)
			{
				displayName: 'Database Data',
				name: 'databaseData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['database'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Flavor',
						name: 'flavor',
						type: 'string',
						default: '',
						description: 'Flavor identifier',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',

						default: '',
						description: 'Database service name',
					},
					{
						displayName: 'Pack',
						name: 'pack',
						type: 'string',
						required: true,
						default: '',
						description: 'Pack identifier',
					},
					{
						displayName: 'Password',
						name: 'password',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'Database password',
					},
					{
						displayName: 'Region',
						name: 'region',
						type: 'string',
						required: true,
						default: '',
						description: 'Region identifier',
					},
					{
						displayName: 'Storage Size',
						name: 'storage_size',
						type: 'number',
						default: 10,
						description: 'Storage size in GB',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'string',
						required: true,
						default: '',
						description: 'Database type (e.g., mysql, postgresql, mongodb)',
					},
					{
						displayName: 'Version',
						name: 'version',
						type: 'string',
						required: true,
						default: '',
						description: 'Database version',
					},
				],
			},
			// Database Update Fields
			{
				displayName: 'Update Fields',
				name: 'updateData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['database'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Database service name',
					},
					{
						displayName: 'Pack',
						name: 'pack',
						type: 'string',
						default: '',
						description: 'Pack identifier',
					},
					{
						displayName: 'Storage Size',
						name: 'storage_size',
						type: 'number',
						default: 10,
						description: 'Storage size in GB',
					},
				],
			},
			// Backup Data (for create)
			{
				displayName: 'Backup Data',
				name: 'backupData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['database'],
						operation: ['createBackup'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',

						default: '',
						description: 'Backup name',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Backup description',
					},
				],
			},
			// Restore Data (for create)
			{
				displayName: 'Restore Data',
				name: 'restoreData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['database'],
						operation: ['createRestore'],
					},
				},
				options: [
					{
						displayName: 'Backup ID',
						name: 'backup_id',
						type: 'string',

						default: '',
						description: 'Backup identifier to restore from',
					},
				],
			},
			// Kubernetes Data (for create)
			{
				displayName: 'Kubernetes Data',
				name: 'kubernetesData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['kubernetes'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',

						default: '',
						description: 'Kubernetes service name',
					},
					{
						displayName: 'Version',
						name: 'version',
						type: 'string',
						required: true,
						default: '',
						description: 'Kubernetes version',
					},
					{
						displayName: 'Region',
						name: 'region',
						type: 'string',
						required: true,
						default: '',
						description: 'Region identifier',
					},
				],
			},
			// Kubernetes Update Fields
			{
				displayName: 'Update Fields',
				name: 'updateData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['kubernetes'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Kubernetes service name',
					},
					{
						displayName: 'Version',
						name: 'version',
						type: 'string',
						default: '',
						description: 'Kubernetes version',
					},
				],
			},
			// Instance Pool Data (for create)
			{
				displayName: 'Pool Data',
				name: 'poolData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['kubernetes'],
						operation: ['createInstancePool'],
					},
				},
				options: [
					{
						displayName: 'Autoscaling Enabled',
						name: 'autoscaling_enabled',
						type: 'boolean',
						default: false,
						description: 'Whether autoscaling is enabled',
					},
					{
						displayName: 'Availability Zone',
						name: 'availability_zone',
						type: 'string',
						default: '',

					},
					{
						displayName: 'Flavor',
						name: 'flavor',
						type: 'string',
						required: true,
						default: '',
						description: 'Flavor identifier',
					},
					{
						displayName: 'Max Size',
						name: 'max_size',
						type: 'number',
						default: 10,
						description: 'Maximum number of instances for autoscaling',
					},
					{
						displayName: 'Min Size',
						name: 'min_size',
						type: 'number',
						default: 1,
						description: 'Minimum number of instances for autoscaling',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',

						default: '',
						description: 'Instance pool name',
					},
					{
						displayName: 'Size',
						name: 'size',
						type: 'number',
						required: true,
						default: 1,
						description: 'Number of instances',
					},
				],
			},
			// Instance Pool Update Fields
			{
				displayName: 'Update Fields',
				name: 'updateData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['kubernetes'],
						operation: ['updateInstancePool'],
					},
				},
				options: [
					{
						displayName: 'Autoscaling Enabled',
						name: 'autoscaling_enabled',
						type: 'boolean',
						default: false,
						description: 'Whether autoscaling is enabled',
					},
					{
						displayName: 'Max Size',
						name: 'max_size',
						type: 'number',
						default: 10,
						description: 'Maximum number of instances for autoscaling',
					},
					{
						displayName: 'Min Size',
						name: 'min_size',
						type: 'number',
						default: 1,
						description: 'Minimum number of instances for autoscaling',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Instance pool name',
					},
					{
						displayName: 'Size',
						name: 'size',
						type: 'number',
						default: 1,
						description: 'Number of instances',
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
			publicCloud: PublicCloudResource.execute,
			project: ProjectResource.execute,
			user: UserResource.execute,
			database: DatabaseResource.execute,
			kubernetes: KubernetesResource.execute,
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
