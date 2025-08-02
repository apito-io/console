export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  plan: 'free' | 'pro' | 'enterprise';
  db: string;
  status?: 'LIVE' | 'INACTIVE' | 'DEVELOPMENT';
  avatar?: string;
  color?: string;
  owner?: string;
  accessLevel?: 'admin' | 'editor' | 'viewer';
  project_type?: number; // 1 for SaaS, 0 for regular
}

export interface ProjectListResponse {
  body: Project[];
  code: number;
  message?: string;
}

export interface ProjectSettings {
  id: string;
  projectId: string;
  name: string;
  description: string;
  // Add other settings as needed
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  template?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: Project['status'];
}

export interface ProjectSwitchRequest {
  id: string;
}

export interface ProjectDeleteRequest {
  id: string;
} 