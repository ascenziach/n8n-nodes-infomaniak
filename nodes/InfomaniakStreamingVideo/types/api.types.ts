/**
 * API Types for Infomaniak Streaming Video
 *
 * Type definitions for channels, players, events, and related entities
 */

/**
 * Channel
 */
export interface Channel {
	id: number;
	account_id: number;
	name: string;
	slug: string;
	description?: string;
	thumbnail?: string;
	status: 'online' | 'offline';
	encoding_profile?: string;
	created_at: string;
	updated_at: string;
}

/**
 * Repeatable Planned Event
 */
export interface RepeatablePlannedEvent {
	id: number;
	channel_id: number;
	name: string;
	description?: string;
	start_time: string;
	end_time: string;
	repeat_pattern?: 'daily' | 'weekly' | 'monthly';
	created_at: string;
	updated_at: string;
}

/**
 * Player
 */
export interface Player {
	id: number;
	account_id: number;
	name: string;
	slug: string;
	channel_id?: number;
	theme?: string;
	autoplay: boolean;
	controls: boolean;
	thumbnail?: string;
	created_at: string;
	updated_at: string;
}

/**
 * Ads Configuration
 */
export interface AdsConfig {
	id: number;
	player_id: number;
	enabled: boolean;
	preroll_url?: string;
	midroll_url?: string;
	postroll_url?: string;
	midroll_interval?: number;
	created_at: string;
	updated_at: string;
}

/**
 * Recording Configuration
 */
export interface RecordingConfig {
	id: number;
	channel_id: number;
	enabled: boolean;
	storage_machine_id?: number;
	retention_days?: number;
	created_at: string;
	updated_at: string;
}

/**
 * Storage Machine
 */
export interface StorageMachine {
	id: number;
	account_id: number;
	name: string;
	type: 'ftp' | 'sftp' | 's3';
	host: string;
	port?: number;
	username?: string;
	path?: string;
	status: 'active' | 'inactive';
	created_at: string;
	updated_at: string;
}

/**
 * Simulcast Configuration
 */
export interface SimulcastConfig {
	id: number;
	channel_id: number;
	name: string;
	enabled: boolean;
	platform: string;
	url: string;
	stream_key?: string;
	created_at: string;
	updated_at: string;
}

/**
 * Restrictions
 */
export interface Restrictions {
	channel_id: number;
	password_enabled: boolean;
	password_hash?: string;
	geo_restriction_enabled: boolean;
	allowed_countries?: string[];
	blocked_countries?: string[];
	domain_restriction_enabled: boolean;
	allowed_domains?: string[];
	updated_at: string;
}

/**
 * Account Consumption Statistics
 */
export interface ConsumptionStats {
	total_bandwidth: number;
	total_requests: number;
	period: string;
	data: Array<{
		date: string;
		bandwidth: number;
		requests: number;
	}>;
}

/**
 * Viewer Statistics
 */
export interface ViewerStats {
	total_viewers: number;
	unique_viewers: number;
	period: string;
	data: Array<{
		date: string;
		viewers: number;
		unique_viewers: number;
	}>;
}

/**
 * Viewing Time Statistics
 */
export interface ViewingStats {
	total_minutes: number;
	average_duration: number;
	period: string;
	data: Array<{
		date: string;
		minutes: number;
	}>;
}

/**
 * Geolocation Statistics
 */
export interface GeolocationStats {
	countries: Array<{
		country_code: string;
		country_name: string;
		viewers: number;
		percentage: number;
	}>;
	clusters: Array<{
		cluster: string;
		viewers: number;
		percentage: number;
	}>;
}

/**
 * Share Statistics (Browser/OS/Player)
 */
export interface ShareStats {
	data: Array<{
		name: string;
		percentage: number;
		viewers: number;
	}>;
}

/**
 * Connection History
 */
export interface ConnectionHistory {
	channel_id: number;
	connections: Array<{
		timestamp: string;
		ip_address: string;
		user_agent: string;
		country?: string;
		duration?: number;
	}>;
}

/**
 * Integration Code
 */
export interface IntegrationCode {
	html_code: string;
	iframe_code: string;
	javascript_code?: string;
}

/**
 * Embed URL
 */
export interface EmbedUrl {
	url: string;
	width?: number;
	height?: number;
	autoplay?: boolean;
}

/**
 * Option
 */
export interface Option {
	id: number;
	account_id: number;
	name: string;
	type: string;
	status: 'active' | 'inactive' | 'pending';
	expires_at?: string;
	created_at: string;
	updated_at: string;
}

/**
 * Timeshift Configuration
 */
export interface TimeshiftConfig {
	channel_id: number;
	enabled: boolean;
	duration_minutes?: number;
	created_at: string;
	updated_at: string;
}

/**
 * Watermark Configuration
 */
export interface WatermarkConfig {
	channel_id: number;
	enabled: boolean;
	image_url?: string;
	position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
	opacity?: number;
	created_at: string;
	updated_at: string;
}
