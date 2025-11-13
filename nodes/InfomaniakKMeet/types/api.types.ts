/**
 * API Types for kMeet
 */

// ============================================================================
// Conference/Room Types
// ============================================================================

export interface PlannedConference {
	calendar_id: number;
	starting_at: string;
	ending_at: string;
	timezone: string;
	hostname: string;
	title: string;
	description?: string;
	attendees?: CalendarEventAttendee[];
	options: ConferenceOptions[];
}

export interface PlannedConferenceReturn {
	id: number;
	name: string;
	code: string;
	user_id: number;
	event_id: number;
	created_at: string;
	updated_at: string;
	ending_at: string;
	hostname: string;
	options: ConferenceOptionsReturn[];
}

export interface CalendarEventAttendee {
	address: string;
	organizer?: boolean;
	state: 'NEEDS-ACTION' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE' | 'DELEGATED';
	name?: string;
}

export interface ConferenceOptions {
	subject: string;
	start_audio_muted: boolean;
	enable_recording: boolean;
	drive_id?: number;
	enable_moderator_video: boolean;
	start_audio_only: boolean;
	lobby_enabled: boolean;
	password_enabled: boolean;
	password?: string;
	e2ee_enabled: boolean;
}

export interface ConferenceOptionsReturn {
	subject: string;
	start_audio_muted: boolean;
	enable_recording: boolean;
	drive_id?: number;
	enable_moderator_video: boolean;
	start_audio_only: boolean;
	lobby_enabled: boolean;
	password_enabled: boolean;
	e2ee_enabled: boolean;
}
