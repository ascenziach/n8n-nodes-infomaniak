/**
 * API Types for kChat
 */

// ============================================================================
// User Types
// ============================================================================

export interface User {
	id: string;
	create_at?: number;
	update_at?: number;
	delete_at?: number;
	username: string;
	first_name?: string;
	last_name?: string;
	nickname?: string;
	email: string;
	email_verified?: boolean;
	auth_service?: string;
	roles?: string;
	locale?: string;
	notify_props?: UserNotifyProps;
	props?: Record<string, unknown>;
	last_password_update?: number;
	last_picture_update?: number;
	failed_attempts?: number;
	mfa_active?: boolean;
	timezone?: Timezone;
	terms_of_service_id?: string;
	terms_of_service_create_at?: number;
}

export interface UserNotifyProps {
	email?: string;
	push?: string;
	desktop?: string;
	desktop_sound?: string;
	mention_keys?: string;
	channel?: string;
	first_name?: string;
}

export interface Timezone {
	useAutomaticTimezone?: boolean;
	manualTimezone?: string;
	automaticTimezone?: string;
}

// ============================================================================
// Team Types
// ============================================================================

export interface Team {
	id: string;
	create_at?: number;
	update_at?: number;
	delete_at?: number;
	display_name: string;
	name: string;
	description?: string;
	email?: string;
	type: string;
	allowed_domains?: string;
	invite_id?: string;
	allow_open_invite?: boolean;
}

export interface TeamMember {
	team_id: string;
	user_id: string;
	roles: string;
	delete_at?: number;
	scheme_user?: boolean;
	scheme_admin?: boolean;
	explicit_roles?: string;
}

// ============================================================================
// Channel Types
// ============================================================================

export interface Channel {
	id: string;
	create_at?: number;
	update_at?: number;
	delete_at?: number;
	team_id: string;
	type: string;
	display_name: string;
	name: string;
	header?: string;
	purpose?: string;
	last_post_at?: number;
	total_msg_count?: number;
	creator_id?: string;
}

export interface ChannelMember {
	channel_id: string;
	user_id: string;
	roles: string;
	last_viewed_at?: number;
	msg_count?: number;
	mention_count?: number;
	notify_props?: ChannelNotifyProps;
	last_update_at?: number;
}

export interface ChannelNotifyProps {
	email?: string;
	push?: string;
	desktop?: string;
	mark_unread?: string;
}

// ============================================================================
// Post Types
// ============================================================================

export interface Post {
	id: string;
	create_at?: number;
	update_at?: number;
	delete_at?: number;
	edit_at?: number;
	user_id: string;
	channel_id: string;
	root_id?: string;
	original_id?: string;
	message: string;
	type?: string;
	props?: Record<string, unknown>;
	hashtag?: string;
	file_ids?: string[];
	pending_post_id?: string;
	metadata?: PostMetadata;
}

export interface PostMetadata {
	embeds?: unknown[];
	emojis?: Emoji[];
	files?: FileInfo[];
	images?: Record<string, { height: number; width: number }>;
	reactions?: Reaction[];
}

export interface FileInfo {
	id: string;
	user_id: string;
	post_id?: string;
	create_at?: number;
	update_at?: number;
	delete_at?: number;
	name: string;
	extension: string;
	size: number;
	mime_type: string;
	width?: number;
	height?: number;
	has_preview_image?: boolean;
}

export interface Emoji {
	id: string;
	creator_id: string;
	name: string;
	create_at?: number;
	update_at?: number;
	delete_at?: number;
}

export interface Reaction {
	user_id: string;
	post_id: string;
	emoji_name: string;
	create_at?: number;
}

// ============================================================================
// Status Types
// ============================================================================

export interface Status {
	user_id: string;
	status: 'online' | 'offline' | 'away' | 'dnd';
	manual?: boolean;
	last_activity_at?: number;
}

// ============================================================================
// Common Response Types
// ============================================================================

export interface StatusOK {
	status: string;
}
