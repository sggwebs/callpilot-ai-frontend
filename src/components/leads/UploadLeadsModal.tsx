import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, FileText, Download, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import * as XLSX from 'xlsx';

interface UploadLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadLeadsModal({ isOpen, onClose, onSuccess }: UploadLeadsModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  const isValidFileType = (file: File) => {
    return allowedTypes.includes(file.type) || 
           file.name.toLowerCase().endsWith('.csv') || 
           file.name.toLowerCase().endsWith('.xlsx') ||
           file.name.toLowerCase().endsWith('.xls');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (!isValidFileType(file)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV or XLSX file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const parseCSV = async (text: string): Promise<any[]> => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV must have at least a header and one data row');
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
    const leads = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length >= 2 && values.some(v => v.length > 0)) {
        const leadData: any = {
          user_id: userProfile?.id,
          name: values[headers.indexOf('name')] || values[0] || 'Unknown',
          email: values[headers.indexOf('email')] || values[1] || '',
          phone: values[headers.indexOf('phone')] || values[2] || '',
          company: values[headers.indexOf('company')] || values[3] || '',
          source: values[headers.indexOf('source')] || 'csv_import',
          status: values[headers.indexOf('status')] || 'new',
          notes: values[headers.indexOf('notes')] || '',
          priority: parseInt(values[headers.indexOf('priority')]) || 1,
          lead_score: parseInt(values[headers.indexOf('lead_score')]) || 0,
          created_at: new Date().toISOString()
        };
        leads.push(leadData);
      }
    }

    return leads;
  };

  const parseXLSX = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length < 2) {
            throw new Error('Excel file must have at least a header and one data row');
          }

          const headers = (jsonData[0] as string[]).map(h => String(h).toLowerCase().trim());
          const leads = [];

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row && row.length >= 2 && row.some(v => v !== undefined && v !== null && String(v).trim().length > 0)) {
              const leadData: any = {
                user_id: userProfile?.id,
                name: String(row[headers.indexOf('name')] || row[0] || 'Unknown').trim(),
                email: String(row[headers.indexOf('email')] || row[1] || '').trim(),
                phone: String(row[headers.indexOf('phone')] || row[2] || '').trim(),
                company: String(row[headers.indexOf('company')] || row[3] || '').trim(),
                source: String(row[headers.indexOf('source')] || 'excel_import').trim(),
                status: String(row[headers.indexOf('status')] || 'new').trim(),
                notes: String(row[headers.indexOf('notes')] || '').trim(),
                priority: parseInt(String(row[headers.indexOf('priority')] || '1')) || 1,
                lead_score: parseInt(String(row[headers.indexOf('lead_score')] || '0')) || 0,
                created_at: new Date().toISOString()
              };
              leads.push(leadData);
            }
          }

          resolve(leads);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const uploadFile = async () => {
    if (!selectedFile || !userProfile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Parse the file
      setUploadProgress(20);
      let leadsData: any[] = [];

      if (selectedFile.name.toLowerCase().endsWith('.csv')) {
        const text = await selectedFile.text();
        leadsData = await parseCSV(text);
      } else {
        leadsData = await parseXLSX(selectedFile);
      }

      if (leadsData.length === 0) {
        throw new Error('No valid lead data found in file');
      }

      setUploadProgress(40);

      // Step 2: Upload file to Supabase storage
      const fileName = `${userProfile.id}/${Date.now()}_${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('user-settings')
        .upload(fileName, selectedFile);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        // Continue without storage upload - it's not critical
      }

      setUploadProgress(60);

      // Step 3: Insert leads into database
      const { error: insertError } = await supabase
        .from('leads')
        .insert(leadsData);

      if (insertError) throw insertError;

      setUploadProgress(100);

      toast({
        title: "Success!",
        description: `Successfully imported ${leadsData.length} leads`,
      });

      setSelectedFile(null);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import leads. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "name,email,phone,company,source,status,notes,priority,lead_score\nJohn Doe,john@example.com,+1234567890,Example Corp,Website,new,Sample lead,1,50\nJane Smith,jane@example.com,+0987654321,Tech Inc,Social Media,warm,Interested prospect,2,75";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setSelectedFile(null);
    setUploading(false);
    setUploadProgress(0);
    setDragActive(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Leads
          </DialogTitle>
          <DialogDescription>
            Upload your leads from CSV or Excel files. Supported formats: .csv, .xlsx, .xls
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : selectedFile 
                  ? 'border-success bg-success/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />

            {selectedFile ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-8 w-8 text-success" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium text-foreground">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports CSV, XLSX, and XLS files (max 10MB)
                  </p>
                </div>
              </div>
            )}

            {uploading && (
              <div className="mt-4 space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          {/* Template Download */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Need a template?</h4>
                <p className="text-sm text-muted-foreground">
                  Download our CSV template with all the supported columns
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>

          {/* File Format Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-foreground mb-2">Required Columns:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• name (required)</li>
                <li>• email (recommended)</li>
                <li>• phone (recommended)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Optional Columns:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• company</li>
                <li>• source</li>
                <li>• status</li>
                <li>• notes</li>
                <li>• priority (1-5)</li>
                <li>• lead_score (0-100)</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button 
            onClick={uploadFile} 
            disabled={!selectedFile || uploading}
            className="min-w-[100px]"
          >
            {uploading ? "Importing..." : "Import Leads"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}