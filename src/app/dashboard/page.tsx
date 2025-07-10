'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { FileUpload } from '@/components/project/FileUpload';
import { ProjectTree } from '@/components/project/ProjectTree';
import { ProjectHistory } from '@/components/project/ProjectHistory';
import { ProjectComparison } from '@/components/project/ProjectComparison';
import { ClientWrapper } from '@/components/ClientWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Upload, 
  History as HistoryIcon,
  GitCompare,
  AlertCircle,
  CheckCircle,
  Download
} from 'lucide-react';
import { FileNode, ProjectSnapshot } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { applyComparisonToStructure, compareProjects, downloadProjectStructure } from '@/lib/utils';

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentStructure, setCurrentStructure] = useState<FileNode[]>([]);
  const [currentSnapshot, setCurrentSnapshot] = useState<ProjectSnapshot | undefined>(undefined);
  const [comparisonSnapshots, setComparisonSnapshots] = useState<{
    snapshot1: ProjectSnapshot;
    snapshot2: ProjectSnapshot;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'history' | 'compare'>('upload');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Redirect to home page if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Redirecting to home...</p>
        </div>
      </div>
    );
  }

  const handleStructureParsed = (structure: FileNode[]) => {
    setCurrentStructure(structure);
    setCurrentSnapshot(undefined);
    setActiveTab('upload');
  };

  const handleSnapshotSelect = (snapshot: ProjectSnapshot) => {
    setCurrentSnapshot(snapshot);
    setCurrentStructure(snapshot.structure);
    setActiveTab('upload');
  };

  const handleCompareSnapshots = (snapshot1: ProjectSnapshot, snapshot2: ProjectSnapshot) => {
    setComparisonSnapshots({ snapshot1, snapshot2 });
    setActiveTab('compare');
  };

  const handleSaveProject = async () => {
    if (!projectName.trim() || currentStructure.length === 0) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
          structure: currentStructure,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      const savedSnapshot = await response.json();
      setCurrentSnapshot(savedSnapshot);
      setSaveMessage({ type: 'success', text: 'Project saved successfully!' });
      setSaveDialogOpen(false);
      setProjectName('');
      setProjectDescription('');
    } catch (error) {
      setSaveMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to save project' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCompareWithPrevious = async () => {
    if (!currentSnapshot || currentStructure.length === 0) return;

    const { data: snapshots } = await supabase
      .from('project_snapshots')
      .select('*')
      .lt('created_at', currentSnapshot.created_at)
      .order('created_at', { ascending: false })
      .limit(1);

    if (snapshots && snapshots.length > 0) {
      const comparison = compareProjects(snapshots[0].structure, currentStructure);
      const updatedStructure = applyComparisonToStructure(currentStructure, comparison);
      setCurrentStructure(updatedStructure);
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

    return { totalFiles, totalFolders };
  };

  const stats = getProjectStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            Upload, visualize, and track your project structures over time.
          </p>
        </div>

        {saveMessage && (
          <Alert 
            variant={saveMessage.type === 'error' ? 'destructive' : 'default'}
            className="mb-6"
          >
            {saveMessage.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{saveMessage.text}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'upload' ? 'default' : 'outline'}
                onClick={() => setActiveTab('upload')}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Project View
              </Button>
              <Button
                variant={activeTab === 'history' ? 'default' : 'outline'}
                onClick={() => setActiveTab('history')}
                className="flex items-center gap-2"
              >
                <HistoryIcon className="w-4 h-4" />
                History
              </Button>
              {comparisonSnapshots && (
                <Button
                  variant={activeTab === 'compare' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('compare')}
                  className="flex items-center gap-2"
                >
                  <GitCompare className="w-4 h-4" />
                  Compare
                </Button>
              )}
            </div>

            {/* Content based on active tab */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                {currentStructure.length === 0 ? (
                  <FileUpload onStructureParsed={handleStructureParsed} />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold">Current Project</h2>
                        {currentSnapshot && (
                          <Badge variant="outline">{currentSnapshot.name}</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {currentSnapshot && (
                          <Button
                            onClick={handleCompareWithPrevious}
                            variant="outline"
                            size="sm"
                          >
                            <GitCompare className="w-4 h-4 mr-2" />
                            Compare with Previous
                          </Button>
                        )}
                        <Button 
                          onClick={() => downloadProjectStructure(currentStructure, currentSnapshot?.name || 'Project')}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button onClick={() => setSaveDialogOpen(true)} size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save Project
                        </Button>
                        <Button 
                          onClick={() => setCurrentStructure([])} 
                          variant="outline" 
                          size="sm"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    <ProjectTree structure={currentStructure} />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <ProjectHistory
                onSnapshotSelect={handleSnapshotSelect}
                onCompareSnapshots={handleCompareSnapshots}
                currentSnapshot={currentSnapshot}
              />
            )}

            {activeTab === 'compare' && comparisonSnapshots && (
              <ProjectComparison
                snapshot1={comparisonSnapshots.snapshot1}
                snapshot2={comparisonSnapshots.snapshot2}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full justify-start" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setCurrentStructure([]);
                    setActiveTab('upload');
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Project
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab('history')}
                >
                  <HistoryIcon className="w-4 h-4 mr-2" />
                  View History
                </Button>
                {currentStructure.length > 0 && (
                  <Button 
                    className="w-full justify-start" 
                    variant="default" 
                    size="sm"
                    onClick={() => downloadProjectStructure(currentStructure, currentSnapshot?.name || 'Project')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Structure
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Project Stats */}
            {currentStructure.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Project Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Files:</span>
                      <span className="font-medium">{stats.totalFiles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Folders:</span>
                      <span className="font-medium">{stats.totalFolders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Items:</span>
                      <span className="font-medium">{stats.totalFiles + stats.totalFolders}</span>
                    </div>
                    {currentSnapshot && (
                      <div className="pt-2 border-t">
                        <div className="flex justify-between">
                          <span>Saved:</span>
                          <span className="text-xs text-gray-600">
                            {new Date(currentSnapshot.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">How to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>1. Upload a ZIP file of your project</p>
                  <p>2. View and analyze the structure</p>
                  <p>3. Save snapshots for comparison</p>
                  <p>4. Track changes over time</p>
                  <p>5. Download formatted structure</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Dialog */}
        {saveDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Save Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <Label htmlFor="project-description">Description (Optional)</Label>
                  <Textarea
                    id="project-description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setSaveDialogOpen(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProject}
                    disabled={!projectName.trim() || saving}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ClientWrapper>
      <DashboardContent />
    </ClientWrapper>
  );
}