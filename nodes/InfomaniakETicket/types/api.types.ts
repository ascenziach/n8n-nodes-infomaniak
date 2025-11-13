/**
 * API Types for eTicket
 */

// ============================================================================
// Ticket Types
// ============================================================================

export interface Ticket {
	id: number;
	label?: string;
	hardware?: string;
	status?: string;
	show_price?: boolean;
	show_tariff?: boolean;
}

export interface TicketUpdate {
	id: number;
	label?: string | null;
	hardware?: string | null;
	status?: string | null;
	show_price?: boolean | null;
	show_tariff?: boolean | null;
}

// ============================================================================
// Reservation Types
// ============================================================================

export interface Reservation {
	id: number;
	uuid: string;
	status: string;
	[key: string]: unknown;
}

// ============================================================================
// Survey Types
// ============================================================================

export interface Survey {
	id: number;
	period_id: number;
	visibility: string;
	status_id: number;
	status_name: string;
	language?: SurveyLanguage;
	fields?: SurveyField[];
}

export interface SurveyLanguage {
	[key: string]: unknown;
}

export interface SurveyField {
	id: number;
	survey_id: number;
	type: string;
	label: string;
	required: boolean;
	[key: string]: unknown;
}

export interface TicketSurveyAnswer {
	id: number;
	ticket_id: number;
	survey_field_id: number;
	value: string;
	uuid: string;
	survey_field?: unknown;
}

export interface PassSurveyAnswer {
	id: number;
	pass_id: number;
	survey_field_id: number;
	value: string;
	uuid: string;
	survey_field?: unknown;
}
