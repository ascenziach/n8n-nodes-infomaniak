/**
 * API Types for Infomaniak Email
 *
 * Type definitions for mailboxes, aliases, auto-replies, signatures, forwarding, mailing lists, and redirections
 */

/**
 * Mailbox
 */
export interface Mailbox {
	id: number;
	mailbox_name: string;
	email_address: string;
	quota: number;
	quota_used: number;
	is_locked: boolean;
	is_valid: boolean;
	created_at: string;
	updated_at: string;
}

/**
 * Alias
 */
export interface Alias {
	id: number;
	alias: string;
	mailbox_name: string;
	created_at: string;
	updated_at: string;
}

/**
 * Auto Reply
 */
export interface AutoReply {
	id: number;
	mailbox_name?: string;
	subject: string;
	message: string;
	start_date?: string;
	end_date?: string;
	is_enabled: boolean;
	created_at: string;
	updated_at: string;
}

/**
 * Signature
 */
export interface Signature {
	id: number;
	mailbox_name: string;
	name: string;
	content: string;
	is_default_new: boolean;
	is_default_reply: boolean;
	created_at: string;
	updated_at: string;
}

/**
 * Forwarding Address
 */
export interface ForwardingAddress {
	id: number;
	mailbox_name: string;
	forwarding_address: string;
	keep_copy: boolean;
	is_enabled: boolean;
	created_at: string;
	updated_at: string;
}

/**
 * Mailing List
 */
export interface MailingList {
	id: number;
	name: string;
	email_address: string;
	description?: string;
	is_moderated: boolean;
	members: MailingListMember[];
	created_at: string;
	updated_at: string;
}

/**
 * Mailing List Member
 */
export interface MailingListMember {
	email: string;
	is_moderator: boolean;
}

/**
 * Redirection
 */
export interface Redirection {
	id: number;
	source: string;
	destination: string;
	is_enabled: boolean;
	redirection_type: 'permanent' | 'temporary';
	created_at: string;
	updated_at: string;
}

/**
 * Email Send Request
 */
export interface EmailSendRequest {
	to: string[];
	subject: string;
	message: string;
	cc?: string[];
	bcc?: string[];
	reply_to?: string;
}

/**
 * Default Signatures Configuration
 */
export interface DefaultSignatures {
	default_new_signature_id?: number | null;
	default_reply_signature_id?: number | null;
}
