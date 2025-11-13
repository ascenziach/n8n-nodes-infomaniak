import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import {
	RoomResource,
} from './resources';

export class InfomaniakKMeet implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infomaniak kMeet',
		name: 'infomaniakKMeet',
		icon: 'file:InfomaniakKMeet.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Plan and manage video conferences with Infomaniak kMeet - Developed by Ascenzia (ascenzia.ch)',
		defaults: {
			name: 'Infomaniak kMeet',
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
						name: 'Plan Conference',
						value: 'planConference',
						description: 'Plan a video conference with calendar integration',
						action: 'Plan a conference',
					},
					{
						name: 'Get Room Settings',
						value: 'getRoomSettings',
						description: 'Get settings for a room',
						action: 'Get room settings',
					},
				],
				default: 'planConference',
			},
			// ===========================================
			// Plan Conference Fields
			// ===========================================
			{
				displayName: 'Calendar ID',
				name: 'calendarId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						operation: ['planConference'],
					},
				},
				description: 'The unique identifier (ID) of the Infomaniak Calendar where you want to plan the meeting',
			},
			{
				displayName: 'Starting At',
				name: 'startingAt',
				type: 'dateTime',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['planConference'],
					},
				},
				description: 'Event starting date and time',
			},
			{
				displayName: 'Ending At',
				name: 'endingAt',
				type: 'dateTime',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['planConference'],
					},
				},
				description: 'Event ending date and time (room settings can be deleted if this date expires)',
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: 'Europe/Zurich',
				required: true,
				displayOptions: {
					show: {
						operation: ['planConference'],
					},
				},
				description: 'Event timezone (e.g., Europe/Zurich, America/New_York)',
			},
			{
				displayName: 'Hostname',
				name: 'hostname',
				type: 'string',
				default: 'kmeet.infomaniak.com',
				required: true,
				displayOptions: {
					show: {
						operation: ['planConference'],
					},
				},
				description: 'Hostname for the kMeet instance',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['planConference'],
					},
				},
				description: 'Event title (max 150 characters)',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['planConference'],
					},
				},
				description: 'Event description (max 2000 characters)',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['planConference'],
					},
				},
				description: 'Conference room subject',
			},
			// Room Options
			{
				displayName: 'Room Options',
				name: 'roomOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['planConference'],
					},
				},
				options: [
					{
						name: 'Start Audio Muted',
						value: 'startAudioMuted',
						type: 'boolean',
						default: false,
						description: 'Whether to start with audio muted',
					},
					{
						name: 'Enable Recording',
						value: 'enableRecording',
						type: 'boolean',
						default: false,
						description: 'Whether to enable auto recording',
					},
					{
						name: 'Drive ID',
						value: 'driveId',
						type: 'number',
						default: 0,
						description: 'The kDrive ID (required if enable_recording is true)',
					},
					{
						name: 'Enable Moderator Video',
						value: 'enableModeratorVideo',
						type: 'boolean',
						default: true,
						description: 'Whether to enable video for moderator',
					},
					{
						name: 'Start Audio Only',
						value: 'startAudioOnly',
						type: 'boolean',
						default: false,
						description: 'Whether to start with audio only',
					},
					{
						name: 'Lobby Enabled',
						value: 'lobbyEnabled',
						type: 'boolean',
						default: false,
						description: 'Whether to enable lobby',
					},
					{
						name: 'Password Enabled',
						value: 'passwordEnabled',
						type: 'boolean',
						default: false,
						description: 'Whether to enable password protection',
					},
					{
						name: 'Password',
						value: 'password',
						type: 'string',
						default: '',
						description: 'Password (required if password_enabled is true)',
					},
					{
						name: 'E2EE Enabled',
						value: 'e2eeEnabled',
						type: 'boolean',
						default: false,
						description: 'Whether to enable end-to-end encryption',
					},
				],
			},
			{
				displayName: 'Attendees',
				name: 'attendees',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				displayOptions: {
					show: {
						operation: ['planConference'],
					},
				},
				options: [
					{
						name: 'attendee',
						displayName: 'Attendee',
						values: [
							{
								displayName: 'Email Address',
								name: 'address',
								type: 'string',
								default: '',
								required: true,
								description: 'Email address of the attendee',
							},
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Name of the attendee',
							},
							{
								displayName: 'State',
								name: 'state',
								type: 'options',
								default: 'NEEDS-ACTION',
								options: [
									{
										name: 'Needs Action',
										value: 'NEEDS-ACTION',
									},
									{
										name: 'Accepted',
										value: 'ACCEPTED',
									},
									{
										name: 'Declined',
										value: 'DECLINED',
									},
									{
										name: 'Tentative',
										value: 'TENTATIVE',
									},
									{
										name: 'Delegated',
										value: 'DELEGATED',
									},
								],
								description: 'Attendance status',
							},
							{
								displayName: 'Is Organizer',
								name: 'organizer',
								type: 'boolean',
								default: false,
								description: 'Whether this attendee is the organizer',
							},
						],
					},
				],
			},
			// ===========================================
			// Get Room Settings Fields
			// ===========================================
			{
				displayName: 'Room ID',
				name: 'roomId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['getRoomSettings'],
					},
				},
				description: 'The unique identifier of the room',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const result = await RoomResource.execute(this, operation, i);
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
