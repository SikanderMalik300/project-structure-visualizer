'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Upload, 
  History, 
  GitCompare,
  FolderTree,
  Calendar,
  FileText,
  Activity,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { ProjectSnapshot, FileNode } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface SidebarProps {
  currentStructure: FileNode[];
  currentSnapshot?: ProjectSnapshot | null | undefined;
  activeTab: 'upload' | 'history' | 'compare';
  onTabChange: (tab: 'upload' | 'history' | 'compare') => void;
  onNewProject: () => void;
  onSnapshotSelect?: (snapshot: ProjectSnapshot) => void;
}

export function Sidebar({ 
  currentStructure, 
  currentSnapshot, 
  activeTab, 
  onTabChange, 
  onNewProject,
  onSnapshotSelect 
}: SidebarProps) {
  const [recentProjects, setRecentProjects] = useState<ProjectSnapshot[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSidebarData();
  }, []);

  const loadSidebarData = async () => {
    try {
      setLoading(true);
      
      // Load recent projects
      const { data: recent, error: recentError } = await supabase
        .from('project_snapshots')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;
      setRecentProjects(recent || []);

      // Get total count
      const { count, error: countError } = await supabase
        .from('project_snapshots')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      setTotalProjects(count || 0);

    } catch (error) {
      console.error('Error loading sidebar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectStats = () => {
    const totalFiles = currentStructure.reduce((count, node) => {
      const countFiles = (n: FileNode): number => {
        if (n.type === 'file') return 1;
        return (n.children || []).reduce((c, child) => c + countFiles(child), 0);
      };
      return count + countFiles(node);
    }, 0);

    const totalFolders = currentStructure.reduce((count, node) => {
      const countFolders = (n: FileNode): number => {
        if (n.type === 'directory') {
          return 1 + (n.children || []).reduce((c, child) => c + countFolders(child), 0);
        }
        return 0;
      };
      return count + countFolders(node);
    }, 0);

    const statusCounts = currentStructure.reduce((counts, node) => {
      const countStatus = (n: FileNode) => {
        if (n.status === 'new') counts.new++;
        else if (n.status === 'updated') counts.updated++;
        else if (n.status === 'existing') counts.existing++;

        if (n.children) {
          n.children.forEach(countStatus);
        }
      };
      countStatus(node);
      return counts;
    }, { new: 0, updated: 0, existing: 0 });

    return { totalFiles, totalFolders, ...statusCounts };
  };

  const stats = getProjectStats();

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Navigation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            className="w-full justify-start" 
            variant={activeTab === 'upload' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTabChange('upload')}
          >
            <Upload className="w-4 h-4 mr-2" />
            Project View
          </Button>
          <Button 
            className="w-full justify-start" 
            variant={activeTab === 'history' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTabChange('history')}
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          {activeTab === 'compare' && (
            <Button 
              className="w-full justify-start" 
              variant="default"
              size="sm"
              onClick={() => onTabChange('compare')}
            >
              <GitCompare className="w-4 h-4 mr-2" />
              Compare
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            className="w-full justify-start" 
            variant="outline" 
            size="sm"
            onClick={onNewProject}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
          <Button 
            className="w-full justify-start" 
            variant="outline" 
            size="sm"
            onClick={() => onTabChange('history')}
          >
            <History className="w-4 h-4 mr-2" />
            Browse History
          </Button>
        </CardContent>
      </Card>

      {/* Current Project Stats */}
      {currentStructure.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <FolderTree className="w-4 h-4" />
              Current Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Basic Stats */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Files:</span>
                  <span className="font-medium">{stats.totalFiles}</span>
                </div>
                <div className="flex justify-between">
                  <span>Folders:</span>
                  <span className="font-medium">{stats.totalFolders}</span>
                </div>
              </div>

              {/* Status Breakdown */}
              {(stats.new > 0 || stats.updated > 0 || stats.existing > 0) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Status Breakdown:</p>
                    {stats.new > 0 && (
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          New
                        </Badge>
                        <span className="text-sm font-medium">{stats.new}</span>
                      </div>
                    )}
                    {stats.updated > 0 && (
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Updated
                        </Badge>
                        <span className="text-sm font-medium">{stats.updated}</span>
                      </div>
                    )}
                    {stats.existing > 0 && (
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                          Existing
                        </Badge>
                        <span className="text-sm font-medium">{stats.existing}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Current Snapshot Info */}
              {currentSnapshot && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">Snapshot:</p>
                    <p className="text-sm font-medium truncate">{currentSnapshot.name}</p>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(currentSnapshot.created_at)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Projects:</span>
              <span className="font-medium">{totalProjects}</span>
            </div>
            <div className="flex justify-between">
              <span>Recent Activity:</span>
              <span className="font-medium">{recentProjects.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Recent Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : recentProjects.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent projects
            </p>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-2 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSnapshotSelect?.(project)}
                >
                  <h4 className="font-medium text-sm truncate">{project.name}</h4>
                  {project.description && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              
              {recentProjects.length >= 5 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => onTabChange('history')}
                >
                  View All Projects
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}