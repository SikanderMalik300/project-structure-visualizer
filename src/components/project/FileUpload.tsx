'use client';

import { useState, useCallback } from 'react';
import { Upload, FileArchive, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { parseZipFile } from '@/lib/utils';
import { FileNode } from '@/lib/types';

interface FileUploadProps {
  onStructureParsed: (structure: FileNode[]) => void;
  loading?: boolean;
}

export function FileUpload({ onStructureParsed, loading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setProcessing(true);

    try {
      if (!file.name.endsWith('.zip')) {
        throw new Error('Please upload a ZIP file');
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        throw new Error('File size must be less than 50MB');
      }

      const structure = await parseZipFile(file);
      onStructureParsed(structure);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setProcessing(false);
    }
  }, [onStructureParsed]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileArchive className="w-5 h-5" />
          Upload Project
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">
            Drag & drop your project ZIP file here
          </p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          
          <input
            type="file"
            accept=".zip"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={processing || loading}
          />
          
          <Button
            asChild
            variant="outline"
            disabled={processing || loading}
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              {processing ? 'Processing...' : 'Choose File'}
            </label>
          </Button>
          
          <p className="text-xs text-gray-500 mt-2">
            Maximum file size: 50MB
          </p>
        </div>
      </CardContent>
    </Card>
  );
}