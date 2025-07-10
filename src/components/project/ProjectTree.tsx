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
  Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileNode } from '@/lib/types';
import { formatFileSize } from '@/lib/utils';

interface ProjectTreeProps {
  structure: FileNode[];
  searchTerm?: string;
}

interface TreeNodeProps {
  node: FileNode;
  level: number;
  searchTerm?: string;
}

function TreeNode({ node, level, searchTerm }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Changed to true for full expansion
  
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

export function ProjectTree({ structure, searchTerm }: ProjectTreeProps) {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
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

  const stats = getStats(structure);

  return (
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
  );
}