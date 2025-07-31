'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
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
  Download,
  FileText,
  FolderOpen
} from 'lucide-react';
import { FileNode, ProjectSnapshot } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { applyComparisonToStructure, compareProjects, downloadProjectStructure } from '@/lib/utils';

// Enhanced FileUpload component with proper ZIP handling
function EnhancedFileUpload({ onStructureParsed }: { onStructureParsed: (structure: FileNode[], zipFile: File, fileContents: Record<string, string>) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      setError('Please upload a ZIP file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Import JSZip dynamically
      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync(file);
      
      // Parse structure and extract contents simultaneously
      const { structure, fileContents } = await parseZipWithContents(zip);
      
      if (structure.length === 0) {
        setError('No files found in the ZIP archive');
        return;
      }

      // Call the callback with both structure and file contents
      onStructureParsed(structure, file, fileContents);
      
    } catch (error) {
      console.error('Error processing ZIP file:', error);
      setError('Failed to process ZIP file. Please ensure it\'s a valid ZIP archive.');
    } finally {
      setUploading(false);
    }
  };

  // Enhanced ZIP parsing with content extraction
  const parseZipWithContents = async (zip: any): Promise<{ structure: FileNode[], fileContents: Record<string, string> }> => {
    const structure: FileNode[] = [];
    const fileContents: Record<string, string> = {};
    const pathMap = new Map<string, FileNode>();

    // Get all files and sort them
    const sortedFiles = Object.keys(zip.files).sort();
    
    for (const path of sortedFiles) {
      const zipEntry = zip.files[path];
      const segments = path.split('/').filter(Boolean);
      
      if (segments.length === 0) continue;

      let currentLevel = structure;
      let currentPath = '';

      // Build the tree structure
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        currentPath += (currentPath ? '/' : '') + segment;
        
        let node = currentLevel.find(n => n.name === segment);
        
        if (!node) {
          const isDirectory = i < segments.length - 1 || zipEntry.dir;
          
          node = {
            name: segment,
            type: isDirectory ? 'directory' : 'file',
            path: currentPath,
            children: isDirectory ? [] : undefined,
            lastModified: zipEntry.date || new Date()
          };
          
          // Extract file content for text files
          if (!isDirectory && zipEntry.async) {
            try {
              // Check if file is likely text-based
              if (isTextFile(segment)) {
                const content = await zipEntry.async('string');
                if (content.length < 5000000 && !content.includes('\0')) { // < 5MB and no null bytes
                  fileContents[currentPath] = content;
                  console.log(`Extracted content for: ${currentPath} (${content.length} chars)`);
                }
              }
            } catch (error) {
              console.warn(`Could not extract content for ${currentPath}:`, error);
            }
          }
          
          currentLevel.push(node);
          pathMap.set(currentPath, node);
        }
        
        if (node.type === 'directory' && node.children) {
          currentLevel = node.children;
        }
      }
    }

    console.log(`Parsed structure: ${structure.length} root items`);
    console.log(`Extracted content for ${Object.keys(fileContents).length} files`);
    
    return { structure, fileContents };
  };

  // Enhanced text file detection
  const isTextFile = (filename: string): boolean => {
    const name = filename.toLowerCase();
    
    // Code files
    if (/\.(js|jsx|ts|tsx|mjs|cjs|vue|svelte)$/i.test(name)) return true;
    
    // Config files
    if (/\.(json|yaml|yml|toml|ini|conf|config)$/i.test(name)) return true;
    
    // Web files
    if (/\.(html|htm|css|scss|sass|less|xml|svg)$/i.test(name)) return true;
    
    // Documentation
    if (/\.(md|txt|rst|asciidoc|adoc)$/i.test(name)) return true;
    
    // Data files
    if (/\.(csv|tsv|log|sql)$/i.test(name)) return true;
    
    // Script files
    if (/\.(sh|bash|zsh|fish|ps1|bat|cmd|py|rb|php|go|rs|java|cpp|c|h|swift|kt|scala)$/i.test(name)) return true;
    
    // Special files (no extension)
    if (/^(readme|license|changelog|contributing|todo|dockerfile|makefile|gitignore|dockerignore|eslintrc|prettierrc|babelrc)$/i.test(name)) return true;
    
    // Package/config files
    if (/(package\.json|package-lock\.json|yarn\.lock|composer\.json|requirements\.txt|pipfile|gemfile|cargo\.toml|go\.mod|pom\.xml|build\.gradle|tsconfig\.json|jsconfig\.json)$/i.test(name)) return true;
    
    // Environment files
    if (/\.env/i.test(name)) return true;
    
    return false;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Project ZIP
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="space-y-4">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-lg font-medium">Upload your project</h3>
                <p className="text-gray-600">Select a ZIP file containing your project structure</p>
              </div>
              <div>
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="zip-upload"
                />
                <label
                  htmlFor="zip-upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? 'Processing...' : 'Choose ZIP File'}
                </label>
              </div>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="text-sm text-gray-600">
            <p><strong>Supported files:</strong> JavaScript, TypeScript, JSON, Markdown, CSS, HTML, Python, and more</p>
            <p><strong>File size limit:</strong> Up to 5MB per file</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentStructure, setCurrentStructure] = useState<FileNode[]>([]);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
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

  // Enhanced structure parsing handler
  const handleStructureParsed = (structure: FileNode[], zipFile: File, contents: Record<string, string>) => {
    console.log('Structure parsed:', structure.length, 'items');
    console.log('File contents extracted:', Object.keys(contents).length, 'files');
    
    setCurrentStructure(structure);
    setFileContents(contents);
    setCurrentSnapshot(undefined);
    setActiveTab('upload');
  };

  const handleSnapshotSelect = (snapshot: ProjectSnapshot) => {
    setCurrentSnapshot(snapshot);
    setCurrentStructure(snapshot.structure);
    setFileContents({}); // Clear file contents as they're not stored in snapshots
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

  const clearProject = () => {
    setCurrentStructure([]);
    setFileContents({});
    setCurrentSnapshot(undefined);
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

    const filesWithContent = Object.keys(fileContents).length;
    const totalContentSize = Object.values(fileContents).reduce((sum, content) => sum + content.length, 0);

    return { totalFiles, totalFolders, filesWithContent, totalContentSize };
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
            Upload, visualize, and analyze your project structures with complete file content extraction.
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
                  <EnhancedFileUpload onStructureParsed={handleStructureParsed} />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold">Current Project</h2>
                        {currentSnapshot && (
                          <Badge variant="outline">{currentSnapshot.name}</Badge>
                        )}
                        {stats.filesWithContent > 0 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <FileText className="w-3 h-3 mr-1" />
                            {stats.filesWithContent} files with content
                          </Badge>
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
                          Download Structure
                        </Button>
                        <Button onClick={() => setSaveDialogOpen(true)} size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save Project
                        </Button>
                        <Button 
                          onClick={clearProject} 
                          variant="outline" 
                          size="sm"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    <ProjectTree 
                      structure={currentStructure} 
                      fileContents={fileContents}
                      projectName={currentSnapshot?.name || 'Project'}
                    />
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

          {/* Enhanced Sidebar */}
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
                    clearProject();
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

            {/* Enhanced Project Stats */}
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
                      <span>Files with Content:</span>
                      <span className="font-medium text-green-600">{stats.filesWithContent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Content Size:</span>
                      <span className="font-medium text-blue-600">
                        {(stats.totalContentSize / 1024).toFixed(1)} KB
                      </span>
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
                  <p>2. View structure and file contents</p>
                  <p>3. Download complete project report</p>
                  <p>4. Save snapshots for comparison</p>
                  <p>5. Track changes over time</p>
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