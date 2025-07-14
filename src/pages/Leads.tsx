import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Import modals
import { UploadLeadsModal } from "@/components/leads/UploadLeadsModal";

interface LeadsList {
  id: string;
  name: string;
  created_at: string;
  leads_count: number;
}

export default function Leads() {
  const [leadLists, setLeadLists] = useState<LeadsList[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userProfile } = useAuth();

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadLeadLists();
  }, []);

  const loadLeadLists = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      // Get storage files to show lead lists
      const { data: files, error } = await supabase.storage
        .from('user-settings')
        .list(`${userProfile.id}/leads/`, {
          limit: 100,
          offset: 0,
        });

      if (error) throw error;
      
      const csvFiles = files?.filter(file => 
        file.name.endsWith('.csv') || file.name.endsWith('.xlsx')
      ) || [];

      const leadLists = csvFiles.map(file => ({
        id: file.id || file.name,
        name: file.name.replace(/\.(csv|xlsx)$/, ''),
        created_at: file.created_at || new Date().toISOString(),
        leads_count: 0 // This would need to be calculated if needed
      }));

      setLeadLists(leadLists);
    } catch (error) {
      console.error('Error loading lead lists:', error);
      toast({
        title: "Error",
        description: "Failed to load lead lists",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLeadLists = leadLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage lead lists for AI agents
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowUploadModal(true)}>
            📤 Upload Leads File
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-foreground">{leadLists.length}</div>
            <p className="text-sm text-muted-foreground">Lead Lists</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-success">Available for AI agents</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">AI Ready</div>
            <p className="text-sm text-muted-foreground">Agent Assignment</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-xs text-primary">Automated dialing</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-business-sm border-border/50">
        <CardHeader>
          <CardTitle>Search Lead Lists</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search lead lists by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10"
          />
        </CardContent>
      </Card>

      {/* Lead Lists */}
      <Card className="shadow-business-sm border-border/50">
        <CardHeader>
          <CardTitle>Uploaded Lead Lists ({filteredLeadLists.length})</CardTitle>
          <CardDescription>
            Lead files uploaded for AI agent assignment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading lead lists...</div>
          ) : filteredLeadLists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No lead lists uploaded yet.</p>
              <Button variant="outline" onClick={() => setShowUploadModal(true)}>
                📤 Upload Your First Lead List
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLeadLists.map((list) => (
                <Card key={list.id} className="border border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{list.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Uploaded {new Date(list.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        📋 List
                      </Badge>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">
                        Available for AI agent assignment
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Upload Instructions */}
      <Card className="shadow-business-sm border-border/50 bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">📋 File Upload Guidelines</CardTitle>
          <CardDescription>
            Upload leads efficiently using CSV or Excel files for AI agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Supported formats:</p>
              <ul className="text-sm space-y-1 text-foreground">
                <li>• CSV files (.csv)</li>
                <li>• Excel files (.xlsx, .xls)</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Required columns:</p>
              <ul className="text-sm space-y-1 text-foreground">
                <li>• Name (required)</li>
                <li>• Phone (for AI dialing)</li>
                <li>• Email (optional)</li>
                <li>• Company (optional)</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)}>
              📤 Upload Lead List
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <UploadLeadsModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)}
        onSuccess={loadLeadLists}
      />
    </div>
  );
}