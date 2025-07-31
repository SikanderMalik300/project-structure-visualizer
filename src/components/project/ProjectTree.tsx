'use client';

import { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  File,
  Search,
  Plus,
  Pencil,
  Check,
  Download,
  Code,
  Eye,
  EyeOff,
  Copy,
  CheckCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileNode } from '@/lib/types';
import { formatFileSize, generateTreeText } from '@/lib/utils';

interface ProjectTreeProps {
  structure: FileNode[];
  searchTerm?: string;
  fileContents?: Record<string, string>; // Map of file paths to their contents
  projectName?: string;
}

interface TreeNodeProps {
  node: FileNode;
  level: number;
  searchTerm?: string;
}

interface FileContentProps {
  node: FileNode;
  content?: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

function FileContent({ node, content, isVisible, onToggleVisibility }: FileContentProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  const getLanguageFromPath = (path: string): string => {
    const extension = path.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'json': 'json',
      'css': 'css',
      'scss': 'css',
      'html': 'html',
      'md': 'markdown',
      'py': 'python',
      'sql': 'sql',
      'yml': 'yaml',
      'yaml': 'yaml',
      'toml': 'toml',
      'xml': 'xml',
      'sh': 'bash'
    };
    return languageMap[extension || ''] || 'text';
  };

  if (!content) {
    return (
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">{node.path}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">No content available</Badge>
          </div>
        </div>
        <p className="text-sm text-gray-500">File content not loaded or binary file</p>
      </div>
    );
  }

  return (
    <div className="mt-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <File className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">{node.path}</h3>
          <Badge variant="outline" className="text-xs">
            {getLanguageFromPath(node.path)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 px-2"
          >
            {copied ? (
              <CheckCheck className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
            className="h-8 px-2"
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      {isVisible && (
        <div className="p-0">
          <pre className="text-sm bg-gray-900 text-gray-100 p-4 overflow-x-auto rounded-b-lg">
            <code>{content}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

function TreeNode({ node, level, searchTerm }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const shouldShow = !searchTerm || 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.path.toLowerCase().includes(searchTerm.toLowerCase());

  const hasMatchingChildren = node.children?.some(child => 
    child.name.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    child.path.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  if (!shouldShow && !hasMatchingChildren) {
    return null;
  }

  const statusIcons = {
    new: Plus,
    updated: Pencil,
    existing: Check
  };

  const StatusIcon = node.status ? statusIcons[node.status] : null;

  return (
    <div className={`${!shouldShow ? 'opacity-50' : ''}`}>
      <div 
        className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded cursor-pointer"
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        onClick={() => node.type === 'directory' && setIsExpanded(!isExpanded)}
      >
        {node.type === 'directory' ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500" />
            )}
          </>
        ) : (
          <>
            <div className="w-4 h-4" />
            <File className="w-4 h-4 text-gray-500" />
          </>
        )}
        
        <span className="flex-1 text-sm">{node.name}</span>
        
        <div className="flex items-center gap-2">
          {StatusIcon && (
            <StatusIcon className="w-3 h-3 text-gray-400" />
          )}
          {node.size && (
            <span className="text-xs text-gray-500">
              {formatFileSize(node.size)}
            </span>
          )}
        </div>
      </div>
      
      {node.type === 'directory' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode 
              key={child.path} 
              node={child} 
              level={level + 1} 
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectTree({ structure, searchTerm, fileContents = {}, projectName }: ProjectTreeProps) {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [showAllContents, setShowAllContents] = useState(false);
  const [visibleFiles, setVisibleFiles] = useState<Set<string>>(new Set());
  
  const effectiveSearchTerm = searchTerm || internalSearchTerm;

  const getStats = (nodes: FileNode[]): { files: number; directories: number; new: number; updated: number; existing: number } => {
    let files = 0;
    let directories = 0;
    let newCount = 0;
    let updated = 0;
    let existing = 0;

    const traverse = (nodeList: FileNode[]) => {
      nodeList.forEach(node => {
        if (node.type === 'file') {
          files++;
        } else {
          directories++;
        }

        if (node.status === 'new') newCount++;
        else if (node.status === 'updated') updated++;
        else if (node.status === 'existing') existing++;

        if (node.children) {
          traverse(node.children);
        }
      });
    };

    traverse(nodes);
    return { files, directories, new: newCount, updated, existing };
  };

  const getAllFiles = (nodes: FileNode[]): FileNode[] => {
    const files: FileNode[] = [];
    
    const traverse = (nodeList: FileNode[]) => {
      nodeList.forEach(node => {
        if (node.type === 'file') {
          files.push(node);
        }
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    
    traverse(nodes);
    return files;
  };

  const downloadCompleteProject = () => {
    const timestamp = new Date().toISOString().replace(/[T:]/g, '-').slice(0, 19);
    const filename = projectName ? `${projectName.replace(/\s+/g, '_')}-complete-${timestamp}.txt` : `project-complete-${timestamp}.txt`;
    
    let content = `PROJECT STRUCTURE AND CONTENTS\n`;
    content += `Generated on: ${new Date().toLocaleString()}\n`;
    if (projectName) {
      content += `Project: ${projectName}\n`;
    }
    content += `${'='.repeat(60)}\n\n`;
    
    // Add tree structure
    content += `TREE STRUCTURE\n`;
    content += `${'-'.repeat(30)}\n`;
    content += generateTreeText(structure);
    content += `\n\n`;
    
    // Add file contents
    content += `FILE CONTENTS\n`;
    content += `${'-'.repeat(30)}\n\n`;
    
    const allFiles = getAllFiles(structure);
    allFiles.forEach((file, index) => {
      const fileContent = fileContents[file.path];
      
      // File header
      content += `${file.path}\n`;
      content += `${'-'.repeat(file.path.length)}\n`;
      
      if (fileContent && fileContent.trim()) {
        content += `${fileContent}\n`;
      } else {
        content += `[Content not available or binary file]\n`;
      }
      
      // Add separator between files (except for the last file)
      if (index < allFiles.length - 1) {
        content += `\n\n`;
      }
    });
    
    // Create and trigger download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleFileVisibility = (filePath: string) => {
    const newVisible = new Set(visibleFiles);
    if (newVisible.has(filePath)) {
      newVisible.delete(filePath);
    } else {
      newVisible.add(filePath);
    }
    setVisibleFiles(newVisible);
  };

  const toggleAllContents = () => {
    setShowAllContents(!showAllContents);
    if (!showAllContents) {
      // Show all files
      const allFiles = getAllFiles(structure);
      setVisibleFiles(new Set(allFiles.map(f => f.path)));
    } else {
      // Hide all files
      setVisibleFiles(new Set());
    }
  };

  const stats = getStats(structure);
  const allFiles = getAllFiles(structure);
  const filesWithContent = allFiles.filter(file => fileContents[file.path]);

  return (
    <div className="space-y-6">
      {/* Tree Structure Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Project Structure</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{stats.files} files</Badge>
              <Badge variant="outline">{stats.directories} folders</Badge>
            </div>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search files and folders..."
                value={internalSearchTerm}
                onChange={(e) => setInternalSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={downloadCompleteProject}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Complete
            </Button>
          </div>
          
          {(stats.new > 0 || stats.updated > 0) && (
            <div className="flex items-center gap-2 text-sm">
              {stats.new > 0 && (
                <Badge className="bg-green-100 text-green-800">
                  {stats.new} new
                </Badge>
              )}
              {stats.updated > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  {stats.updated} updated
                </Badge>
              )}
              {stats.existing > 0 && (
                <Badge className="bg-gray-100 text-gray-600">
                  {stats.existing} existing
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="border rounded-lg max-h-96 overflow-y-auto">
            {structure.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No files to display
              </div>
            ) : (
              <div className="p-2">
                {structure.map((node) => (
                  <TreeNode 
                    key={node.path} 
                    node={node} 
                    level={0} 
                    searchTerm={effectiveSearchTerm}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Contents Section */}
      {allFiles.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                <span>File Contents</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {filesWithContent.length} of {allFiles.length} files loaded
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAllContents}
                  className="flex items-center gap-2"
                >
                  {showAllContents ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide All
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Show All
                    </>
                  )}
                </Button>
              </div>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Click on individual file headers to toggle visibility
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {allFiles.map((file) => (
              <FileContent
                key={file.path}
                node={file}
                content={fileContents[file.path]}
                isVisible={visibleFiles.has(file.path)}
                onToggleVisibility={() => toggleFileVisibility(file.path)}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}