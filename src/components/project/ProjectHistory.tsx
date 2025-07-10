'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  History, 
  Eye, 
  Trash2, 
  Calendar,
  FileText,
  AlertCircle,
  GitCompare
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { ProjectSnapshot } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ProjectHistoryProps {
  onSnapshotSelect: (snapshot: ProjectSnapshot) => void;
  onCompareSnapshots: (snapshot1: ProjectSnapshot, snapshot2: ProjectSnapshot) => void;
  currentSnapshot?: ProjectSnapshot | null | undefined;
}

export function ProjectHistory({ 
  onSnapshotSelect, 
  onCompareSnapshots, 
  currentSnapshot 
}: ProjectHistoryProps) {
  const [snapshots, setSnapshots] = useState<ProjectSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<ProjectSnapshot | null>(null);

  useEffect(() => {
    loadSnapshots();
  }, []);

  const loadSnapshots = async () => {
    try {
      const { data, error } = await supabase
        .from('project_snapshots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSnapshots(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load snapshots');
    } finally {
      setLoading(false);
    }
  };

  const deleteSnapshot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_snapshots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSnapshots(snapshots.filter(s => s.id !== id));
      
      if (selectedForComparison?.id === id) {
        setSelectedForComparison(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete snapshot');
    }
  };

  const handleCompareClick = (snapshot: ProjectSnapshot) => {
    if (selectedForComparison) {
      if (selectedForComparison.id === snapshot.id) {
        setSelectedForComparison(null);
      } else {
        onCompareSnapshots(selectedForComparison, snapshot);
        setSelectedForComparison(null);
      }
    } else {
      setSelectedForComparison(snapshot);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p>Loading project history...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Project History
          <Badge variant="outline">{snapshots.length}</Badge>
        </CardTitle>
        {selectedForComparison && (
          <Alert>
            <GitCompare className="h-4 w-4" />
            <AlertDescription>
              Select another snapshot to compare with &ldquo;{selectedForComparison.name}&rdquo;
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => setSelectedForComparison(null)}
                className="ml-2 p-0 h-auto"
              >
                Cancel
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {snapshots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No saved projects yet</p>
            <p className="text-sm">Upload and save a project to see it here</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {snapshots.map((snapshot) => (
              <div
                key={snapshot.id}
                className={`border rounded-lg p-3 transition-colors ${
                  currentSnapshot?.id === snapshot.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : selectedForComparison?.id === snapshot.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{snapshot.name}</h3>
                    {snapshot.description && (
                      <p className="text-xs text-gray-600 mt-1">
                        {snapshot.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(snapshot.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSnapshotSelect(snapshot)}
                      disabled={currentSnapshot?.id === snapshot.id}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={selectedForComparison?.id === snapshot.id ? "default" : "outline"}
                      onClick={() => handleCompareClick(snapshot)}
                    >
                      <GitCompare className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSnapshot(snapshot.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}