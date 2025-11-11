/**
 * Infomaniak API Type Definitions
 *
 * This file contains all TypeScript interfaces and types for the Infomaniak API.
 * These types ensure type safety and provide IntelliSense support throughout the codebase.
 */

// ============================================================================
// Common API Response Types
// ============================================================================

/**
 * Standard Infomaniak API response wrapper
 */
export interface InfomaniakApiResponse<T = unknown> {
	result: 'success' | 'error';
	data?: T;
	error?: string;
	error_description?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
	result: 'success' | 'error';
	data: T[];
	total?: number;
	page?: number;
	per_page?: number;
}

// ============================================================================
// Action Resource Types
// ============================================================================

export interface Action {
	id: number;
	name: string;
	created_at?: string;
	updated_at?: string;
}

export interface ActionSearchParams {
	search?: string;
}

// ============================================================================
// Country Resource Types
// ============================================================================

export interface Country {
	id: number;
	code: string;
	name: string;
	enabled: boolean;
}

export interface CountrySearchParams {
	search?: string;
	only_enabled?: boolean;
	only_enabled_exception?: number[];
	order_by?: string;
	order?: 'asc' | 'desc';
	page?: number;
	per_page?: number;
}

// ============================================================================
// Event Resource Types
// ============================================================================

export interface Event {
	id: number;
	type: string;
	title: string;
	description?: string;
	created_at: string;
	
}

export interface EventSearchParams {
	search?: string;
}

export interface PublicCloudStatus {
	status: string;
	incidents?: Array<{
		id: string;
		title: string;
		status: string;
		created_at: string;
	}>;
	
}

// ============================================================================
// Language Resource Types
// ============================================================================

export interface Language {
	id: number;
	code: string;
	name: string;
	locale: string;
	
}

export interface LanguageSearchParams {
	search?: string;
}

// ============================================================================
// Product Resource Types
// ============================================================================

export interface Product {
	id: number;
	name: string;
	description?: string;
	category?: string;
	
}

// ============================================================================
// Profile Resource Types
// ============================================================================

export interface Profile {
	id: number;
	email: string;
	first_name?: string;
	last_name?: string;
	avatar_url?: string;
	locale?: string;
	timezone?: string;
	
}

export interface ProfileUpdateData {
	first_name?: string;
	last_name?: string;
	locale?: string;
	timezone?: string;
	country_id?: number;
	language_id?: number;
	
}

export interface AppPassword {
	id: number;
	name: string;
	created_at: string;
	last_used_at?: string;
	
}

export interface Email {
	id: number;
	email: string;
	verified: boolean;
	primary: boolean;
	
}

export interface Phone {
	id: number;
	number: string;
	verified: boolean;
	primary: boolean;
	
}

// ============================================================================
// Task Resource Types
// ============================================================================

export interface Task {
	id: number;
	status: 'pending' | 'running' | 'completed' | 'failed';
	type: string;
	progress?: number;
	result?: unknown;
	error?: string;
	created_at: string;
	updated_at: string;
	
}

export interface TaskSearchParams {
	search?: string;
}

// ============================================================================
// Timezone Resource Types
// ============================================================================

export interface Timezone {
	id: number;
	name: string;
	offset: string;
	
}

export interface TimezoneSearchParams {
	search?: string;
}

// ============================================================================
// User Management Resource Types
// ============================================================================

export interface Account {
	id: number;
	name: string;
	owner_id?: number;
	created_at?: string;
	
}

export interface User {
	id: number;
	email: string;
	first_name?: string;
	last_name?: string;
	role?: string;
	role_type?: number;
	status?: string;
	
}

export interface InviteUserData {
	email: string;
	first_name?: string;
	last_name?: string;
	locale?: string;
	role_type?: number;
	service_id?: number;
	order_for?: Array<{
		product_type: string;
		service_id: number;
	}>;
	
}

export interface Team {
	id: number;
	name: string;
	description?: string;
	members?: User[];
	created_at?: string;
	
}

export interface TeamCreateData {
	name: string;
	description?: string;
}

export interface TeamUpdateData {
	name?: string;
	description?: string;
}

// ============================================================================
// kSuite Resource Types
// ============================================================================

export interface MySuite {
	id: number;
	name: string;
	status?: string;
	
}

export interface Workspace {
	id: number;
	name: string;
	users?: User[];
	
}

export interface Mailbox {
	id: number;
	email: string;
	password?: string;
	is_primary?: boolean;
	
}

export interface MailboxAttachData {
	password: string;
	is_primary?: boolean;
}

export interface MailboxPasswordUpdate {
	new_password: string;
}

// ============================================================================
// Query String and Body Types
// ============================================================================

export interface QueryString {
	search?: string;
	page?: number;
	per_page?: number;
	order_by?: string;
	order?: 'asc' | 'desc';
	[key: string]: string | number | boolean | number[] | undefined;
}

export type RequestBody = Record<string, unknown>;

// ============================================================================
// Validation Types
// ============================================================================

export type Locale =
	| 'de_CH'
	| 'de_DE'
	| 'en_GB'
	| 'en_US'
	| 'es_ES'
	| 'fr_CH'
	| 'fr_FR'
	| 'it_CH'
	| 'it_IT';

export type RoleType = 0 | 1 | 2 | 3 | 4 | 5;

export type OrderDirection = 'asc' | 'desc';

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
	code?: number;
	message: string;
	description?: string;
	details?: unknown;
}
