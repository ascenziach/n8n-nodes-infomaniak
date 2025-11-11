/**
 * API Types for Infomaniak Public Cloud
 *
 * Type definitions for public clouds, projects, users, databases, and Kubernetes services
 */

/**
 * Public Cloud
 */
export interface PublicCloud {
	id: string;
	name: string;
	description?: string;
	status: string;
	region: string;
	project_id?: string;
	created_at: string;
	updated_at: string;
}

/**
 * Public Cloud Configuration
 */
export interface PublicCloudConfig {
	id: string;
	name: string;
	description?: string;
	settings: Record<string, unknown>;
	created_at: string;
	updated_at: string;
}

/**
 * Public Cloud Access
 */
export interface PublicCloudAccess {
	id: string;
	user_id: string;
	username: string;
	email: string;
	role: string;
	permissions: string[];
	created_at: string;
}

/**
 * Project (OpenStack Project)
 */
export interface Project {
	id: string;
	name: string;
	description?: string;
	enabled: boolean;
	domain_id?: string;
	parent_id?: string;
	is_domain?: boolean;
	created_at: string;
	updated_at: string;
}

/**
 * User (OpenStack User)
 */
export interface User {
	id: string;
	name: string;
	email?: string;
	description?: string;
	enabled: boolean;
	domain_id?: string;
	default_project_id?: string;
	password_expires_at?: string;
	created_at: string;
	updated_at: string;
}

/**
 * User Authentication File
 */
export interface UserAuthFile {
	content: string;
	filename: string;
	format: 'clouds.yaml' | 'openrc';
}

/**
 * Database Service
 */
export interface DatabaseService {
	id: string;
	name: string;
	type: string;
	version: string;
	status: string;
	region: string;
	pack: string;
	flavor?: string;
	storage_size?: number;
	host?: string;
	port?: number;
	username?: string;
	created_at: string;
	updated_at: string;
}

/**
 * Database Backup
 */
export interface DatabaseBackup {
	id: string;
	database_service_id: string;
	name: string;
	description?: string;
	status: string;
	size?: number;
	created_at: string;
	updated_at: string;
}

/**
 * Database Restore
 */
export interface DatabaseRestore {
	id: string;
	backup_id: string;
	database_service_id: string;
	status: string;
	created_at: string;
	completed_at?: string;
}

/**
 * Database Pack
 */
export interface DatabasePack {
	id: string;
	name: string;
	description?: string;
	vcpus: number;
	ram: number;
	storage: number;
	price?: number;
}

/**
 * Database Type
 */
export interface DatabaseType {
	id: string;
	name: string;
	versions: string[];
	description?: string;
}

/**
 * Database Password/Connection Info
 */
export interface DatabasePassword {
	password?: string;
	host?: string;
	port?: number;
	username?: string;
	database?: string;
	connection_string?: string;
}

/**
 * Kubernetes Service
 */
export interface KubernetesService {
	id: string;
	name: string;
	version: string;
	status: string;
	region: string;
	endpoint?: string;
	created_at: string;
	updated_at: string;
}

/**
 * Kubernetes Instance Pool (Worker Pool)
 */
export interface KubernetesInstancePool {
	id: string;
	kubernetes_service_id: string;
	name: string;
	flavor: string;
	size: number;
	min_size?: number;
	max_size?: number;
	autoscaling_enabled?: boolean;
	availability_zone?: string;
	status: string;
	created_at: string;
	updated_at: string;
}

/**
 * Kubernetes Config
 */
export interface KubernetesConfig {
	content: string;
	filename: string;
}

/**
 * Kubernetes Version
 */
export interface KubernetesVersion {
	version: string;
	default: boolean;
	deprecated?: boolean;
}

/**
 * Kubernetes Pack
 */
export interface KubernetesPack {
	id: string;
	name: string;
	description?: string;
	vcpus: number;
	ram: number;
	price?: number;
}

/**
 * Availability Zone
 */
export interface AvailabilityZone {
	name: string;
	available: boolean;
	region: string;
}

/**
 * Region
 */
export interface Region {
	id: string;
	name: string;
	country?: string;
	available: boolean;
}

/**
 * Flavor (Compute Flavor)
 */
export interface Flavor {
	id: string;
	name: string;
	vcpus: number;
	ram: number;
	disk: number;
	description?: string;
}
