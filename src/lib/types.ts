export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileNode[];
  status?: 'new' | 'updated' | 'existing';
  size?: number;
  lastModified?: Date;
}

export interface ProjectSnapshot {
  id: string;
  name: string;
  description?: string;
  structure: FileNode[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectComparison {
  added: FileNode[];
  modified: FileNode[];
  removed: FileNode[];
  unchanged: FileNode[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}