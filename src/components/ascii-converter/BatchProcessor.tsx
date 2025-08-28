
"use client";

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProcessingJob, ConversionSettings } from '@/types/ascii-converter';
import { ASCIIConverter } from '@/lib/ascii-converter';
import { Upload, X, Download, Play, Pause, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface BatchProcessorProps {
  settings: ConversionSettings;
}

export function BatchProcessor({ settings }: BatchProcessorProps) {
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Create converter instance with useMemo to avoid recreation on every render
  const converter = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new ASCIIConverter();
    }
    return null;
  }, []);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || !converter) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => converter.validateImageFile(file));
    
    if (validFiles.length !== fileArray.length) {
      toast.error('Some files were skipped due to invalid format or size');
    }

    const newJobs: ProcessingJob[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      fileName: file.name,
      status: 'pending',
      progress: 0,
      settings: { ...settings }
    }));

    setJobs(prev => [...prev, ...newJobs]);
    setSelectedFiles(prev => [...prev, ...validFiles]);
  }, [settings, converter]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const processJobs = async () => {
    if (isProcessing || !converter) return;
    
    setIsProcessing(true);
    const pendingJobs = jobs.filter(job => job.status === 'pending');
    
    for (let i = 0; i < pendingJobs.length; i++) {
      const job = pendingJobs[i];
      setCurrentJobIndex(i);
      
      try {
        // Update job status
        setJobs(prev => prev.map(j => 
          j.id === job.id ? { ...j, status: 'processing' as const } : j
        ));

        // Find the corresponding file
        const file = selectedFiles.find(f => f.name === job.fileName);
        
        if (!file) {
          throw new Error('File not found');
        }

        // Convert image
        const result = await converter.convertImageToASCII(
          file,
          job.settings,
          (progress) => {
            setJobs(prev => prev.map(j => 
              j.id === job.id ? { ...j, progress } : j
            ));
          }
        );

        // Update job with result
        setJobs(prev => prev.map(j => 
          j.id === job.id 
            ? { ...j, status: 'completed' as const, result, progress: 100 }
            : j
        ));

      } catch (error) {
        setJobs(prev => prev.map(j => 
          j.id === job.id 
            ? { 
                ...j, 
                status: 'error' as const, 
                error: error instanceof Error ? error.message : 'Unknown error',
                progress: 0
              }
            : j
        ));
      }
    }
    
    setIsProcessing(false);
    setCurrentJobIndex(0);
    toast.success('Batch processing completed!');
  };

  const removeJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setSelectedFiles(prev => prev.filter(f => f.name !== job.fileName));
    }
    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const clearCompleted = () => {
    const completedJobs = jobs.filter(job => job.status === 'completed');
    completedJobs.forEach(job => {
      setSelectedFiles(prev => prev.filter(f => f.name !== job.fileName));
    });
    setJobs(prev => prev.filter(job => job.status !== 'completed'));
  };

  const clearAll = () => {
    if (isProcessing) {
      toast.error('Cannot clear jobs while processing');
      return;
    }
    setJobs([]);
    setSelectedFiles([]);
  };

  const downloadResults = () => {
    const completedJobs = jobs.filter(job => job.status === 'completed' && job.result);
    
    if (completedJobs.length === 0) {
      toast.error('No completed jobs to download');
      return;
    }

    // Create a zip-like structure (simplified as concatenated text)
    const allResults = completedJobs.map(job => 
      `=== ${job.fileName} ===\n${job.result}\n\n`
    ).join('');

    const blob = new Blob([allResults], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch-ascii-art-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Batch results downloaded!');
  };

  const getStatusColor = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'processing': return 'default';
      case 'completed': return 'default'; // Changed from 'success' to 'default'
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'completed': return 'Completed';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Batch Processing</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={processJobs}
              disabled={isProcessing || jobs.filter(j => j.status === 'pending').length === 0}
            >
              {isProcessing ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadResults}
              disabled={jobs.filter(j => j.status === 'completed').length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
            <Button variant="outline" size="sm" onClick={clearCompleted}>
              Clear Completed
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll} disabled={isProcessing}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors relative
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
          `}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            disabled={isProcessing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className={`h-8 w-8 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="font-medium">
              {isDragActive ? 'Drop images here' : 'Add images to batch'}
            </p>
            <p className="text-sm text-muted-foreground">
              Drag & drop multiple images or click to select
            </p>
          </div>
        </div>

        {/* Job Queue */}
        {jobs.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                Queue ({jobs.length} jobs, {jobs.filter(j => j.status === 'completed').length} completed)
              </h3>
            </div>
            
            <ScrollArea className="h-64 border rounded-lg p-2">
              <div className="space-y-2">
                {jobs.map((job, index) => (
                  <div key={job.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{job.fileName}</p>
                        <Badge variant={getStatusColor(job.status) as any}>
                          {getStatusText(job.status)}
                        </Badge>
                      </div>
                      
                      {job.status === 'processing' && (
                        <Progress value={job.progress} className="h-2" />
                      )}
                      
                      {job.status === 'error' && job.error && (
                        <p className="text-sm text-destructive">{job.error}</p>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeJob(job.id)}
                      disabled={job.status === 'processing'}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Processing batch...</p>
              <p className="text-sm text-muted-foreground">
                {currentJobIndex + 1} of {jobs.filter(j => j.status === 'pending').length}
              </p>
            </div>
            <Progress 
              value={(currentJobIndex / jobs.filter(j => j.status === 'pending').length) * 100} 
              className="h-2"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
