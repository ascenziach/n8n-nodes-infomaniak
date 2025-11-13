/**
 * Room Resource Handler
 *
 * Handles operations for kMeet conference rooms
 */

import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import {
	infomaniakApiRequestGET,
	infomaniakApiRequestPOST,
} from '../utils';
import { PlannedConferenceReturn, ConferenceOptions, CalendarEventAttendee } from '../types';

export class RoomResource {
	/**
	 * Execute Room operations
	 */
	static async execute(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const operationMap: Record<string, () => Promise<INodeExecutionData[]>> = {
			planConference: () => RoomResource.planConference(context, itemIndex),
			getRoomSettings: () => RoomResource.getRoomSettings(context, itemIndex),
		};

		const handler = operationMap[operation];
		if (handler) {
			return await handler();
		}

		return [];
	}

	/**
	 * Plan a conference
	 * POST /1/kmeet/rooms
	 */
	private static async planConference(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const calendarId = context.getNodeParameter('calendarId', itemIndex) as number;
		const startingAt = context.getNodeParameter('startingAt', itemIndex) as string;
		const endingAt = context.getNodeParameter('endingAt', itemIndex) as string;
		const timezone = context.getNodeParameter('timezone', itemIndex) as string;
		const hostname = context.getNodeParameter('hostname', itemIndex) as string;
		const title = context.getNodeParameter('title', itemIndex) as string;
		const description = context.getNodeParameter('description', itemIndex, '') as string;
		const subject = context.getNodeParameter('subject', itemIndex) as string;
		const roomOptions = context.getNodeParameter('roomOptions', itemIndex, {}) as IDataObject;
		const attendeesData = context.getNodeParameter('attendees', itemIndex, {}) as IDataObject;

		// Format dates to "YYYY-MM-DD HH:mm:ss"
		const formatDate = (isoDate: string): string => {
			const date = new Date(isoDate);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			const seconds = String(date.getSeconds()).padStart(2, '0');
			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		};

		// Build attendees array
		const attendees: CalendarEventAttendee[] = [];
		if (attendeesData.attendee && Array.isArray(attendeesData.attendee)) {
			for (const attendee of attendeesData.attendee) {
				attendees.push({
					address: attendee.address as string,
					name: attendee.name as string,
					state: attendee.state as CalendarEventAttendee['state'],
					organizer: attendee.organizer as boolean,
				});
			}
		}

		// Build conference options
		const options: ConferenceOptions = {
			subject,
			start_audio_muted: roomOptions.startAudioMuted as boolean || false,
			enable_recording: roomOptions.enableRecording as boolean || false,
			enable_moderator_video: roomOptions.enableModeratorVideo !== undefined
				? roomOptions.enableModeratorVideo as boolean
				: true,
			start_audio_only: roomOptions.startAudioOnly as boolean || false,
			lobby_enabled: roomOptions.lobbyEnabled as boolean || false,
			password_enabled: roomOptions.passwordEnabled as boolean || false,
			e2ee_enabled: roomOptions.e2eeEnabled as boolean || false,
		};

		if (roomOptions.driveId) {
			options.drive_id = roomOptions.driveId as number;
		}

		if (roomOptions.password) {
			options.password = roomOptions.password as string;
		}

		const body: Record<string, unknown> = {
			calendar_id: calendarId,
			starting_at: formatDate(startingAt),
			ending_at: formatDate(endingAt),
			timezone,
			hostname,
			title,
			options: [options],
		};

		if (description) {
			body.description = description;
		}

		if (attendees.length > 0) {
			body.attendees = attendees;
		}

		const response = await infomaniakApiRequestPOST<{
			result: string;
			data: PlannedConferenceReturn;
		}>(
			context,
			'/1/kmeet/rooms',
			body,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}

	/**
	 * Get room settings
	 * GET /1/kmeet/rooms/{room_id}/settings
	 */
	private static async getRoomSettings(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const roomId = context.getNodeParameter('roomId', itemIndex) as string;

		const response = await infomaniakApiRequestGET<{
			result: string;
			data: PlannedConferenceReturn;
		}>(
			context,
			`/1/kmeet/rooms/${roomId}/settings`,
			undefined,
			itemIndex,
		);

		return context.helpers.returnJsonArray(response.data as unknown as IDataObject);
	}
}
