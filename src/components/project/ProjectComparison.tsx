'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  GitCompare, 
  Plus, 
  Minus, 
  Pencil, 
  File, 
  Folder,
  Calendar,
  LucideIcon
} from 'lucide-react';
import { ProjectSnapshot } from '@/lib/types';
import { compareProjects, formatDate } from '@/lib/utils';

interface ProjectComparisonProps {
  snapshot1: ProjectSnapshot;
  snapshot2: ProjectSnapshot;
}

interface FileItem {
  path: string;
  type: 'file' | 'directory';
}

function FileList({ 
  files, 
  title, 
  icon: Icon, 
  colorClass 
}: { 
  files: FileItem[]; 
  title: string; 
  icon: LucideIcon; 
  colorClass: string; 
}) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className={`font-medium text-sm flex items-center gap-2 ${colorClass}`}>
        <Icon className="w-4 h-4" />
        {title} ({files.length})
      </h4>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {files.map((file, index) => (
          <div key={index} className="flex items-center gap-2 text-xs bg-gray-50 rounded px-2 py-1">
            {file.type === 'directory' ? (
              <Folder className="w-3 h-3 text-blue-500" />
            ) : (
              <File className="w-3 h-3 text-gray-500" />
            )}
            <span className="font-mono flex-1">{file.path}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectComparison({ snapshot1, snapshot2 }: ProjectComparisonProps) {
  const comparison = useMemo(() => {
    return compareProjects(snapshot1.structure, snapshot2.structure);
  }, [snapshot1.structure, snapshot2.structure]);

  const stats = {
    added: comparison.added.length,
    modified: comparison.modified.length,
    removed: comparison.removed.length,
    unchanged: comparison.unchanged.length
  };

  const totalChanges = stats.added + stats.modified + stats.removed;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="w-5 h-5" />
          Project Comparison
        </CardTitle>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="font-medium">From: {snapshot1.name}</p>
            <p className="text-gray-600 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(snapshot1.created_at)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">To: {snapshot2.name}</p>
            <p className="text-gray-600 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(snapshot2.created_at)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <Badge className="bg-green-100 text-green-800 w-full">
              +{stats.added}
            </Badge>
            <p className="text-xs text-gray-600 mt-1">Added</p>
          </div>
          <div className="text-center">
            <Badge className="bg-yellow-100 text-yellow-800 w-full">
              ~{stats.modified}
            </Badge>
            <p className="text-xs text-gray-600 mt-1">Modified</p>
          </div>
          <div className="text-center">
            <Badge className="bg-red-100 text-red-800 w-full">
              -{stats.removed}
            </Badge>
            <p className="text-xs text-gray-600 mt-1">Removed</p>
          </div>
          <div className="text-center">
            <Badge className="bg-gray-100 text-gray-600 w-full">
              ={stats.unchanged}
            </Badge>
            <p className="text-xs text-gray-600 mt-1">Unchanged</p>
          </div>
        </div>

        {totalChanges === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <GitCompare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No changes detected between these snapshots</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <FileList
              files={comparison.added}
              title="Added Files"
              icon={Plus}
              colorClass="text-green-700"
            />
            
            {comparison.added.length > 0 && comparison.modified.length > 0 && (
              <Separator />
            )}
            
            <FileList
              files={comparison.modified}
              title="Modified Files"
              icon={Pencil}
              colorClass="text-yellow-700"
            />
            
            {(comparison.added.length > 0 || comparison.modified.length > 0) && 
             comparison.removed.length > 0 && (
              <Separator />
            )}
            
            <FileList
              files={comparison.removed}
              title="Removed Files"
              icon={Minus}
              colorClass="text-red-700"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}