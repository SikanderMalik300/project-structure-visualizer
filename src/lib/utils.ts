import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import JSZip from 'jszip';
import { FileNode, ProjectComparison } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function parseZipFile(file: File): Promise<FileNode[]> {
  const zip = await JSZip.loadAsync(file);
  const structure: FileNode[] = [];
  const pathMap = new Map<string, FileNode>();

  // Sort files to ensure directories come before their contents
  const sortedFiles = Object.keys(zip.files).sort();

  for (const path of sortedFiles) {
    const zipEntry = zip.files[path];
    const segments = path.split('/').filter(Boolean);
    
    if (segments.length === 0) continue;

    let currentLevel = structure;
    let currentPath = '';

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += (currentPath ? '/' : '') + segment;
      
      let node = currentLevel.find(n => n.name === segment);
      
      if (!node) {
        const isDirectory = i < segments.length - 1 || zipEntry.dir;
        
        // Get file size properly for files
        let fileSize: number | undefined;
        if (!isDirectory && zipEntry.async) {
          try {
            const content = await zipEntry.async('uint8array');
            fileSize = content.length;
          } catch {
            // If we can't get the content, fall back to other methods
            fileSize = undefined;
          }
        }
        
        node = {
          name: segment,
          type: isDirectory ? 'directory' : 'file',
          path: currentPath,
          children: isDirectory ? [] : undefined,
          size: fileSize,
          lastModified: zipEntry.date || new Date()
        };
        
        currentLevel.push(node);
        pathMap.set(currentPath, node);
      }
      
      if (node.type === 'directory' && node.children) {
        currentLevel = node.children;
      }
    }
  }

  return structure;
}

export function compareProjects(
  oldStructure: FileNode[],
  newStructure: FileNode[]
): ProjectComparison {
  const oldPaths = new Set<string>();
  const newPaths = new Set<string>();
  const oldNodes = new Map<string, FileNode>();
  const newNodes = new Map<string, FileNode>();

  // Build maps of all paths
  function buildMaps(nodes: FileNode[], pathSet: Set<string>, nodeMap: Map<string, FileNode>) {
    for (const node of nodes) {
      pathSet.add(node.path);
      nodeMap.set(node.path, node);
      if (node.children) {
        buildMaps(node.children, pathSet, nodeMap);
      }
    }
  }

  buildMaps(oldStructure, oldPaths, oldNodes);
  buildMaps(newStructure, newPaths, newNodes);

  const added: FileNode[] = [];
  const modified: FileNode[] = [];
  const removed: FileNode[] = [];
  const unchanged: FileNode[] = [];

  // Find added files
  for (const path of newPaths) {
    if (!oldPaths.has(path)) {
      const node = newNodes.get(path)!;
      added.push({ ...node, status: 'new' });
    }
  }

  // Find removed files
  for (const path of oldPaths) {
    if (!newPaths.has(path)) {
      removed.push(oldNodes.get(path)!);
    }
  }

  // Find modified and unchanged files
  for (const path of newPaths) {
    if (oldPaths.has(path)) {
      const oldNode = oldNodes.get(path)!;
      const newNode = newNodes.get(path)!;
      
      if (oldNode.size !== newNode.size || 
          oldNode.lastModified?.getTime() !== newNode.lastModified?.getTime()) {
        modified.push({ ...newNode, status: 'updated' });
      } else {
        unchanged.push({ ...newNode, status: 'existing' });
      }
    }
  }

  return { added, modified, removed, unchanged };
}

export function applyComparisonToStructure(
  structure: FileNode[],
  comparison: ProjectComparison
): FileNode[] {
  const statusMap = new Map<string, 'new' | 'updated' | 'existing'>();
  
  comparison.added.forEach(node => statusMap.set(node.path, 'new'));
  comparison.modified.forEach(node => statusMap.set(node.path, 'updated'));
  comparison.unchanged.forEach(node => statusMap.set(node.path, 'existing'));

  function updateStatus(nodes: FileNode[]): FileNode[] {
    return nodes.map(node => ({
      ...node,
      status: statusMap.get(node.path) || 'existing',
      children: node.children ? updateStatus(node.children) : undefined
    }));
  }

  return updateStatus(structure);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

export function generateTreeText(structure: FileNode[], prefix = '', isLast = true): string {
  let result = '';
  
  structure.forEach((node, index) => {
    const isLastItem = index === structure.length - 1;
    const connector = isLastItem ? '└── ' : '├── ';
    
    result += `${prefix}${connector}${node.name}\n`;
    
    if (node.children && node.children.length > 0) {
      const newPrefix = prefix + (isLastItem ? '    ' : '│   ');
      result += generateTreeText(node.children, newPrefix, isLastItem);
    }
  });
  
  return result;
}

export function downloadProjectStructure(structure: FileNode[], projectName?: string) {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const filename = projectName ? `${projectName}-structure-${timestamp}.txt` : `project-structure-${timestamp}.txt`;
  
  let content = `Project Structure\n`;
  content += `Generated on: ${new Date().toLocaleString()}\n`;
  if (projectName) {
    content += `Project: ${projectName}\n`;
  }
  content += `\n`;
  content += generateTreeText(structure);
  
  // Create and trigger download
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}